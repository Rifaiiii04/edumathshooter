import { TrophyIcon, StarIcon, CheckCircleIcon, FireIcon, BookOpenIcon } from "@heroicons/react/24/solid";

export function getScoreMessage(score, difficulty) {
  const baseThreshold = difficulty === "easy" ? 50 : difficulty === "medium" ? 100 : 150;
  const excellentThreshold = baseThreshold * 2;
  const perfectThreshold = baseThreshold * 3;

  let title, message, Icon, color;

  if (score >= perfectThreshold) {
    title = "CONGRATULATIONS! AMAZING!";
    message = `Congratulations! You scored ${score} points! You're truly excellent at mathematics!`;
    Icon = TrophyIcon;
    color = "text-yellow-400";
  } else if (score >= excellentThreshold) {
    title = "CONGRATULATIONS! EXCELLENT!";
    message = `Congratulations! You scored ${score} points! You're very good at mathematics!`;
    Icon = StarIcon;
    color = "text-purple-400";
  } else if (score >= baseThreshold) {
    title = "CONGRATULATIONS! GREAT!";
    message = `Congratulations! You scored ${score} points! You did well!`;
    Icon = CheckCircleIcon;
    color = "text-green-400";
  } else if (score >= baseThreshold * 0.5) {
    title = "KEEP GOING!";
    message = `You scored ${score} points. You did your best! Keep practicing to improve your skills!`;
    Icon = FireIcon;
    color = "text-blue-400";
  } else {
    title = "KEEP LEARNING!";
    message = `You scored ${score} points. Don't give up, keep practicing and improve your skills!`;
    Icon = BookOpenIcon;
    color = "text-gray-400";
  }

  return {
    title,
    message,
    Icon,
    color,
  };
}

