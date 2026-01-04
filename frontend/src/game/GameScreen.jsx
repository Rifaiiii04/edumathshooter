import { useEffect, useRef, useState } from "react";
import { useGameState } from "./useGameState";
import GameCanvas from "./GameCanvas";
import ControlPanel from "../components/ControlPanel";
import { useGestureSocket } from "../hooks/useGestureSocker";
import { useMouseInput } from "../hooks/useMouseInput";
import { getScoreMessage } from "./getScoreMessage";
import {
  XCircleIcon,
  ExclamationTriangleIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";
import gunShootSound from "../assets/sound/gunshoot.mp3";
import backSound from "../assets/sound/backsound.mp3";

export default function GameScreen({
  difficulty,
  operation,
  inputMethod,
  playerName,
  onGameEnd,
  onBackToDifficulty,
}) {
  const {
    gesture,
    connected,
    start: startGesture,
    pause: pauseGesture,
  } = useGestureSocket();

  const canvasRefForMouse = useRef(null);
  const mouseInput = useMouseInput(inputMethod || "gesture", canvasRefForMouse);

  const {
    score,
    timeLeft,
    currentQuestion,
    answers,
    isPlaying,
    gameOver,
    health,
    startGame,
    pauseGame,
    handleShoot,
    resetGame,
  } = useGameState(difficulty, operation, inputMethod);

  const shootRef = useRef(false);
  const startSentRef = useRef(false);
  const audioRef = useRef(null);
  const backSoundRef = useRef(null);
  const [isReloading, setIsReloading] = useState(false);
  const [reloadProgress, setReloadProgress] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const reloadTimeoutRef = useRef(null);
  const reloadIntervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const hasStartedCountdownRef = useRef(false);
  const RELOAD_TIME = 1.5;

  const isCountdownActiveRef = useRef(false);

  useEffect(() => {
    if (currentQuestion === null && !isPlaying && !gameOver && countdown === null && !hasStartedCountdownRef.current && !isCountdownActiveRef.current) {
      hasStartedCountdownRef.current = true;
      isCountdownActiveRef.current = true;
      setCountdown(5);
    }
  }, [currentQuestion, isPlaying, gameOver, countdown]);

  useEffect(() => {
    if (countdown === null) {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      return;
    }

    if (countdown === 0) {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      isCountdownActiveRef.current = false;
      hasStartedCountdownRef.current = true;
      setCountdown(null);
      requestAnimationFrame(() => {
        startGame();
      });
      return;
    }

    if (countdown > 0) {
      if (countdownIntervalRef.current) {
        return;
      }
      
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
              countdownIntervalRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [countdown, startGame]);

  useEffect(() => {
    if (!isPlaying || gameOver) {
      const frame = requestAnimationFrame(() => {
        setIsReloading(false);
        setReloadProgress(0);
      });
      if (reloadTimeoutRef.current) {
        clearTimeout(reloadTimeoutRef.current);
        reloadTimeoutRef.current = null;
      }
      if (reloadIntervalRef.current) {
        clearInterval(reloadIntervalRef.current);
        reloadIntervalRef.current = null;
      }
      return () => cancelAnimationFrame(frame);
    }
  }, [isPlaying, gameOver]);

  useEffect(() => {
    if (inputMethod !== "gesture") return;
    if (isPlaying && connected && !startSentRef.current) {
      startGesture();
      startSentRef.current = true;
    } else if (!isPlaying && connected && startSentRef.current) {
      pauseGesture();
      startSentRef.current = false;
    }
  }, [isPlaying, connected, startGesture, pauseGesture, inputMethod]);

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
    if (inputMethod !== "gesture") return;

    if (gesture?.shoot && !shootRef.current && isPlaying && !isReloading) {
      shootRef.current = true;

      const frameId = requestAnimationFrame(() => {
        setIsReloading(true);
        setReloadProgress(0);

        if (reloadIntervalRef.current) {
          clearInterval(reloadIntervalRef.current);
          reloadIntervalRef.current = null;
        }
        if (reloadTimeoutRef.current) {
          clearTimeout(reloadTimeoutRef.current);
          reloadTimeoutRef.current = null;
        }

        if (audioRef.current) {
          try {
            const SHOOT_SOUND_START_TIME = 1.5;
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

        const startTime = Date.now();
        reloadIntervalRef.current = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(
            (elapsed / (RELOAD_TIME * 1000)) * 100,
            100
          );
          setReloadProgress(progress);

          if (progress >= 100) {
            if (reloadIntervalRef.current) {
              clearInterval(reloadIntervalRef.current);
              reloadIntervalRef.current = null;
            }
            setIsReloading(false);
            setReloadProgress(0);
          }
        }, 16);

        reloadTimeoutRef.current = setTimeout(() => {
          setIsReloading(false);
          setReloadProgress(0);
          if (reloadIntervalRef.current) {
            clearInterval(reloadIntervalRef.current);
            reloadIntervalRef.current = null;
          }
        }, RELOAD_TIME * 1000);
      });

      return () => cancelAnimationFrame(frameId);
    } else if (!gesture?.shoot) {
      shootRef.current = false;
    }
  }, [gesture, isPlaying, handleShoot, isReloading, inputMethod]);

  useEffect(() => {
    if (inputMethod !== "mouse" && inputMethod !== "touch") return;
    if (!mouseInput) return;

    if (
      mouseInput.isShooting &&
      !shootRef.current &&
      isPlaying &&
      !isReloading
    ) {
      shootRef.current = true;

      const frameId = requestAnimationFrame(() => {
        setIsReloading(true);
        setReloadProgress(0);

        if (reloadIntervalRef.current) {
          clearInterval(reloadIntervalRef.current);
          reloadIntervalRef.current = null;
        }
        if (reloadTimeoutRef.current) {
          clearTimeout(reloadTimeoutRef.current);
          reloadTimeoutRef.current = null;
        }

        if (audioRef.current) {
          try {
            const SHOOT_SOUND_START_TIME = 1.5;
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

        const shootX = mouseInput.cursor.x * window.innerWidth;
        const shootY = mouseInput.cursor.y * window.innerHeight;
        handleShoot(shootX, shootY);

        const startTime = Date.now();
        reloadIntervalRef.current = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(
            (elapsed / (RELOAD_TIME * 1000)) * 100,
            100
          );
          setReloadProgress(progress);

          if (progress >= 100) {
            if (reloadIntervalRef.current) {
              clearInterval(reloadIntervalRef.current);
              reloadIntervalRef.current = null;
            }
            setIsReloading(false);
            setReloadProgress(0);
          }
        }, 16);

        reloadTimeoutRef.current = setTimeout(() => {
          setIsReloading(false);
          setReloadProgress(0);
          if (reloadIntervalRef.current) {
            clearInterval(reloadIntervalRef.current);
            reloadIntervalRef.current = null;
          }
        }, RELOAD_TIME * 1000);
      });

      return () => cancelAnimationFrame(frameId);
    } else if (mouseInput && !mouseInput.isShooting) {
      shootRef.current = false;
    }
  }, [
    mouseInput,
    mouseInput?.isShooting,
    mouseInput?.cursor,
    isPlaying,
    handleShoot,
    isReloading,
    inputMethod,
  ]);

  return (
    <div className="w-screen h-screen flex flex-col relative overflow-hidden bg-slate-900">
      <div className="absolute top-0 left-0 right-0 z-20 bg-slate-900/95 backdrop-blur-md border-b border-white/10">
        <div className="flex justify-between items-center px-6 py-3">
          <div className="text-white">
            <div className="text-xs opacity-70 mb-0.5">Player</div>
            <div className="text-lg font-semibold">{playerName}</div>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-xs opacity-70 mb-0.5 text-white">Score</div>
              <div className="text-2xl font-bold text-green-400">{score}</div>
            </div>

            <div className="text-center">
              <div className="text-xs opacity-70 mb-0.5 text-white">Time</div>
              <div
                className={`text-2xl font-bold ${
                  timeLeft <= 10 ? "text-red-400" : "text-yellow-400"
                }`}
              >
                {timeLeft}s
              </div>
            </div>

            <div className="text-center">
              <div className="text-xs opacity-70 mb-0.5 text-white">Health</div>
              <div className="flex items-center justify-center gap-1">
                {[0, 1, 2].map((heartIndex) => {
                  const heartValue = health - heartIndex * 2;
                  if (heartValue >= 2) {
                    return (
                      <HeartIcon
                        key={heartIndex}
                        className="w-5 h-5 sm:w-6 sm:h-6 text-red-500"
                      />
                    );
                  } else if (heartValue >= 1 && heartValue < 2) {
                    return (
                      <div key={heartIndex} className="relative w-5 h-5 sm:w-6 sm:h-6">
                        <HeartIcon className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                        <div className="absolute inset-0 bg-slate-900/90 flex items-center justify-end pr-0.5 overflow-hidden rounded-full">
                          <div className="w-2 sm:w-2.5 h-4 sm:h-5 bg-red-500"></div>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <HeartIcon
                        key={heartIndex}
                        className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600"
                      />
                    );
                  }
                })}
              </div>
            </div>
            <div className="text-center sm:hidden">
              <div className="text-[10px] opacity-70 mb-0.5 text-white">Health</div>
              <div className="flex items-center justify-center gap-0.5">
                {[0, 1, 2].map((heartIndex) => {
                  const heartValue = health - heartIndex * 2;
                  if (heartValue >= 2) {
                    return (
                      <HeartIcon
                        key={heartIndex}
                        className="w-4 h-4 text-red-500"
                      />
                    );
                  } else if (heartValue >= 1 && heartValue < 2) {
                    return (
                      <div key={heartIndex} className="relative w-4 h-4">
                        <HeartIcon className="w-4 h-4 text-red-500" />
                        <div className="absolute inset-0 bg-slate-900/90 flex items-center justify-end pr-0.5 overflow-hidden rounded-full">
                          <div className="w-1.5 h-3 bg-red-500"></div>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <HeartIcon
                        key={heartIndex}
                        className="w-4 h-4 text-gray-600"
                      />
                    );
                  }
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {currentQuestion && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg px-6 py-3 text-white shadow-lg border border-white/20">
            <div className="text-xs opacity-70 mb-1 text-center">Soal</div>
            <div className="text-xl font-bold text-center">
              {currentQuestion.question}
            </div>
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

      {inputMethod === "gesture" && !connected && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-red-500/90 backdrop-blur-sm rounded-lg px-4 py-2.5 text-white text-sm flex items-center gap-2 shadow-lg">
            <XCircleIcon className="w-4 h-4 flex shrink-0" />
            <span className="text-xs">
              WebSocket tidak terhubung. Pastikan backend Python berjalan:{" "}
              <code className="bg-black/40 px-1.5 py-0.5 rounded text-xs">
                python -m app.main
              </code>
            </span>
          </div>
        </div>
      )}
      {inputMethod === "gesture" && connected && !gesture && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-yellow-500/90 backdrop-blur-sm rounded-lg px-4 py-2.5 text-white text-sm flex items-center gap-2 shadow-lg">
            <ExclamationTriangleIcon className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs">
              Waiting for gesture detection... Show your hand to the camera
            </span>
          </div>
        </div>
      )}

      {countdown !== null && countdown > 0 && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="text-center">
            <div className="text-9xl font-bold text-white mb-4 animate-pulse drop-shadow-2xl">
              {countdown}
            </div>
            <div className="text-2xl text-white/80 font-semibold">
              Get Ready!
            </div>
          </div>
        </div>
      )}

      {isReloading && isPlaying && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-slate-800/95 backdrop-blur-sm rounded-lg px-5 py-3 text-white shadow-xl border border-orange-500/30">
            <div className="text-xs mb-2 text-center font-semibold text-orange-400 uppercase tracking-wider">
              RELOADING
            </div>
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
        mouseInput={mouseInput}
        inputMethod={inputMethod}
        answers={answers}
        isPlaying={isPlaying}
        isReloading={isReloading}
        gameCanvasRef={canvasRefForMouse}
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
                onClick={onBackToDifficulty || onGameEnd}
                className="bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-3 rounded-lg transition-all duration-200 w-full border border-white/20"
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {gameOver &&
        (() => {
          const scoreMessage = getScoreMessage(score, difficulty);
          const IconComponent = scoreMessage.Icon;
          return (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-30 animate-fadeIn">
              <div className="bg-slate-800/95 backdrop-blur-lg rounded-2xl p-8 text-center max-w-lg w-full mx-4 shadow-2xl border-2 border-white/20 animate-scaleIn">
                <div className="flex justify-center mb-4 animate-bounce">
                  <IconComponent
                    className={`w-20 h-20 ${scoreMessage.color}`}
                  />
                </div>
                <h2 className="text-5xl font-bold text-white mb-2">
                  {scoreMessage.title}
                </h2>
                <p className="text-xl text-white/80 mb-6">
                  {scoreMessage.message}
                </p>
                <div className="bg-black/30 rounded-xl p-6 mb-6 border border-white/10">
                  <div className="text-sm text-white/60 mb-2">
                    Your Final Score
                  </div>
                  <div
                    className={`text-5xl font-bold ${scoreMessage.color} mb-2`}
                  >
                    {score}
                  </div>
                  <div className="text-sm text-white/60">
                    {difficulty === "easy"
                      ? "Easy Level"
                      : difficulty === "medium"
                      ? "Medium Level"
                      : "Hard Level"}
                  </div>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      if (countdownIntervalRef.current) {
                        clearInterval(countdownIntervalRef.current);
                        countdownIntervalRef.current = null;
                      }
                      setCountdown(null);
                      hasStartedCountdownRef.current = false;
                      isCountdownActiveRef.current = false;
                      resetGame();
                      setTimeout(() => {
                        hasStartedCountdownRef.current = true;
                        isCountdownActiveRef.current = true;
                        setCountdown(5);
                      }, 300);
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 w-full transform hover:scale-105 shadow-lg"
                  >
                    Play Again
                  </button>
                  <button
                    onClick={onBackToDifficulty || onGameEnd}
                    className="bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-3 rounded-lg transition-all duration-200 w-full border border-white/20"
                  >
                    Back to Menu
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
