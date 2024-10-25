// Function to roll dice based on dice notation, like 2d6 or 10d20
export function rollDice(notation: string): number | string {
  const regex = /^(\d*)d(\d+)$/;
  const match = notation.match(regex);

  if (!match) {
    return 'Invalid notation';
  }

  const numOfDice = parseInt(match[1]) || 1;
  const diceSides = parseInt(match[2]);

  let total = 0;
  const rolls = [];

  for (let i = 0; i < numOfDice; i++) {
    const roll = Math.floor(Math.random() * diceSides) + 1;
    rolls.push(roll);
    total += roll;
  }

  return `${rolls.join(', ')} (Total: ${total})`;
}
