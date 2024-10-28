<template>
  <div class="calculator-wrapper">
    <div class="calculator">
      <input type="text" v-model="display" disabled />
      <div class="buttons">
        <CalculatorButton
          v-for="btn in buttons"
          :key="btn"
          :label="btn"
          @button-click="handleInput(btn)"
        />
        <CalculatorButton label="Clear" @button-click="clearDisplay" />
        <CalculatorButton label="Clear History" @button-click="clearHistory" />
        <CalculatorButton label="=" @button-click="calculateResult" />
      </div>
    </div>

    <div class="history">
      <h3>Roll History</h3>
      <ul>
        <li
          v-for="(entry, index) in history"
          :key="index"
          class="history-entry"
        >
          <span class="rolled-message">{{ entry.split('(Total:')[0] }}</span>
          <!-- <span class="total-message"
            >(Total: {{ entry.split('(Total: ')[1] }}</span
          > -->
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getButtons, rollExpression, randomMessage } from './calculatorMethods';
import CalculatorButton from '../CalculatorButton/CalculatorButton.vue';
import './CalculatorStyles.scss';

export default {
  name: 'SimpleCalculator',
  components: {
    CalculatorButton,
  },
  data() {
    return {
      display: '',
      buttons: getButtons(),
      history: [], // Array to store roll history
    };
  },
  created() {
    // Load history from localStorage when the component is mounted
    const storedHistory = localStorage.getItem('rollHistory');
    if (storedHistory) {
      this.history = JSON.parse(storedHistory);
    }
  },
  methods: {
    handleInput(value) {
      this.display += value;
    },
    clearDisplay() {
      this.display = '';
    },
    calculateResult() {
      // Check if the display is empty, and if so, handle it with a random message
      if (!this.display) {
        this.addHistoryEntry(randomMessage());
        this.triggerShake();
        return;
      }

      // Calculate the result if display has content
      const { total, details } = rollExpression(this.display);

      // If there's no valid total, add a random message instead
      if (total === undefined) {
        this.addHistoryEntry(randomMessage());
      } else {
        // Add the actual roll result to the history
        const entry = `Rolled ${this.display}: ${details}`;
        this.addHistoryEntry(entry);
        this.display = total.toString();
      }

      // Trigger shake animation and clear the display for the next input
      this.triggerShake();
      this.clearDisplay();
    },

    // Helper method to add an entry to history and update localStorage
    addHistoryEntry(message) {
      this.history.unshift(message);
      localStorage.setItem('rollHistory', JSON.stringify(this.history));
    },
    triggerShake() {
      // Use $nextTick to ensure the DOM is updated
      this.$nextTick(() => {
        const mostRecentEntry = document.querySelector(
          '.history-entry:first-child'
        );
        if (mostRecentEntry) {
          mostRecentEntry.classList.add('shake');
          setTimeout(() => {
            mostRecentEntry.classList.remove('shake');
          }, 500); // Remove shake class after the animation (0.5s)
        }
      });
    },
    // Method to clear the roll history
    clearHistory() {
      this.history = []; // Clear history array
      localStorage.removeItem('rollHistory'); // Remove from localStorage
    },
  },
};
</script>
