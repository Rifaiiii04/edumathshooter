import { useState } from "react";
import LandingPage from "./components/LandingPage";
import DifficultySelect from "./components/DifficultySelect";
import PlayerForm from "./components/PlayerForm";
import InputMethodSelect from "./components/InputMethodSelect";
import TutorialConfirmation from "./components/TutorialConfirmation";
import InteractiveTutorial from "./components/InteractiveTutorial";
import GameScreen from "./game/GameScreen";

export default function App() {
  const [step, setStep] = useState("landing");
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
    setStep("landing");
    setDifficulty(null);
    setOperation(null);
    setInputMethod(null);
    setPlayerData(null);
    setShowTutorial(true);
  };

  const handleGetStarted = () => {
    setStep("difficulty");
  };

  const handleBackToLanding = () => {
    setStep("landing");
  };

  const handleBackToDifficulty = () => {
    setStep("difficulty");
  };

  const handleBackToPlayerForm = () => {
    setStep("playerForm");
  };

  if (step === "landing") {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  if (step === "difficulty") {
    return (
      <DifficultySelect
        onSelect={handleDifficultySelect}
        onBack={handleBackToLanding}
      />
    );
  }

  if (step === "playerForm") {
    return (
      <PlayerForm
        onSubmit={handlePlayerSubmit}
        onBack={handleBackToDifficulty}
      />
    );
  }

  if (step === "input-method") {
    return (
      <InputMethodSelect
        onSelect={handleInputMethodSelect}
        onBack={handleBackToPlayerForm}
      />
    );
  }

  if (step === "tutorial-confirm") {
    if (inputMethod !== "gesture") {
      setShowTutorial(false);
      setTutorialMode(false);
      setStep("game");
      return null;
    }
    return (
      <TutorialConfirmation
        onStartTutorial={handleStartTutorial}
        onSkip={handleSkipTutorial}
      />
    );
  }

  if (step === "tutorial" && tutorialMode && inputMethod === "gesture") {
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
        onBackToDifficulty={handleBackToDifficulty}
      />
    );
  }

  return null;
}
