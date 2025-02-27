<template>
  <div class="dice-visualizer" v-if="rolls.length > 0">
    <h3 class="dice-title">Roll Results</h3>
    <div class="dice-container">
      <transition-group name="dice-roll">
        <div
          v-for="(roll, rollIndex) in rolls"
          :key="rollIndex"
          class="dice-group"
        >
          <div class="dice-type-label">{{ roll.dice }}:</div>
          <div class="dice-values">
            <div
              v-for="(value, valueIndex) in roll.values"
              :key="`${rollIndex}-${valueIndex}`"
              class="dice"
              :class="getDiceShape(roll.dice)"
              :style="{ backgroundColor: getDiceColor(roll.dice) }"
            >
              <span class="dice-value">{{ value }}</span>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { getDiceColor, getDiceShape } from '../Calculator/calculatorMethods';

export default {
  name: 'DiceVisualizer',
  props: {
    rolls: {
      type: Array,
      default: () => [],
      // Each roll has format { dice: 'd6', values: [3, 5] }
    },
  },
  methods: {
    getDiceColor,
    getDiceShape,
  },
};
</script>

<style scoped>
.dice-visualizer {
  margin: 20px 0 30px;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: rgba(249, 249, 249, 0.7);
}

.dice-title {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.4em;
  color: #333;
}

:deep(.dark-mode) .dice-title {
  color: #e0e0e0;
}

.dice-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  gap: 20px;
}

.dice-group {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.dark-mode) .dice-group {
  background-color: rgba(60, 60, 60, 0.6);
}

.dice-type-label {
  font-weight: bold;
  font-size: 1.2em;
  margin-right: 15px;
  min-width: 50px;
}

.dice-values {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.dice {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  transition: transform 0.5s ease-out;
}

.dice:hover {
  transform: rotate(360deg) scale(1.1);
  transition: transform 0.8s ease-out;
}

.dice-value {
  font-size: 1.4em;
  z-index: 2;
}

/* Dice Shapes */
.cube {
  border-radius: 8px;
}

.triangle {
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

.octahedron {
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}

.decahedron {
  clip-path: polygon(
    50% 0%,
    90% 20%,
    100% 60%,
    75% 100%,
    25% 100%,
    0% 60%,
    10% 20%
  );
}

.dodecahedron {
  clip-path: polygon(
    50% 0%,
    80% 10%,
    100% 35%,
    100% 70%,
    80% 90%,
    50% 100%,
    20% 90%,
    0% 70%,
    0% 35%,
    20% 10%
  );
}

.icosahedron {
  clip-path: polygon(
    50% 0%,
    85% 15%,
    100% 50%,
    85% 85%,
    50% 100%,
    15% 85%,
    0% 50%,
    15% 15%
  );
}

.percentile {
  border-radius: 50%;
}

/* Animation for dice rolls */
.dice-roll-enter-active {
  animation: roll-in 0.8s;
}

.dice-roll-leave-active {
  transition: opacity 0.5s;
  opacity: 0;
}

@keyframes roll-in {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(180deg);
    opacity: 0.7;
  }
  100% {
    transform: scale(1) rotate(360deg);
    opacity: 1;
  }
}
</style>
