import { useState } from "react";
import {
  HandRaisedIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  ArrowRightIcon,
  XMarkIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/solid";

export default function InputMethodSelect({ onSelect, onBack }) {
  const [showModal, setShowModal] = useState(false);
  const inputMethods = [
    {
      id: "gesture",
      name: "Gesture Control",
      description:
        "Use hand gestures to control the game (Requires local setup)",
      icon: HandRaisedIcon,
      color: "from-blue-500 to-cyan-500",
      isLocalOnly: true,
    },
    {
      id: "mouse",
      name: "Mouse",
      description: "Use mouse to control the game (Desktop)",
      icon: ComputerDesktopIcon,
      color: "from-purple-500 to-pink-500",
      isLocalOnly: false,
    },
    {
      id: "touch",
      name: "Touch",
      description: "Tap screen to control the game (Mobile)",
      icon: DevicePhoneMobileIcon,
      color: "from-green-500 to-emerald-500",
      isLocalOnly: false,
    },
  ];

  const handleMethodClick = (method) => {
    if (method.isLocalOnly) {
      setShowModal(true);
    } else {
      onSelect(method.id);
    }
  };

  const setupSteps = [
    {
      step: 1,
      title: "Install Prerequisites",
      description:
        "Make sure you have Node.js 18+ and Python 3.8+ installed on your computer.",
    },
    {
      step: 2,
      title: "Clone the Repository",
      description:
        "Clone or download the repository from GitHub to your local machine.",
    },
    {
      step: 3,
      title: "Setup Backend",
      description:
        "Navigate to the backend folder, install dependencies, and start the server.",
      code: "cd backend\npip install -r requirements.txt\npython -m app.main",
    },
    {
      step: 4,
      title: "Setup Frontend",
      description:
        "In a new terminal, navigate to the frontend folder, install dependencies, and start the dev server.",
      code: "cd frontend\nnpm install\nnpm run dev",
    },
    {
      step: 5,
      title: "Open in Browser",
      description:
        "Open http://localhost:5173 in your browser and select Gesture Control.",
    },
    {
      step: 6,
      title: "Allow Camera Access",
      description:
        "When prompted, allow the browser to access your webcam for gesture detection.",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="mb-6 sm:mb-8">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-1 sm:gap-2 text-blue-300 hover:text-blue-200 transition-colors mb-4 text-sm sm:text-base"
              >
                <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                Select Input Method
              </h1>
              <p className="text-blue-200/70 text-sm sm:text-base">
                Choose how you want to control the game
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {inputMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => handleMethodClick(method)}
                  className={`bg-slate-900 backdrop-blur-sm rounded-xl p-6 text-left hover:scale-105 transition-all duration-200 border-2 ${
                    method.isLocalOnly
                      ? "border-blue-600/30 hover:border-blue-600/50"
                      : "border-slate-800 hover:border-blue-600/50"
                  } group relative`}
                >
                  {method.isLocalOnly && (
                    <span className="absolute top-3 right-3 text-xs text-blue-400 bg-blue-600/20 px-2 py-1 rounded">
                      Local Setup
                    </span>
                  )}
                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {method.name}
                  </h3>
                  <p className="text-blue-200/70 text-sm mb-2">
                    {method.description}
                  </p>
                  {method.isLocalOnly && (
                    <div className="flex items-center gap-2 text-blue-400 text-sm mt-3">
                      <span>View Setup Instructions</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600/20 p-3 rounded-lg">
                  <HandRaisedIcon className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">
                  Gesture Control Setup
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-blue-200/70 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4 mb-6">
              <p className="text-blue-200 text-sm">
                <strong className="text-blue-300">Note:</strong> Gesture control
                requires local setup because it needs a WebSocket connection to
                the backend server and camera access. The online version only
                supports Mouse and Touch controls.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Setup Instructions
              </h3>
              {setupSteps.map((step) => (
                <div
                  key={step.step}
                  className="bg-slate-800 rounded-lg p-5 border border-slate-700"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">
                        {step.step}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white mb-2">
                        {step.title}
                      </h4>
                      <p className="text-blue-200/70 text-sm mb-3">
                        {step.description}
                      </p>
                      {step.code && (
                        <div className="bg-slate-950 rounded-lg p-4 border border-slate-700">
                          <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">
                            {step.code}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="https://github.com/Rifaiiii04/edumathshooter"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="hidden sm:inline">View on GitHub</span>
                <span className="sm:hidden">GitHub</span>
              </a>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-blue-300 font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base transition-all duration-200 border border-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
