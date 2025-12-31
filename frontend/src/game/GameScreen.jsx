import { useEffect, useRef, useState } from "react";
import { useGameState } from "./useGameState";
import GameCanvas from "./GameCanvas";
import ControlPanel from "../components/ControlPanel";
import { useGestureSocket } from "../hooks/useGestureSocker";
import { getScoreMessage } from "./getScoreMessage";
import { XCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import gunShootSound from "../assets/sound/gunshoot.mp3";
import backSound from "../assets/sound/backsound.mp3";

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
  const backSoundRef = useRef(null);
  const [isReloading, setIsReloading] = useState(false);
  const [reloadProgress, setReloadProgress] = useState(0);
  const reloadTimeoutRef = useRef(null);
  const reloadIntervalRef = useRef(null);
  const RELOAD_TIME = 1.5; // 1.5 detik reload time

  useEffect(() => {
    if (currentQuestion === null && !isPlaying && !gameOver) {
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
      audioRef.current.load();
    }
  }, []);

  useEffect(() => {
    if (!backSoundRef.current) {
      backSoundRef.current = new Audio(backSound);
      backSoundRef.current.loop = true;
      backSoundRef.current.volume = 0.3;
      backSoundRef.current.preload = "auto";
    }

    if (isPlaying && !gameOver) {
      backSoundRef.current.play().catch((error) => {
        console.warn("Error playing background sound:", error);
      });
    } else {
      backSoundRef.current.pause();
      if (gameOver) {
        backSoundRef.current.currentTime = 0;
      }
    }

    return () => {
      if (backSoundRef.current) {
        backSoundRef.current.pause();
        backSoundRef.current.currentTime = 0;
      }
    };
  }, [isPlaying, gameOver]);

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
    <div className="w-screen h-screen flex flex-col relative overflow-hidden bg-slate-900">
      <div className="absolute top-0 left-0 right-0 z-20 bg-slate-900/95 backdrop-blur-md border-b border-white/10">
        <div className="flex justify-between items-center px-6 py-3">
          <div className="text-white">
            <div className="text-xs opacity-70 mb-0.5">Pemain</div>
            <div className="text-lg font-semibold">{playerName}</div>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-xs opacity-70 mb-0.5">Skor</div>
              <div className="text-2xl font-bold text-green-400">{score}</div>
            </div>

            <div className="text-center">
              <div className="text-xs opacity-70 mb-0.5">Waktu</div>
              <div className={`text-2xl font-bold ${timeLeft <= 10 ? "text-red-400" : "text-yellow-400"}`}>
                {timeLeft}s
              </div>
            </div>
          </div>
        </div>
      </div>

      {currentQuestion && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg px-6 py-3 text-white shadow-lg border border-white/20">
            <div className="text-xs opacity-70 mb-1 text-center">Soal</div>
            <div className="text-xl font-bold text-center">{currentQuestion.question}</div>
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
          <div className="bg-red-500/90 backdrop-blur-sm rounded-lg px-4 py-2.5 text-white text-sm flex items-center gap-2 shadow-lg">
            <XCircleIcon className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs">WebSocket tidak terhubung. Pastikan backend Python berjalan: <code className="bg-black/40 px-1.5 py-0.5 rounded text-xs">python -m app.main</code></span>
          </div>
        </div>
      )}
      {connected && !gesture && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-yellow-500/90 backdrop-blur-sm rounded-lg px-4 py-2.5 text-white text-sm flex items-center gap-2 shadow-lg">
            <ExclamationTriangleIcon className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs">Menunggu deteksi gesture... Tunjukkan tangan ke kamera</span>
          </div>
        </div>
      )}

      {isReloading && isPlaying && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-slate-800/95 backdrop-blur-sm rounded-lg px-5 py-3 text-white shadow-xl border border-orange-500/30">
            <div className="text-xs mb-2 text-center font-semibold text-orange-400 uppercase tracking-wider">RELOADING</div>
            <div className="w-48 h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-75 ease-linear"
                style={{ width: `${reloadProgress}%` }}
              />
            </div>
            <div className="text-xs text-center mt-2 opacity-60">
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
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30 animate-fadeIn">
          <div className="bg-slate-800/95 backdrop-blur-lg rounded-2xl p-8 text-center max-w-md w-full mx-4 shadow-2xl border-2 border-white/20 animate-scaleIn">
            <h2 className="text-3xl font-bold text-white mb-6">Game Paused</h2>
            <div className="flex flex-col gap-3">
              <button
                onClick={startGame}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Resume
              </button>
              <button
                onClick={onGameEnd}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Kembali ke Menu
              </button>
            </div>
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

