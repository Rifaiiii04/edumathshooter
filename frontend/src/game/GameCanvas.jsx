import { useEffect, useRef, useState } from "react";

export default function GameCanvas({ gesture, answers = [], isPlaying, isReloading = false }) {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [shakeOffset, setShakeOffset] = useState({ x: 0, y: 0 });
  const shootTriggeredRef = useRef(false);

  const x = gesture?.x;
  const y = gesture?.y;
  const armed = gesture?.armed;
  const shoot = gesture?.shoot;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Don't apply shake to answers - only to visual effects
      // This ensures collision detection matches visual position
      if (answers && answers.length > 0) {
        answers.forEach((answer) => {
          ctx.save();

          ctx.beginPath();
          ctx.arc(answer.x, answer.y, answer.radius, 0, Math.PI * 2);
          ctx.fillStyle = answer.isCorrect 
            ? "rgba(34, 197, 94, 0.3)" 
            : "rgba(239, 68, 68, 0.3)";
          ctx.fill();

          ctx.strokeStyle = answer.isCorrect ? "#22c55e" : "#ef4444";
          ctx.lineWidth = 3;
          ctx.stroke();

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 20px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(answer.value.toString(), answer.x, answer.y);

          ctx.restore();
        });
      }
      
      ctx.save();
      ctx.translate(shakeOffset.x, shakeOffset.y);

      if (gesture && x != null && y != null) {
        const cursorX = x * canvas.width;
        const cursorY = y * canvas.height;

        let color = "#9ca3af";
        let glowColor = "rgba(156, 163, 175, 0.3)";
        let lineLength = 12;
        let gap = 4;
        let outerRadius = 8;
        let innerRadius = 2;
        
        if (isReloading && armed) {
          color = "#f97316";
          glowColor = "rgba(249, 115, 22, 0.4)";
          lineLength = 16;
          gap = 5;
          outerRadius = 10;
          innerRadius = 2.5;
        } else if (shoot) {
          color = "#ef4444";
          glowColor = "rgba(239, 68, 68, 0.5)";
          lineLength = 20;
          gap = 6;
          outerRadius = 12;
          innerRadius = 3;
        } else if (armed) {
          color = "#22c55e";
          glowColor = "rgba(34, 197, 94, 0.4)";
          lineLength = 16;
          gap = 5;
          outerRadius = 10;
          innerRadius = 2.5;
        }

        ctx.save();
        
        // Glow effect
        if (armed || shoot) {
          const gradient = ctx.createRadialGradient(
            cursorX, cursorY, innerRadius,
            cursorX, cursorY, outerRadius * 2
          );
          gradient.addColorStop(0, glowColor);
          gradient.addColorStop(1, "transparent");
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(cursorX, cursorY, outerRadius * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Outer circle
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cursorX, cursorY, outerRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Inner dot
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(cursorX, cursorY, innerRadius, 0, Math.PI * 2);
        ctx.fill();

        // Crosshair lines (top, bottom, left, right)
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";

        // Top line
        ctx.beginPath();
        ctx.moveTo(cursorX, cursorY - outerRadius - gap);
        ctx.lineTo(cursorX, cursorY - outerRadius - gap - lineLength);
        ctx.stroke();

        // Bottom line
        ctx.beginPath();
        ctx.moveTo(cursorX, cursorY + outerRadius + gap);
        ctx.lineTo(cursorX, cursorY + outerRadius + gap + lineLength);
        ctx.stroke();

        // Left line
        ctx.beginPath();
        ctx.moveTo(cursorX - outerRadius - gap, cursorY);
        ctx.lineTo(cursorX - outerRadius - gap - lineLength, cursorY);
        ctx.stroke();

        // Right line
        ctx.beginPath();
        ctx.moveTo(cursorX + outerRadius + gap, cursorY);
        ctx.lineTo(cursorX + outerRadius + gap + lineLength, cursorY);
        ctx.stroke();

        // Corner notches (optional, untuk style lebih keren)
        if (armed || shoot) {
          const notchSize = 4;
          const notchOffset = outerRadius + gap + lineLength;
          
          // Top-left
          ctx.beginPath();
          ctx.moveTo(cursorX - notchOffset, cursorY - outerRadius - gap);
          ctx.lineTo(cursorX - notchOffset - notchSize, cursorY - outerRadius - gap);
          ctx.lineTo(cursorX - notchOffset, cursorY - outerRadius - gap - notchSize);
          ctx.stroke();

          // Top-right
          ctx.beginPath();
          ctx.moveTo(cursorX + notchOffset, cursorY - outerRadius - gap);
          ctx.lineTo(cursorX + notchOffset + notchSize, cursorY - outerRadius - gap);
          ctx.lineTo(cursorX + notchOffset, cursorY - outerRadius - gap - notchSize);
          ctx.stroke();

          // Bottom-left
          ctx.beginPath();
          ctx.moveTo(cursorX - notchOffset, cursorY + outerRadius + gap);
          ctx.lineTo(cursorX - notchOffset - notchSize, cursorY + outerRadius + gap);
          ctx.lineTo(cursorX - notchOffset, cursorY + outerRadius + gap + notchSize);
          ctx.stroke();

          // Bottom-right
          ctx.beginPath();
          ctx.moveTo(cursorX + notchOffset, cursorY + outerRadius + gap);
          ctx.lineTo(cursorX + notchOffset + notchSize, cursorY + outerRadius + gap);
          ctx.lineTo(cursorX + notchOffset, cursorY + outerRadius + gap + notchSize);
          ctx.stroke();
        }

        ctx.restore();
      }
      
      if (!gesture) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(156, 163, 175, 0.5)";
        ctx.fill();
        
        ctx.strokeStyle = "rgba(156, 163, 175, 0.8)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      ctx.restore();
      
      // Debug: Draw shoot position indicator (if available)
      if (shoot && gesture && x != null && y != null) {
        ctx.save();
        const shootX = x * canvas.width;
        const shootY = y * canvas.height;
        
        // Draw small circle at shoot position
        ctx.beginPath();
        ctx.arc(shootX, shootY, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 0, 0.8)";
        ctx.fill();
        
        // Draw line to nearest answer for debugging
        if (answers && answers.length > 0) {
          let nearestAnswer = answers[0];
          let minDist = Infinity;
          answers.forEach(a => {
            const dx = shootX - a.x;
            const dy = shootY - a.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDist) {
              minDist = dist;
              nearestAnswer = a;
            }
          });
          
          ctx.beginPath();
          ctx.moveTo(shootX, shootY);
          ctx.lineTo(nearestAnswer.x, nearestAnswer.y);
          ctx.strokeStyle = minDist < (nearestAnswer.radius + 15) ? "rgba(0, 255, 0, 0.5)" : "rgba(255, 0, 0, 0.5)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        
        ctx.restore();
      }

      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(draw);
      }
    };

    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(draw);
    } else {
      draw();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gesture, x, y, armed, shoot, answers, isPlaying, shakeOffset, isReloading]);

  useEffect(() => {
    // Screen shake hanya terjadi saat shoot, tidak saat reload
    if (shoot && !isReloading && !shootTriggeredRef.current) {
      shootTriggeredRef.current = true;
      const shakeDuration = 150;
      const shakeIntensity = 8;
      let startTime = Date.now();
      let animationFrame;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / shakeDuration, 1);
        
        if (progress < 1) {
          const decay = 1 - progress;
          const offsetX = (Math.random() - 0.5) * shakeIntensity * decay;
          const offsetY = (Math.random() - 0.5) * shakeIntensity * decay;
          
          setShakeOffset({ x: offsetX, y: offsetY });
          animationFrame = requestAnimationFrame(animate);
        } else {
          setShakeOffset({ x: 0, y: 0 });
          shootTriggeredRef.current = false;
        }
      };

      animate();
      
      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
        setShakeOffset({ x: 0, y: 0 });
        shootTriggeredRef.current = false;
      };
    } else if (!shoot || isReloading) {
      // Reset shake saat tidak shoot atau saat reload
      setShakeOffset({ x: 0, y: 0 });
      if (!shoot) {
        shootTriggeredRef.current = false;
      }
    }
  }, [shoot, isReloading]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex-1 relative bg-slate-900">
      {!gesture && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none z-0">
          <div className="text-center">
            <div className="text-2xl mb-2">Waiting for gesture...</div>
            <div className="text-sm opacity-70">Bentuk tangan seperti pistol untuk mulai</div>
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="w-full h-full pointer-events-none"
      />
    </div>
  );
}
