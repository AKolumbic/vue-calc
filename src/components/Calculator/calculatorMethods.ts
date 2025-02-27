export function rollExpression(expression: string): {
  total: number | undefined;
  details: string;
  rolls: { dice: string; values: number[] }[]; // Added for visual dice representation
} {
  // Improved regex to handle more complex expressions
  const regex = /(\d*)d(\d+)|[+\-*/()]|\d+/g;
  let finalExpression = expression;
  let detailedRolls = '';
  const allRolls: { dice: string; values: number[] }[] = [];

  try {
    finalExpression = finalExpression.replace(
      regex,
      (match, numOfDice, diceSides): string => {
        if (numOfDice !== undefined && diceSides !== undefined) {
          // Dice roll logic
          const diceCount = parseInt(numOfDice) || 1;
          const sides = parseInt(diceSides);

          // Validate dice values
          if (sides <= 0 || sides > 1000 || diceCount <= 0 || diceCount > 100) {
            throw new Error(`Invalid dice: ${diceCount}d${sides}`);
          }

          let total = 0;
          const rolls: number[] = [];

          for (let i = 0; i < diceCount; i++) {
            const roll = Math.floor(Math.random() * sides) + 1;
            rolls.push(roll);
            total += roll;
          }

          // Store the rolls for visual representation
          allRolls.push({ dice: `d${sides}`, values: rolls });

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

    // Evaluate the final expression with improved safety
    // Use Function instead of eval for better security
    // eslint-disable-next-line no-new-func
    const sanitizedExpr = finalExpression.replace(/[^0-9+\-*/(). ]/g, '');
    const result = new Function(`return ${sanitizedExpr}`)();

    // Validate result
    if (isNaN(result) || !isFinite(result)) {
      throw new Error('Invalid calculation result');
    }

    const total = Math.round(result * 100) / 100; // Round to 2 decimal places

    return {
      total,
      details: `${detailedRolls} = ${total}`,
      rolls: allRolls,
    };
  } catch (e) {
    console.error('Error calculating dice expression:', e);
    return {
      total: undefined,
      details: `Error: ${
        e instanceof Error ? e.message : 'Invalid expression'
      }`,
      rolls: [],
    };
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

// Helper function to get a color for each dice type
export function getDiceColor(diceType: string): string {
  const colorMap: Record<string, string> = {
    d4: '#FF5252', // Red
    d6: '#4CAF50', // Green
    d8: '#2196F3', // Blue
    d10: '#9C27B0', // Purple
    d12: '#FF9800', // Orange
    d20: '#FFEB3B', // Yellow
    d100: '#607D8B', // Blue Grey
  };

  return colorMap[diceType] || '#9E9E9E'; // Default grey
}

// Helper to determine dice shape (for CSS)
export function getDiceShape(diceType: string): string {
  const shapeMap: Record<string, string> = {
    d4: 'triangle',
    d6: 'cube',
    d8: 'octahedron',
    d10: 'decahedron',
    d12: 'dodecahedron',
    d20: 'icosahedron',
    d100: 'percentile',
  };

  return shapeMap[diceType] || 'cube';
}

// Parse the dice expression to extract components
export function parseDiceExpression(expression: string): {
  diceRolls: { count: number; sides: number }[];
  operators: string[];
  constants: number[];
} {
  const diceRolls: { count: number; sides: number }[] = [];
  const operators: string[] = [];
  const constants: number[] = [];

  // Regex to match dice notation (e.g., 2d6), operators, and constants
  const regex = /(\d*)d(\d+)|([+\-*/])|(\d+)/g;
  let match;

  while ((match = regex.exec(expression)) !== null) {
    if (match[1] !== undefined && match[2] !== undefined) {
      // Dice roll
      const count = parseInt(match[1]) || 1;
      const sides = parseInt(match[2]);
      diceRolls.push({ count, sides });
    } else if (match[3] !== undefined) {
      // Operator
      operators.push(match[3]);
    } else if (match[4] !== undefined) {
      // Constant
      constants.push(parseInt(match[4]));
    }
  }

  return { diceRolls, operators, constants };
}
