<template>
  <div
    class="calculator-wrapper"
    tabindex="0"
    @keydown="handleKeyDown"
    ref="calculatorRef"
    :class="{ 'dark-mode': isDarkMode }"
  >
    <div class="theme-toggle">
      <button @click="toggleTheme" class="theme-button">
        {{ isDarkMode ? '☀️' : '🌙' }}
      </button>
    </div>

    <div class="calculator">
      <h2 class="calculator-title">Dice Calculator</h2>

      <input type="text" v-model="display" disabled />

      <!-- Add dice visualizer -->
      <DiceVisualizer :rolls="currentRolls" />

      <div class="buttons-container">
        <div class="button-group numbers-operators">
          <CalculatorButton
            v-for="btn in numericButtons"
            :key="btn"
            :label="btn"
            @button-click="handleInput(btn)"
          />
          <CalculatorButton
            label="="
            @button-click="calculateResult"
            class="equals-button"
          />
        </div>

        <div class="button-group dice-buttons">
          <CalculatorButton
            v-for="btn in diceButtons"
            :key="btn"
            :label="btn"
            @button-click="handleInput(btn)"
            class="dice-button"
          />
        </div>

        <div class="button-group action-buttons">
          <CalculatorButton label="Clear" @button-click="clearDisplay" />
          <CalculatorButton
            label="Clear History"
            @button-click="clearHistory"
          />
          <CalculatorButton
            label="Save as Favorite"
            @button-click="saveFavorite"
          />
        </div>
      </div>

      <div class="favorites" v-if="favorites.length > 0">
        <h4>Saved Expressions</h4>
        <div class="favorites-list">
          <span
            v-for="(fav, index) in favorites"
            :key="index"
            class="favorite-item"
            @click="loadFavorite(fav)"
          >
            {{ fav }}
            <button class="remove-favorite" @click.stop="removeFavorite(index)">
              ×
            </button>
          </span>
        </div>
      </div>

      <!-- Sound toggle button -->
      <div class="sound-toggle">
        <button @click="toggleSound" class="sound-button">
          {{ isSoundEnabled ? '🔊' : '🔇' }}
        </button>
      </div>
    </div>

    <div class="history">
      <h3>Roll History</h3>
      <ul>
        <li
          v-for="(entry, index) in history"
          :key="index"
          class="history-entry"
          :class="{ 'shake-animation': index === 0 && isShaking }"
        >
          <span class="rolled-message">{{ entry.split('(Total:')[0] }}</span>
          <span class="total-message" v-if="entry.includes('(Total:')">
            (Total: {{ entry.split('(Total: ')[1] }}
          </span>
          <button
            class="copy-button"
            @click="copyToClipboard(entry)"
            title="Copy to clipboard"
          >
            📋
          </button>
        </li>
      </ul>
      <div v-if="history.length === 0" class="empty-history">
        No rolls yet. Roll some dice!
      </div>
    </div>
  </div>
</template>

<script>
import { getButtons, rollExpression, randomMessage } from './calculatorMethods';
import CalculatorButton from '../CalculatorButton/CalculatorButton.vue';
import DiceVisualizer from '../DiceVisualizer/DiceVisualizer.vue';
import './CalculatorStyles.scss';

export default {
  name: 'SimpleCalculator',
  components: {
    CalculatorButton,
    DiceVisualizer,
  },
  data() {
    return {
      display: '',
      buttons: getButtons(),
      history: [], // Array to store roll history
      isDarkMode: false,
      favorites: [],
      maxHistorySize: 50, // Limit history size
      currentRolls: [], // Current dice rolls for visualization
      isSoundEnabled: true, // Sound effects toggle
      awaitingDiceType: false, // For keyboard shortcuts
      isShaking: false, // For controlling shake animation
    };
  },
  computed: {
    numericButtons() {
      return [
        '7',
        '8',
        '9',
        '+',
        '4',
        '5',
        '6',
        '-',
        '1',
        '2',
        '3',
        '*',
        '0',
        '(',
        ')',
        '/',
      ];
    },
    diceButtons() {
      return ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];
    },
  },
  created() {
    // Load history from localStorage when the component is mounted
    const storedHistory = localStorage.getItem('rollHistory');
    if (storedHistory) {
      this.history = JSON.parse(storedHistory);
      // Enforce history limit
      if (this.history.length > this.maxHistorySize) {
        this.history = this.history.slice(0, this.maxHistorySize);
        localStorage.setItem('rollHistory', JSON.stringify(this.history));
      }
    }

    // Load favorites
    const storedFavorites = localStorage.getItem('rollFavorites');
    if (storedFavorites) {
      this.favorites = JSON.parse(storedFavorites);
    }

    // Check for theme preference
    const storedTheme = localStorage.getItem('calculatorTheme');
    if (storedTheme) {
      this.isDarkMode = storedTheme === 'dark';
      this.applyTheme();
    }

    // Check sound preference
    const soundPref = localStorage.getItem('calculatorSound');
    if (soundPref !== null) {
      this.isSoundEnabled = soundPref === 'enabled';
    }
  },
  mounted() {
    // Focus the calculator wrapper for keyboard events
    this.$refs.calculatorRef.focus();
  },
  methods: {
    handleInput(value) {
      this.display += value;
    },
    clearDisplay() {
      this.display = '';
      // Clear visualized dice as well
      this.currentRolls = [];
    },
    calculateResult() {
      // Check if the display is empty, and if so, handle it with a random message
      if (!this.display) {
        this.addHistoryEntry(randomMessage());
        this.triggerShake();
        this.playSound('error');
        return;
      }

      // Calculate the result if display has content
      const { total, details, rolls } = rollExpression(this.display);

      // If there's no valid total, add a random message instead
      if (total === undefined) {
        this.addHistoryEntry(randomMessage());
        this.playSound('error');
      } else {
        // Add the actual roll result to the history
        const entry = `Rolled ${this.display}: ${details} (Total: ${total})`;
        this.addHistoryEntry(entry);

        // Keep the result in the display
        this.display = total.toString();

        // Set the current rolls for visualization
        this.currentRolls = rolls;

        // Play a dice rolling sound
        this.playSound('dice');
      }

      // Trigger shake animation
      this.triggerShake();
    },

    // Helper method to add an entry to history and update localStorage
    addHistoryEntry(message) {
      this.history.unshift(message);

      // Enforce history size limit
      if (this.history.length > this.maxHistorySize) {
        this.history = this.history.slice(0, this.maxHistorySize);
      }

      localStorage.setItem('rollHistory', JSON.stringify(this.history));
    },
    triggerShake() {
      // Set shake flag to trigger the animation
      this.isShaking = true;

      // Remove the shake class after animation completes
      setTimeout(() => {
        this.isShaking = false;
      }, 500);
    },
    // Method to clear the roll history
    clearHistory() {
      this.history = []; // Clear history array
      localStorage.removeItem('rollHistory'); // Remove from localStorage
      this.playSound('clear');
    },
    // Theme toggle
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      localStorage.setItem(
        'calculatorTheme',
        this.isDarkMode ? 'dark' : 'light'
      );
      this.applyTheme();
      this.playSound('click');
    },
    applyTheme() {
      document.body.classList.toggle('dark-mode', this.isDarkMode);
    },
    // Handle keyboard input
    handleKeyDown(event) {
      // Handle number keys and operators
      if (/^[0-9+\-*/()]$/.test(event.key)) {
        this.handleInput(event.key);
        this.playSound('click');
        event.preventDefault();
      }
      // Handle Enter key for calculation
      else if (event.key === 'Enter') {
        this.calculateResult();
        event.preventDefault();
      }
      // Handle Escape key for clearing the display
      else if (event.key === 'Escape') {
        this.clearDisplay();
        this.playSound('clear');
        event.preventDefault();
      }
      // Handle Backspace
      else if (event.key === 'Backspace') {
        this.display = this.display.slice(0, -1);
        this.playSound('click');
        event.preventDefault();
      }
      // Handle dice shortcuts (d4, d6, etc.)
      else if (event.key === 'd' || event.key === 'D') {
        // Wait for the next key to determine dice type
        this.awaitingDiceType = true;
        event.preventDefault();
      } else if (this.awaitingDiceType) {
        const diceMap = {
          4: 'd4',
          6: 'd6',
          8: 'd8',
          1: 'd10', // 1 for d10
          2: 'd20', // 2 for d20
          0: 'd100', // 0 for d100
        };

        if (diceMap[event.key]) {
          this.handleInput(diceMap[event.key]);
          this.playSound('click');
        }

        this.awaitingDiceType = false;
        event.preventDefault();
      }
    },
    // Favorites functionality
    saveFavorite() {
      if (this.display && !this.favorites.includes(this.display)) {
        this.favorites.push(this.display);
        localStorage.setItem('rollFavorites', JSON.stringify(this.favorites));
        this.playSound('save');
      }
    },
    loadFavorite(favorite) {
      this.display = favorite;
      this.playSound('click');
    },
    removeFavorite(index) {
      this.favorites.splice(index, 1);
      localStorage.setItem('rollFavorites', JSON.stringify(this.favorites));
      this.playSound('clear');
    },
    // Copy to clipboard functionality
    copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        this.playSound('click');
        // More subtle notification instead of alert
        const notification = document.createElement('div');
        notification.textContent = 'Copied to clipboard!';
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 10px 20px;
          border-radius: 4px;
          z-index: 1000;
          font-size: 14px;
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
          notification.style.opacity = '0';
          notification.style.transition = 'opacity 0.5s';
          setTimeout(() => document.body.removeChild(notification), 500);
        }, 1500);
      });
    },
    // Sound related methods
    toggleSound() {
      this.isSoundEnabled = !this.isSoundEnabled;
      localStorage.setItem(
        'calculatorSound',
        this.isSoundEnabled ? 'enabled' : 'disabled'
      );
    },
    playSound(type) {
      if (!this.isSoundEnabled) return;

      // These would be better implemented with actual sound files
      // For a simple implementation, we can use the Web Audio API
      const context = new (window.AudioContext || window.webkitAudioContext)();

      let oscillator = context.createOscillator();
      let gainNode = context.createGain();

      // Configure sound based on type
      switch (type) {
        case 'dice':
          // Random dice rolling sound
          oscillator.type = 'sawtooth';
          oscillator.frequency.setValueAtTime(150, context.currentTime);
          oscillator.frequency.linearRampToValueAtTime(
            450,
            context.currentTime + 0.1
          );
          gainNode.gain.setValueAtTime(0.15, context.currentTime);
          gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.3);
          break;
        case 'click':
          // Button click sound
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(800, context.currentTime);
          gainNode.gain.setValueAtTime(0.1, context.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            context.currentTime + 0.1
          );
          break;
        case 'error':
          // Error sound
          oscillator.type = 'square';
          oscillator.frequency.setValueAtTime(110, context.currentTime);
          oscillator.frequency.setValueAtTime(90, context.currentTime + 0.1);
          gainNode.gain.setValueAtTime(0.15, context.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            context.currentTime + 0.3
          );
          break;
        case 'save':
          // Save sound
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(400, context.currentTime);
          oscillator.frequency.linearRampToValueAtTime(
            600,
            context.currentTime + 0.1
          );
          gainNode.gain.setValueAtTime(0.1, context.currentTime);
          gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.2);
          break;
        case 'clear':
          // Clear sound
          oscillator.type = 'triangle';
          oscillator.frequency.setValueAtTime(350, context.currentTime);
          oscillator.frequency.linearRampToValueAtTime(
            100,
            context.currentTime + 0.1
          );
          gainNode.gain.setValueAtTime(0.1, context.currentTime);
          gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.2);
          break;
      }

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.start();
      oscillator.stop(context.currentTime + 0.5);
    },
  },
};
</script>
