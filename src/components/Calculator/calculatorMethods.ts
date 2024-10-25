export function rollExpression(expression: string): {
  total: number;
  details: string;
} {
  const regex = /(\d*)d(\d+)|[+\-*/()]/g;
  let finalExpression = expression;
  let detailedRolls = '';

  finalExpression = finalExpression.replace(
    regex,
    (match, numOfDice, diceSides): string => {
      if (numOfDice || diceSides) {
        // Dice roll logic
        const diceCount = parseInt(numOfDice) || 1;
        const sides = parseInt(diceSides);
        let total = 0;
        const rolls = [];

        for (let i = 0; i < diceCount; i++) {
          const roll = Math.floor(Math.random() * sides) + 1;
          rolls.push(roll);
          total += roll;
        }

        // Store individual rolls in the history log
        detailedRolls += `${match} rolled: [${rolls.join(', ')}], `;
        return total.toString(); // Replace dice roll in the expression with the total
      }
      return match; // Keep arithmetic operators as-is
    }
  );

  try {
    // Evaluate the expression after replacing dice rolls with their results
    const total = eval(finalExpression);
    return {
      total,
      details: `${detailedRolls} (Total: ${total})`,
    };
  } catch (e) {
    return { total: 0, details: 'Error' };
  }
}
