import { useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function PlayerForm({ onSubmit, onBack }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && age.trim()) {
      onSubmit({ name: name.trim(), age: parseInt(age) });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 backdrop-blur-lg rounded-2xl p-4 sm:p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-800">
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
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
              Player Information
            </h1>
            <p className="text-blue-200/70 text-xs sm:text-sm">
              Enter your details to continue
            </p>
          </div>
          {onBack && <div className="w-12 sm:w-20"></div>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-white/80 mb-2 font-medium text-sm sm:text-base">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-slate-800 backdrop-blur-sm text-white text-sm sm:text-base placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-700"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block text-white/80 mb-2 font-medium text-sm sm:text-base">
              Age
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="1"
              max="100"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-slate-800 backdrop-blur-sm text-white text-sm sm:text-base placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-700"
              placeholder="Enter your age"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 rounded-lg text-sm sm:text-base transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

