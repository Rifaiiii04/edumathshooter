import { useState } from "react";

export default function DifficultySelect({ onSelect }) {
  const difficulties = [
    { id: "easy", label: "Mudah" },
    { id: "medium", label: "Sedang" },
    { id: "hard", label: "Sulit" },
  ];

  const operations = [
    { id: "addition", label: "Pertambahan", symbol: "+" },
    { id: "subtraction", label: "Pengurangan", symbol: "-" },
    { id: "multiplication", label: "Perkalian", symbol: "×" },
    { id: "division", label: "Pembagian", symbol: "÷" },
    { id: "mixed", label: "Gabungan", symbol: "±×÷" },
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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-3xl w-full shadow-2xl">
        <h1 className="text-4xl font-bold text-white text-center mb-2">
          Math Shooter
        </h1>
        <p className="text-white/80 text-center mb-8">
          Pilih Tingkat Kesulitan & Operasi
        </p>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Tingkat Kesulitan</h2>
          <div className="grid grid-cols-3 gap-4">
            {difficulties.map((diff) => (
              <button
                key={diff.id}
                onClick={() => handleDifficultyClick(diff)}
                className={`backdrop-blur-sm rounded-xl p-4 text-center transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                  selectedDifficulty === diff.id
                    ? "bg-green-500/30 border-2 border-green-500"
                    : "bg-white/20 hover:bg-white/30 border-2 border-transparent"
                }`}
              >
                <h3 className="text-lg font-semibold text-white">
                  {diff.label}
                </h3>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Operasi Matematika</h2>
          <div className="grid grid-cols-5 gap-3">
            {operations.map((op) => (
              <button
                key={op.id}
                onClick={() => handleOperationClick(op)}
                className={`backdrop-blur-sm rounded-xl p-4 text-center transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                  selectedOperation === op.id
                    ? "bg-blue-500/30 border-2 border-blue-500"
                    : "bg-white/20 hover:bg-white/30 border-2 border-transparent"
                }`}
              >
                <div className="text-2xl font-bold text-white mb-1">
                  {op.symbol}
                </div>
                <p className="text-white/70 text-xs">{op.label}</p>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={!selectedDifficulty || !selectedOperation}
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
            selectedDifficulty && selectedOperation
              ? "bg-green-500 hover:bg-green-600 text-white transform hover:scale-105"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          Mulai Bermain
        </button>
      </div>
    </div>
  );
}

