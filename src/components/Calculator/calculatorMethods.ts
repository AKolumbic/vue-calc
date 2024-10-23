export function input(value: string, display: string) {
  return display + value;
}

export function clear() {
  return '';
}

export function calculate(display: string) {
  try {
    return eval(display);
  } catch (e) {
    return 'Error';
  }
}

// Function to roll dice based on dice notation, like 2d6 or 10d20
export function rollDice(notation: string): number | string {
  const regex = /^(\d*)d(\d+)$/; // Regex to parse dice notation like 2d6, 10d20, etc.
  const match = notation.match(regex);

  if (!match) {
    return 'Invalid notation'; // Return error if the notation doesn't match
  }

  const numOfDice = parseInt(match[1]) || 1; // Default to 1 if no number is given
  const diceSides = parseInt(match[2]);

  let total = 0;
  for (let i = 0; i < numOfDice; i++) {
    total += Math.floor(Math.random() * diceSides) + 1;
  }

  return total;
}
