export function rollExpression(expression: string): {
  total: number;
  details: string;
} {
  const regex = /(\d*)d(\d+)|[+\-*/()]|\d+/g; // Added `|\d+` to capture standalone numbers (bonuses)
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

        // Append the dice rolls to the detailed log
        detailedRolls += `[${rolls.join(', ')}]`;
        return total.toString(); // Replace dice roll in the expression with the total
      } else if (/^[+\-*/()]$/.test(match)) {
        // Append operators to the detailed log
        detailedRolls += ` ${match} `;
        return match; // Keep arithmetic operators as-is
      } else if (/^\d+$/.test(match)) {
        // Handle standalone numbers (bonuses)
        detailedRolls += `${match}`;
        return match; // Keep bonuses as-is
      }
      return match;
    }
  );

  try {
    // Evaluate the final expression
    const total = eval(finalExpression);
    return {
      total,
      details: `${detailedRolls} = ${total}`,
    };
  } catch (e) {
    return { total: 0, details: 'Error' };
  }
}

export function getButtons(): string[] {
  return [
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
  ];
}

export function randomMessage() {
  const messages = [
    'bruh',
    'But why though?',
    'Rolling the void... result: absolutely nothing.',
    'Are you trying to roll your existential dread?',
    'Nothing in, nothing out. Try again!',
    'The dice refuse to roll on an empty request!',
    "Hmm, I'm not sure what to do with that...",
    'The universe stares back at you... and does nothing.',
    'If you roll nothing, you get... nothing!',
    "That's an interesting strategy. Let's try some numbers!",
    'The dice are confused and so am I!',
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}
