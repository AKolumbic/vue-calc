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
        <CalculatorButton label="=" @button-click="calculateResult" />
      </div>
    </div>

    <div class="history">
      <h3>Roll History</h3>
      <ul>
        <li v-for="(entry, index) in history" :key="index">
          {{ entry }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { rollDice } from './calculatorMethods';
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
      if (this.display.match(/^\d*d\d+$/)) {
        // Handle dice notation like 2d6, 10d20, etc.
        const result = rollDice(this.display);
        const entry = `Rolled ${this.display}: ${result}`;
        this.history.unshift(entry); // Add to history
        localStorage.setItem('rollHistory', JSON.stringify(this.history)); // Persist to localStorage
        this.display = result.toString();
      } else {
        // Regular calculation for arithmetic
        try {
          this.display = eval(this.display);
        } catch (e) {
          this.display = 'Error';
        }
      }

      this.clearDisplay();
    },
  },
};
</script>
