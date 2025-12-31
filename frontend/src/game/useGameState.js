import { useState, useEffect, useRef, useCallback } from "react";
import { generateMathQuestion } from "./mathGenerator";

export function useGameState(difficulty, operation, onGameEnd) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(Date.now());
  const answerIdCounterRef = useRef(0);
  const lastShootTimeRef = useRef(0);

  const generateNewQuestion = useCallback(() => {
    const question = generateMathQuestion(difficulty, operation);
    setCurrentQuestion(question);

    const newAnswers = question.options.map((value, index) => {
      const id = answerIdCounterRef.current++;
      const angle = (Math.PI * 2 * index) / question.options.length;
      const radius = 150;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const speed = difficulty === "easy" ? 1 : difficulty === "medium" ? 1.5 : 2;
      const angleSpeed = (Math.random() - 0.5) * 0.02;

      return {
        id,
        value,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        angle: angle,
        angleSpeed: angleSpeed,
        isCorrect: value === question.answer,
        radius: 50,
      };
    });

    setAnswers(newAnswers);
  }, [difficulty, operation]);

  const startGame = useCallback(() => {
    if (currentQuestion === null) {
      setScore(0);
      setTimeLeft(60);
      setGameOver(false);
      generateNewQuestion();
    }
    if (!gameOver) {
      setIsPlaying(true);
    }
  }, [currentQuestion, generateNewQuestion, gameOver]);

  const pauseGame = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const checkCollision = useCallback((shootX, shootY, answer) => {
    const dx = shootX - answer.x;
    const dy = shootY - answer.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    // Add tolerance for better hit detection (15px = 37.5% of 40px radius)
    const hitRadius = answer.radius + 15; // 15px tolerance for easier hits
    return distance < hitRadius;
  }, []);

  const handleShoot = useCallback((shootX, shootY) => {
    if (!isPlaying || !currentQuestion) return;

    const now = Date.now();
    if (now - lastShootTimeRef.current < 500) {
      return;
    }
    lastShootTimeRef.current = now;

    let hitDetected = false;
    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
      if (checkCollision(shootX, shootY, answer)) {
        hitDetected = true;
        if (answer.isCorrect) {
          const points = difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 30;
          setScore((prev) => prev + points);
          setTimeout(() => {
            generateNewQuestion();
          }, 300);
        } else {
          const penalty = difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 15;
          setScore((prev) => Math.max(0, prev - penalty));
        }
        break;
      }
    }
    
    // Debug: log if shoot happened but no collision detected
    if (!hitDetected) {
      const distances = answers.map(a => {
        const dx = shootX - a.x;
        const dy = shootY - a.y;
        return Math.sqrt(dx * dx + dy * dy);
      });
      const minDistance = Math.min(...distances);
      console.log(`Shoot at (${shootX.toFixed(1)}, ${shootY.toFixed(1)}), closest answer distance: ${minDistance.toFixed(1)}, radius: ${answers[0]?.radius || 40}`);
    }
  }, [isPlaying, currentQuestion, answers, checkCollision, difficulty, generateNewQuestion]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const updateAnswers = () => {
      const now = Date.now();
      const deltaTime = (now - lastTimeRef.current) / 16;
      lastTimeRef.current = now;

      setAnswers((prevAnswers) => {
        return prevAnswers.map((answer) => {
          let newX = answer.x + answer.vx * deltaTime;
          let newY = answer.y + answer.vy * deltaTime;
          let newVx = answer.vx;
          let newVy = answer.vy;

          const margin = answer.radius;
          const maxX = window.innerWidth - margin;
          const maxY = window.innerHeight - margin;
          const minX = margin;
          const minY = margin;

          if (newX <= minX || newX >= maxX) {
            newVx = -newVx;
            newX = Math.max(minX, Math.min(maxX, newX));
          }

          if (newY <= minY || newY >= maxY) {
            newVy = -newVy;
            newY = Math.max(minY, Math.min(maxY, newY));
          }

          return {
            ...answer,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
          };
        });
      });

      animationFrameRef.current = requestAnimationFrame(updateAnswers);
    };

    animationFrameRef.current = requestAnimationFrame(updateAnswers);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, gameOver]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, gameOver]);

  const resetGame = useCallback(() => {
    setIsPlaying(false);
    setGameOver(false);
    setScore(0);
    setTimeLeft(60);
    setCurrentQuestion(null);
    setAnswers([]);
    answerIdCounterRef.current = 0;
    setTimeout(() => {
      generateNewQuestion();
    }, 100);
  }, [generateNewQuestion]);

  return {
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
  };
}

