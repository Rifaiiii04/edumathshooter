import { useState } from "react";
import DifficultySelect from "./components/DifficultySelect";
import PlayerForm from "./components/PlayerForm";
import Tutorial from "./components/Tutorial";
import CameraPermission from "./components/CameraPermission";
import GameScreen from "./game/GameScreen";

export default function App() {
  const [step, setStep] = useState("difficulty");
  const [difficulty, setDifficulty] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [showTutorial, setShowTutorial] = useState(true);

  const handleDifficultySelect = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setStep("playerForm");
  };

  const handlePlayerSubmit = (data) => {
    setPlayerData(data);
    setStep("camera");
  };

  const handleCameraGranted = () => {
    setStep("tutorial");
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    setStep("game");
  };

  const handleTutorialSkip = () => {
    setShowTutorial(false);
    setStep("game");
  };

  const handleGameEnd = () => {
    setStep("difficulty");
    setDifficulty(null);
    setPlayerData(null);
    setShowTutorial(true);
  };

  if (step === "difficulty") {
    return <DifficultySelect onSelect={handleDifficultySelect} />;
  }

  if (step === "playerForm") {
    return <PlayerForm onSubmit={handlePlayerSubmit} />;
  }

  if (step === "camera") {
    return <CameraPermission onGranted={handleCameraGranted} />;
  }

  if (step === "tutorial" && showTutorial) {
    return (
      <Tutorial
        onComplete={handleTutorialComplete}
        onSkip={handleTutorialSkip}
      />
    );
  }

  if (step === "game") {
    return (
      <GameScreen
        difficulty={difficulty}
        playerName={playerData?.name || "Player"}
        onGameEnd={handleGameEnd}
      />
    );
  }

  return null;
}
