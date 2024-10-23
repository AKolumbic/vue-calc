<template>
  <button @click="handleClick">{{ label }}</button>
</template>

<script>
export default {
  name: 'CalculatorButton',
  props: ['label'],
  methods: {
    handleClick() {
      this.$emit('button-click', this.label);
    },
  },
};
</script>

<style scoped>
button {
  font-size: 1.5em;
  padding: 10px;
}
</style>
