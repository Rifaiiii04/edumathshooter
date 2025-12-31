import { useEffect, useRef, useState } from "react";
import { useGameState } from "./useGameState";
import GameCanvas from "./GameCanvas";
import ControlPanel from "../components/ControlPanel";
import { useGestureSocket } from "../hooks/useGestureSocker";
import { getScoreMessage } from "./getScoreMessage";
import { XCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import gunShootSound from "../assets/sound/gunshoot.mp3";

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
  const audioRef = useRef(null);
  const [isReloading, setIsReloading] = useState(false);
  const [reloadProgress, setReloadProgress] = useState(0);
  const reloadTimeoutRef = useRef(null);
  const reloadIntervalRef = useRef(null);
  const RELOAD_TIME = 1.5; // 1.5 detik reload time

  useEffect(() => {
    if (currentQuestion && !isPlaying && !gameOver) {
      startGame();
    }
  }, [currentQuestion, isPlaying, gameOver, startGame]);

  useEffect(() => {
    if (!isPlaying || gameOver) {
      setIsReloading(false);
      setReloadProgress(0);
      if (reloadTimeoutRef.current) {
        clearTimeout(reloadTimeoutRef.current);
        reloadTimeoutRef.current = null;
      }
      if (reloadIntervalRef.current) {
        clearInterval(reloadIntervalRef.current);
        reloadIntervalRef.current = null;
      }
    }
  }, [isPlaying, gameOver]);

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
    if (!audioRef.current) {
      audioRef.current = new Audio(gunShootSound);
      audioRef.current.volume = 0.5;
      audioRef.current.preload = "auto";
      // Preload audio untuk mengurangi delay
      audioRef.current.load();
    }
  }, []);

  useEffect(() => {
    // Cleanup function untuk memastikan tidak ada stuck
    return () => {
      if (reloadIntervalRef.current) {
        clearInterval(reloadIntervalRef.current);
        reloadIntervalRef.current = null;
      }
      if (reloadTimeoutRef.current) {
        clearTimeout(reloadTimeoutRef.current);
        reloadTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (gesture?.shoot && !shootRef.current && isPlaying && !isReloading) {
      shootRef.current = true;
      
      // Start reload immediately after shooting
      setIsReloading(true);
      setReloadProgress(0);
      
      // Clear any existing reload timers
      if (reloadIntervalRef.current) {
        clearInterval(reloadIntervalRef.current);
        reloadIntervalRef.current = null;
      }
      if (reloadTimeoutRef.current) {
        clearTimeout(reloadTimeoutRef.current);
        reloadTimeoutRef.current = null;
      }
      
      // Play shoot sound immediately (before handleShoot)
      // Audio durasi 4 detik, suara tembakan mulai di detik 1.5
      // Jadi kita mulai dari detik 1.5 untuk langsung ke bagian tembakan
      if (audioRef.current) {
        try {
          const SHOOT_SOUND_START_TIME = 1.5; // Detik dimana suara tembakan mulai
          audioRef.current.currentTime = SHOOT_SOUND_START_TIME;
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.warn("Error playing shoot sound:", error);
            });
          }
        } catch (error) {
          console.warn("Error playing shoot sound:", error);
        }
      }
      
      if (gesture.x !== null && gesture.y !== null) {
        const shootX = gesture.x * window.innerWidth;
        const shootY = gesture.y * window.innerHeight;
        handleShoot(shootX, shootY);
      }
      
      // Reload progress animation
      const startTime = Date.now();
      reloadIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / (RELOAD_TIME * 1000)) * 100, 100);
        setReloadProgress(progress);
        
        if (progress >= 100) {
          if (reloadIntervalRef.current) {
            clearInterval(reloadIntervalRef.current);
            reloadIntervalRef.current = null;
          }
          setIsReloading(false);
          setReloadProgress(0);
        }
      }, 16); // ~60fps update
      
      reloadTimeoutRef.current = setTimeout(() => {
        setIsReloading(false);
        setReloadProgress(0);
        if (reloadIntervalRef.current) {
          clearInterval(reloadIntervalRef.current);
          reloadIntervalRef.current = null;
        }
      }, RELOAD_TIME * 1000);
    } else if (!gesture?.shoot) {
      shootRef.current = false;
    }
  }, [gesture, isPlaying, handleShoot, isReloading]);

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

      {isReloading && isPlaying && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-black/80 backdrop-blur-sm rounded-lg px-6 py-4 text-white">
            <div className="text-sm mb-2 text-center font-semibold">RELOADING...</div>
            <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-500 transition-all duration-75 ease-linear"
                style={{ width: `${reloadProgress}%` }}
              />
            </div>
            <div className="text-xs text-center mt-2 opacity-70">
              {Math.ceil((RELOAD_TIME * (100 - reloadProgress)) / 100)}s
            </div>
          </div>
        </div>
      )}

      <GameCanvas 
        gesture={gesture} 
        answers={answers}
        isPlaying={isPlaying}
        isReloading={isReloading}
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

