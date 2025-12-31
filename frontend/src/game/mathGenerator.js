export function generateMathQuestion(difficulty, operation) {
  let question, answer, options;

  const getNumberRange = () => {
    switch (difficulty) {
      case "easy":
        return { min: 1, max: 20 };
      case "medium":
        return { min: 1, max: 50 };
      case "hard":
        return { min: 100, max: 999 };
      default:
        return { min: 1, max: 20 };
    }
  };

  const range = getNumberRange();
  const randomNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  switch (operation) {
    case "addition": {
      const num1 = randomNum(range.min, range.max);
      const num2 = randomNum(range.min, range.max);
      answer = num1 + num2;
      question = `${num1} + ${num2} = ?`;
      break;
    }

    case "subtraction": {
      const num1 = randomNum(range.min, range.max);
      const num2 = randomNum(range.min, num1);
      answer = num1 - num2;
      question = `${num1} - ${num2} = ?`;
      break;
    }

    case "multiplication": {
      if (difficulty === "hard") {
        const num1 = randomNum(10, 99);
        const num2 = randomNum(10, 99);
        answer = num1 * num2;
        question = `${num1} × ${num2} = ?`;
      } else {
        const num1 = randomNum(range.min, Math.min(12, range.max));
        const num2 = randomNum(range.min, Math.min(12, range.max));
        answer = num1 * num2;
        question = `${num1} × ${num2} = ?`;
      }
      break;
    }

    case "division": {
      if (difficulty === "hard") {
        const num2 = randomNum(10, 99);
        const quotient = randomNum(10, 99);
        const num1 = num2 * quotient;
        answer = quotient;
        question = `${num1} ÷ ${num2} = ?`;
      } else {
        const num2 = randomNum(2, Math.min(12, range.max));
        const quotient = randomNum(range.min, Math.min(12, range.max));
        const num1 = num2 * quotient;
        answer = quotient;
        question = `${num1} ÷ ${num2} = ?`;
      }
      break;
    }

    case "mixed": {
      let num1, num2, num3, num4, num5;
      
      if (difficulty === "hard") {
        num1 = randomNum(100, 999);
        num2 = randomNum(10, 99);
        num3 = randomNum(10, 99);
        num4 = randomNum(10, 99);
        num5 = randomNum(100, 999);
      } else {
        num1 = randomNum(range.min, range.max);
        num2 = randomNum(range.min, range.max);
        num3 = randomNum(range.min, range.max);
        num4 = randomNum(2, Math.min(12, range.max));
        num5 = randomNum(range.min, range.max);
      }

      const patterns = [
        {
          question: `${num1} + ${num2} × ${num3} = ?`,
          answer: num1 + num2 * num3,
        },
        {
          question: `${num1} × ${num2} - ${num3} = ?`,
          answer: num1 * num2 - num3,
        },
        {
          question: `${num1} + ${num2} × ${num3} ÷ ${num4} = ?`,
          answer: num1 + Math.floor((num2 * num3) / num4),
        },
        {
          question: `${num1} × ${num2} + ${num3} ÷ ${num4} = ?`,
          answer: num1 * num2 + Math.floor(num3 / num4),
        },
        {
          question: `(${num1} + ${num2}) × ${num3} = ?`,
          answer: (num1 + num2) * num3,
        },
        {
          question: `${num1} × (${num2} - ${num3}) = ?`,
          answer: num1 * (num2 - num3),
        },
        {
          question: `${num1} + ${num2} × ${num3} - ${num4} = ?`,
          answer: num1 + num2 * num3 - num4,
        },
        {
          question: `${num1} × ${num2} ÷ ${num3} + ${num4} = ?`,
          answer: Math.floor((num1 * num2) / num3) + num4,
        },
        {
          question: `${num1} + ${num2} - ${num3} × ${num4} = ?`,
          answer: num1 + num2 - num3 * num4,
        },
        {
          question: `${num1} × ${num2} + ${num3} × ${num4} = ?`,
          answer: num1 * num2 + num3 * num4,
        },
      ];

      const selected = patterns[Math.floor(Math.random() * patterns.length)];
      question = selected.question;
      answer = selected.answer;
      break;
    }

    default: {
      const num1 = randomNum(range.min, range.max);
      const num2 = randomNum(range.min, range.max);
      answer = num1 + num2;
      question = `${num1} + ${num2} = ?`;
    }
  }

  options = generateWrongAnswers(answer, 3);
  options.push(answer);
  options = shuffleArray(options);

  return {
    question,
    answer,
    options,
    difficulty,
    operation,
  };
}

function generateWrongAnswers(correctAnswer, count) {
  const wrongAnswers = new Set();
  const maxOffset = Math.max(10, Math.abs(correctAnswer) * 0.3);
  
  while (wrongAnswers.size < count) {
    const offset = Math.floor(Math.random() * maxOffset) + 1;
    const wrong = Math.random() > 0.5 
      ? correctAnswer + offset 
      : correctAnswer - offset;
    if (wrong !== correctAnswer && wrong > 0) {
      wrongAnswers.add(wrong);
    }
  }
  return Array.from(wrongAnswers);
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
