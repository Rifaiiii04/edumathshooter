import { useState } from "react";
import DifficultySelect from "./components/DifficultySelect";
import PlayerForm from "./components/PlayerForm";
import InputMethodSelect from "./components/InputMethodSelect";
import TutorialConfirmation from "./components/TutorialConfirmation";
import InteractiveTutorial from "./components/InteractiveTutorial";
import GameScreen from "./game/GameScreen";

export default function App() {
  const [step, setStep] = useState("difficulty");
  const [difficulty, setDifficulty] = useState(null);
  const [operation, setOperation] = useState(null);
  const [inputMethod, setInputMethod] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialMode, setTutorialMode] = useState(false);

  const handleDifficultySelect = (selection) => {
    setDifficulty(selection.difficulty);
    setOperation(selection.operation);
    setStep("playerForm");
  };

  const handlePlayerSubmit = (data) => {
    setPlayerData(data);
    setStep("input-method");
  };

  const handleInputMethodSelect = (method) => {
    setInputMethod(method);
    setStep("tutorial-confirm");
  };

  const handleStartTutorial = () => {
    setTutorialMode(true);
    setStep("tutorial");
  };

  const handleSkipTutorial = () => {
    setShowTutorial(false);
    setTutorialMode(false);
    setStep("game");
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    setTutorialMode(false);
    setStep("game");
  };

  const handleGameEnd = () => {
    setStep("difficulty");
    setDifficulty(null);
    setOperation(null);
    setInputMethod(null);
    setPlayerData(null);
    setShowTutorial(true);
  };

  if (step === "difficulty") {
    return <DifficultySelect onSelect={handleDifficultySelect} />;
  }

  if (step === "playerForm") {
    return <PlayerForm onSubmit={handlePlayerSubmit} />;
  }

  if (step === "input-method") {
    return <InputMethodSelect onSelect={handleInputMethodSelect} />;
  }

  if (step === "tutorial-confirm") {
    return (
      <TutorialConfirmation
        onStartTutorial={handleStartTutorial}
        onSkip={handleSkipTutorial}
      />
    );
  }

  if (step === "tutorial" && tutorialMode) {
    return <InteractiveTutorial onComplete={handleTutorialComplete} />;
  }

  if (step === "game") {
    return (
      <GameScreen
        difficulty={difficulty}
        operation={operation}
        inputMethod={inputMethod}
        playerName={playerData?.name || "Player"}
        onGameEnd={handleGameEnd}
      />
    );
  }

  return null;
}
