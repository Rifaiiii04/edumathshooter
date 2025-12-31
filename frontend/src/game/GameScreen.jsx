import { useEffect, useRef } from "react";
import { useGameState } from "./useGameState";
import GameCanvas from "./GameCanvas";
import ControlPanel from "../components/ControlPanel";
import { useGestureSocket } from "../hooks/useGestureSocker";

export default function GameScreen({ 
  difficulty, 
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
  } = useGameState(difficulty, onGameEnd);

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
          <div className="bg-red-500/80 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm">
            ❌ WebSocket tidak terhubung. Pastikan backend Python berjalan: <code className="bg-black/30 px-2 py-1 rounded">python -m app.main</code>
          </div>
        </div>
      )}
      {connected && !gesture && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-yellow-500/80 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm">
            ⚠️ Menunggu deteksi gesture... Tunjukkan tangan ke kamera
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

      {gameOver && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-30">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center max-w-md w-full">
            <h2 className="text-4xl font-bold text-white mb-4">Game Over!</h2>
            <div className="text-2xl text-green-400 font-bold mb-6">
              Skor Akhir: {score}
            </div>
            <button
              onClick={onGameEnd}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 w-full"
            >
              Kembali ke Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

