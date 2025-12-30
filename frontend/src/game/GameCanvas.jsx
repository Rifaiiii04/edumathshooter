import { useEffect, useRef } from "react";

export default function GameCanvas({ gesture }) {
  const canvasRef = useRef(null);

  const x = gesture?.x;
  const y = gesture?.y;
  const armed = gesture?.armed;
  const shoot = gesture?.shoot;

  useEffect(() => {
    if (!gesture || x == null || y == null) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let color = "#9ca3af";
    if (armed) color = "#22c55e";
    if (shoot) color = "#ef4444";

    ctx.beginPath();
    ctx.arc(x * canvas.width, y * canvas.height, 10, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }, [gesture, x, y, armed, shoot]);

  return (
    <div className="flex-1 relative">
      {!gesture && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none z-0">
          Waiting gesture...
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="bg-gray-100 w-full h-full pointer-events-none"
      />
    </div>
  );
}
