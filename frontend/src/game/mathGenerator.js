export function generateMathQuestion(difficulty) {
  let num1, num2, operator, answer, options;

  switch (difficulty) {
    case "easy":
      num1 = Math.floor(Math.random() * 20) + 1;
      num2 = Math.floor(Math.random() * 20) + 1;
      operator = Math.random() > 0.5 ? "+" : "-";
      answer = operator === "+" ? num1 + num2 : num1 - num2;
      break;

    case "medium":
      num1 = Math.floor(Math.random() * 50) + 1;
      num2 = Math.floor(Math.random() * 50) + 1;
      const ops = ["+", "-", "*"];
      operator = ops[Math.floor(Math.random() * ops.length)];
      if (operator === "+") answer = num1 + num2;
      else if (operator === "-") answer = num1 - num2;
      else answer = num1 * num2;
      break;

    case "hard":
      num1 = Math.floor(Math.random() * 100) + 1;
      num2 = Math.floor(Math.random() * 100) + 1;
      const opsHard = ["+", "-", "*"];
      operator = opsHard[Math.floor(Math.random() * opsHard.length)];
      if (operator === "+") answer = num1 + num2;
      else if (operator === "-") answer = num1 - num2;
      else answer = num1 * num2;
      break;

    default:
      num1 = 5;
      num2 = 3;
      operator = "+";
      answer = 8;
  }

  options = generateWrongAnswers(answer, 3);
  options.push(answer);
  options = shuffleArray(options);

  return {
    question: `${num1} ${operator} ${num2} = ?`,
    answer,
    options,
    difficulty,
  };
}

function generateWrongAnswers(correctAnswer, count) {
  const wrongAnswers = new Set();
  while (wrongAnswers.size < count) {
    const offset = Math.floor(Math.random() * 20) + 1;
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

