import { useEffect, useRef, useState } from "react";

export default function GameCanvas({
  gesture,
  answers = [],
  isPlaying,
  isReloading = false,
}) {
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

      if (answers && answers.length > 0) {
        answers.forEach((answer) => {
          ctx.save();

          ctx.beginPath();
          ctx.arc(answer.x, answer.y, answer.radius, 0, Math.PI * 2);

          let fillColor = "rgba(156, 163, 175, 0.3)";
          let strokeColor = "#9ca3af";

          if (answer.isShot) {
            if (answer.isCorrect) {
              fillColor = "rgba(34, 197, 94, 0.3)";
              strokeColor = "#22c55e";
            } else {
              fillColor = "rgba(239, 68, 68, 0.3)";
              strokeColor = "#ef4444";
            }
          }

          ctx.fillStyle = fillColor;
          ctx.fill();

          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 4;
          ctx.stroke();

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 26px Arial";
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

        if (armed || shoot) {
          const gradient = ctx.createRadialGradient(
            cursorX,
            cursorY,
            innerRadius,
            cursorX,
            cursorY,
            outerRadius * 2
          );
          gradient.addColorStop(0, glowColor);
          gradient.addColorStop(1, "transparent");

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(cursorX, cursorY, outerRadius * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cursorX, cursorY, outerRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(cursorX, cursorY, innerRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(cursorX, cursorY - outerRadius - gap);
        ctx.lineTo(cursorX, cursorY - outerRadius - gap - lineLength);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cursorX, cursorY + outerRadius + gap);
        ctx.lineTo(cursorX, cursorY + outerRadius + gap + lineLength);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cursorX - outerRadius - gap, cursorY);
        ctx.lineTo(cursorX - outerRadius - gap - lineLength, cursorY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cursorX + outerRadius + gap, cursorY);
        ctx.lineTo(cursorX + outerRadius + gap + lineLength, cursorY);
        ctx.stroke();

        if (armed || shoot) {
          const notchSize = 4;
          const notchOffset = outerRadius + gap + lineLength;

          ctx.beginPath();
          ctx.moveTo(cursorX - notchOffset, cursorY - outerRadius - gap);
          ctx.lineTo(
            cursorX - notchOffset - notchSize,
            cursorY - outerRadius - gap
          );
          ctx.lineTo(
            cursorX - notchOffset,
            cursorY - outerRadius - gap - notchSize
          );
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(cursorX + notchOffset, cursorY - outerRadius - gap);
          ctx.lineTo(
            cursorX + notchOffset + notchSize,
            cursorY - outerRadius - gap
          );
          ctx.lineTo(
            cursorX + notchOffset,
            cursorY - outerRadius - gap - notchSize
          );
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(cursorX - notchOffset, cursorY + outerRadius + gap);
          ctx.lineTo(
            cursorX - notchOffset - notchSize,
            cursorY + outerRadius + gap
          );
          ctx.lineTo(
            cursorX - notchOffset,
            cursorY + outerRadius + gap + notchSize
          );
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(cursorX + notchOffset, cursorY + outerRadius + gap);
          ctx.lineTo(
            cursorX + notchOffset + notchSize,
            cursorY + outerRadius + gap
          );
          ctx.lineTo(
            cursorX + notchOffset,
            cursorY + outerRadius + gap + notchSize
          );
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

      if (shoot && gesture && x != null && y != null) {
        ctx.save();
        const shootX = x * canvas.width;
        const shootY = y * canvas.height;

        ctx.beginPath();
        ctx.arc(shootX, shootY, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 0, 0.8)";
        ctx.fill();

        if (answers && answers.length > 0) {
          let nearestAnswer = answers[0];
          let minDist = Infinity;
          answers.forEach((a) => {
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
          ctx.strokeStyle =
            minDist < nearestAnswer.radius + 15
              ? "rgba(0, 255, 0, 0.5)"
              : "rgba(255, 0, 0, 0.5)";
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
  }, [
    gesture,
    x,
    y,
    armed,
    shoot,
    answers,
    isPlaying,
    shakeOffset,
    isReloading,
  ]);

  useEffect(() => {
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
    }
  }, [shoot, isReloading]);

  useEffect(() => {
    if (!shoot || isReloading) {
      const frame = requestAnimationFrame(() => {
        setShakeOffset({ x: 0, y: 0 });
        if (!shoot) {
          shootTriggeredRef.current = false;
        }
      });
      return () => cancelAnimationFrame(frame);
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
            <div className="text-sm opacity-70">
              Bentuk tangan seperti pistol untuk mulai
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="w-full h-full pointer-events-none" />
    </div>
  );
}
