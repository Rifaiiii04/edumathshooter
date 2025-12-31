import { useEffect, useRef } from "react";
import { useGameState } from "./useGameState";
import GameCanvas from "./GameCanvas";
import ControlPanel from "../components/ControlPanel";
import { useGestureSocket } from "../hooks/useGestureSocker";
import { getScoreMessage } from "./getScoreMessage";
import { XCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";

export default function GameScreen({ 
  difficulty,
  operation,
  playerName, 
  onGameEnd 
}) {
  const { gesture, connected, start: startGesture, pause: pauseGesture } = useGestureSocket();
  const {
    score,
    timeLeft,
    currentQuestion,
    answers,
    isPlaying,
    gameOver,
    startGame,
    pauseGame,
    handleShoot,
    resetGame,
  } = useGameState(difficulty, operation, onGameEnd);

  const shootRef = useRef(false);
  const startSentRef = useRef(false);

  useEffect(() => {
    if (currentQuestion && !isPlaying && !gameOver) {
      startGame();
    }
  }, [currentQuestion, isPlaying, gameOver, startGame]);

  useEffect(() => {
    if (isPlaying && connected && !startSentRef.current) {
      startGesture();
      startSentRef.current = true;
    } else if (!isPlaying && connected && startSentRef.current) {
      pauseGesture();
      startSentRef.current = false;
    }
  }, [isPlaying, connected]);

  useEffect(() => {
    if (gesture?.shoot && !shootRef.current && isPlaying) {
      shootRef.current = true;
      if (gesture.x !== null && gesture.y !== null) {
        const shootX = gesture.x * window.innerWidth;
        const shootY = gesture.y * window.innerHeight;
        handleShoot(shootX, shootY);
      }
    } else if (!gesture?.shoot) {
      shootRef.current = false;
    }
  }, [gesture, isPlaying, handleShoot]);

  return (
    <div className="w-screen h-screen flex flex-col relative overflow-hidden">
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white">
          <div className="text-sm opacity-80">Pemain</div>
          <div className="text-xl font-bold">{playerName}</div>
        </div>

        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white text-center">
          <div className="text-sm opacity-80">Skor</div>
          <div className="text-3xl font-bold text-green-400">{score}</div>
        </div>

        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white text-center">
          <div className="text-sm opacity-80">Waktu</div>
          <div className={`text-3xl font-bold ${timeLeft <= 10 ? "text-red-400" : "text-yellow-400"}`}>
            {timeLeft}s
          </div>
        </div>
      </div>

      {currentQuestion && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-black/70 backdrop-blur-sm rounded-xl p-6 text-white text-center shadow-2xl border-2 border-white/20">
            <div className="text-sm opacity-80 mb-2">Soal</div>
            <div className="text-4xl font-bold">{currentQuestion.question}</div>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-20">
        <ControlPanel 
          start={startGame} 
          pause={pauseGame} 
          connected={connected}
        />
      </div>

      {!connected && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-red-500/80 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm flex items-center gap-2">
            <XCircleIcon className="w-5 h-5" />
            <span>WebSocket tidak terhubung. Pastikan backend Python berjalan: <code className="bg-black/30 px-2 py-1 rounded">python -m app.main</code></span>
          </div>
        </div>
      )}
      {connected && !gesture && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-yellow-500/80 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm flex items-center gap-2">
            <ExclamationTriangleIcon className="w-5 h-5" />
            <span>Menunggu deteksi gesture... Tunjukkan tangan ke kamera</span>
          </div>
        </div>
      )}

      <GameCanvas 
        gesture={gesture} 
        answers={answers}
        isPlaying={isPlaying}
      />

      {!isPlaying && !gameOver && currentQuestion && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Game Paused</h2>
            <button
              onClick={startGame}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200"
            >
              Resume
            </button>
          </div>
        </div>
      )}

      {gameOver && (() => {
        const scoreMessage = getScoreMessage(score, difficulty);
        const IconComponent = scoreMessage.Icon;
        return (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-30 animate-fadeIn">
            <div className="bg-slate-800/95 backdrop-blur-lg rounded-2xl p-8 text-center max-w-lg w-full mx-4 shadow-2xl border-2 border-white/20 animate-scaleIn">
              <div className="flex justify-center mb-4 animate-bounce">
                <IconComponent className={`w-20 h-20 ${scoreMessage.color}`} />
              </div>
              <h2 className="text-5xl font-bold text-white mb-2">
                {scoreMessage.title}
              </h2>
              <p className="text-xl text-white/80 mb-6">
                {scoreMessage.message}
              </p>
              <div className="bg-black/30 rounded-xl p-6 mb-6 border border-white/10">
                <div className="text-sm text-white/60 mb-2">Skor Akhir Kamu</div>
                <div className={`text-5xl font-bold ${scoreMessage.color} mb-2`}>
                  {score}
                </div>
                <div className="text-sm text-white/60">
                  {difficulty === "easy" ? "Level Mudah" : difficulty === "medium" ? "Level Sedang" : "Level Sulit"}
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    resetGame();
                    setTimeout(() => {
                      startGame();
                    }, 300);
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 w-full transform hover:scale-105 shadow-lg"
                >
                  Bermain Kembali
                </button>
                <button
                  onClick={onGameEnd}
                  className="bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-3 rounded-lg transition-all duration-200 w-full border border-white/20"
                >
                  Kembali ke Menu
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

