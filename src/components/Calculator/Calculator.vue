<template>
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
</template>

<script>
import { input, clear, calculate } from './calculatorMethods';
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
      ],
    };
  },
  methods: {
    handleInput(value) {
      this.display = input(value, this.display);
    },
    clearDisplay() {
      this.display = clear();
    },
    calculateResult() {
      this.display = calculate(this.display);
    },
  },
};
</script>
