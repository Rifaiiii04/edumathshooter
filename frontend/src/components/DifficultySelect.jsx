import { useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function DifficultySelect({ onSelect, onBack }) {
  const difficulties = [
    { id: "easy", label: "Easy" },
    { id: "medium", label: "Medium" },
    { id: "hard", label: "Hard" },
  ];

  const operations = [
    { id: "addition", label: "Addition", symbol: "+" },
    { id: "subtraction", label: "Subtraction", symbol: "-" },
    { id: "multiplication", label: "Multiplication", symbol: "×" },
    { id: "division", label: "Division", symbol: "÷" },
    { id: "mixed", label: "Mixed", symbol: "±×÷" },
  ];

  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [selectedOperation, setSelectedOperation] = useState(null);

  const handleDifficultyClick = (diff) => {
    setSelectedDifficulty(diff.id);
  };

  const handleOperationClick = (op) => {
    setSelectedOperation(op.id);
  };

  const handleConfirm = () => {
    if (selectedDifficulty && selectedOperation) {
      onSelect({ difficulty: selectedDifficulty, operation: selectedOperation });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 backdrop-blur-lg rounded-2xl p-4 sm:p-6 md:p-8 max-w-3xl w-full shadow-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1 sm:gap-2 text-blue-300 hover:text-blue-200 transition-colors text-sm sm:text-base"
            >
              <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}
          {!onBack && <div></div>}
          <div className="flex-1 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
              Vectory
            </h1>
            <p className="text-blue-200/70 text-center text-xs sm:text-sm">
              Select Difficulty & Operation
            </p>
          </div>
          {onBack && <div className="w-12 sm:w-20"></div>}
        </div>

        <div className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-3 sm:mb-4">Difficulty Level</h2>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            {difficulties.map((diff) => (
              <button
                key={diff.id}
                onClick={() => handleDifficultyClick(diff)}
                className={`backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                  selectedDifficulty === diff.id
                    ? "bg-green-500/30 border-2 border-green-500"
                    : "bg-white/20 hover:bg-white/30 border-2 border-transparent"
                }`}
              >
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white">
                  {diff.label}
                </h3>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-3 sm:mb-4">Mathematical Operations</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
            {operations.map((op) => (
              <button
                key={op.id}
                onClick={() => handleOperationClick(op)}
                className={`backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 text-center transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                  selectedOperation === op.id
                    ? "bg-blue-500/30 border-2 border-blue-500"
                    : "bg-white/20 hover:bg-white/30 border-2 border-transparent"
                }`}
              >
                <div className="text-xl sm:text-2xl font-bold text-white mb-0.5 sm:mb-1">
                  {op.symbol}
                </div>
                <p className="text-white/70 text-[10px] sm:text-xs">{op.label}</p>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={!selectedDifficulty || !selectedOperation}
          className={`w-full py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 ${
            selectedDifficulty && selectedOperation
              ? "bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105"
              : "bg-slate-700 text-slate-400 cursor-not-allowed"
          }`}
        >
          Start Playing
        </button>
      </div>
    </div>
  );
}

