import { useEffect, useRef } from "react";

export default function GameCanvas({ gesture, answers = [], isPlaying }) {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

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

      if (gesture && x != null && y != null) {
        const cursorX = x * canvas.width;
        const cursorY = y * canvas.height;

        let color = "#9ca3af";
        let size = 8;
        if (armed) {
          color = "#22c55e";
          size = 12;
        }
        if (shoot) {
          color = "#ef4444";
          size = 16;
        }

        ctx.beginPath();
        ctx.arc(cursorX, cursorY, size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        if (armed) {
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cursorX, cursorY, size + 5, 0, Math.PI * 2);
          ctx.stroke();
        }

        if (shoot) {
          ctx.strokeStyle = "#ef4444";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(cursorX, cursorY, size + 8, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else if (!gesture) {
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
  }, [gesture, x, y, armed, shoot, answers, isPlaying]);

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
    <div className="flex-1 relative bg-gradient-to-br from-gray-900 to-gray-800">
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
