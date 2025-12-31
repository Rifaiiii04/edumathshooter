import { TrophyIcon, StarIcon, CheckCircleIcon, FireIcon, BookOpenIcon } from "@heroicons/react/24/solid";

export function getScoreMessage(score, difficulty) {
  const baseThreshold = difficulty === "easy" ? 50 : difficulty === "medium" ? 100 : 150;
  const excellentThreshold = baseThreshold * 2;
  const perfectThreshold = baseThreshold * 3;

  let title, message, Icon, color;

  if (score >= perfectThreshold) {
    title = "SELAMAT! LUAR BIASA!";
    message = `Selamat! Kamu mendapatkan skor ${score} poin! Kamu benar-benar hebat dalam matematika!`;
    Icon = TrophyIcon;
    color = "text-yellow-400";
  } else if (score >= excellentThreshold) {
    title = "SELAMAT! SANGAT BAGUS!";
    message = `Selamat! Kamu mendapatkan skor ${score} poin! Kamu sangat pandai matematika!`;
    Icon = StarIcon;
    color = "text-purple-400";
  } else if (score >= baseThreshold) {
    title = "SELAMAT! BAGUS!";
    message = `Selamat! Kamu mendapatkan skor ${score} poin! Kamu berhasil menyelesaikan dengan baik!`;
    Icon = CheckCircleIcon;
    color = "text-green-400";
  } else if (score >= baseThreshold * 0.5) {
    title = "TETAP SEMANGAT!";
    message = `Kamu mendapatkan skor ${score} poin. Kamu sudah berusaha dengan baik! Terus latih kemampuanmu!`;
    Icon = FireIcon;
    color = "text-blue-400";
  } else {
    title = "TERUS BELAJAR!";
    message = `Kamu mendapatkan skor ${score} poin. Jangan menyerah, terus berlatih dan tingkatkan kemampuanmu!`;
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

