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
        <CalculatorButton label="C" @button-click="clearDisplay" />
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
          <!-- Split the rolled and total into separate lines -->
          <span class="rolled-message">{{ entry.split('(Total:')[0] }}</span>
          <span class="total-message"
            >(Total: {{ entry.split('(Total: ')[1] }}</span
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { rollExpression } from './calculatorMethods';
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
      buttons: [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '0',
        '+',
        '-',
        '*',
        '/',
        'd4',
        'd6',
        'd8',
        'd10',
        'd12',
        'd20',
        'd100',
      ],
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
      const { total, details } = rollExpression(this.display); // Get the total and details
      const entry = `Rolled ${this.display}: ${details}`;
      this.history.unshift(entry); // Add to history log
      localStorage.setItem('rollHistory', JSON.stringify(this.history)); // Persist to localStorage
      this.display = total.toString();
      this.clearDisplay();
    },
    // Method to clear the roll history
    clearHistory() {
      this.history = []; // Clear history array
      localStorage.removeItem('rollHistory'); // Remove from localStorage
    },
  },
};
</script>
