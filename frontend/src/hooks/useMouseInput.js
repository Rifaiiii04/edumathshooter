import { useState, useEffect, useRef, useCallback } from "react";

export function useMouseInput(inputMethod, externalCanvasRef = null) {
  const [cursor, setCursor] = useState({ x: 0.5, y: 0.5 });
  const [isShooting, setIsShooting] = useState(false);
  const internalCanvasRef = useRef(null);
  const canvasRef = externalCanvasRef || internalCanvasRef;
  const isMouseDownRef = useRef(false);
  const lastShootTimeRef = useRef(0);
  const SHOOT_COOLDOWN = 100;

  const handleMouseMove = useCallback((e) => {
    if (inputMethod !== "mouse") return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setCursor({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
  }, [inputMethod]);

  const handleMouseDown = useCallback((e) => {
    if (inputMethod !== "mouse" || e.button !== 0) return;
    
    isMouseDownRef.current = true;
    const now = Date.now();
    
    if (now - lastShootTimeRef.current >= SHOOT_COOLDOWN) {
      setIsShooting(true);
      lastShootTimeRef.current = now;
      
      setTimeout(() => {
        setIsShooting(false);
        isMouseDownRef.current = false;
      }, 50);
    }
  }, [inputMethod]);

  const handleMouseUp = useCallback(() => {
    if (inputMethod !== "mouse") return;
    isMouseDownRef.current = false;
  }, [inputMethod]);

  const handleTouchStart = useCallback((e) => {
    if (inputMethod !== "touch") return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (touch.clientX - rect.left) / rect.width;
    const y = (touch.clientY - rect.top) / rect.height;
    
    setCursor({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
    
    const now = Date.now();
    if (now - lastShootTimeRef.current >= SHOOT_COOLDOWN) {
      setIsShooting(true);
      lastShootTimeRef.current = now;
      
      setTimeout(() => {
        setIsShooting(false);
      }, 50);
    }
  }, [inputMethod]);

  const handleTouchMove = useCallback((e) => {
    if (inputMethod !== "touch") return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (touch.clientX - rect.left) / rect.width;
    const y = (touch.clientY - rect.top) / rect.height;
    
    setCursor({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
  }, [inputMethod]);

  useEffect(() => {
    if (inputMethod !== "mouse" && inputMethod !== "touch") {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    if (inputMethod === "mouse") {
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleMouseUp);
    } else if (inputMethod === "touch") {
      canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
      canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    }

    return () => {
      if (inputMethod === "mouse") {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mouseup", handleMouseUp);
      } else if (inputMethod === "touch") {
        canvas.removeEventListener("touchstart", handleTouchStart);
        canvas.removeEventListener("touchmove", handleTouchMove);
      }
    };
  }, [inputMethod, handleMouseMove, handleMouseDown, handleMouseUp, handleTouchStart, handleTouchMove]);

  return {
    cursor,
    isShooting,
    canvasRef,
  };
}

