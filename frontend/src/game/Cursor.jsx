export default function Cursor({ ctx, x, y, armed, shoot }) {
  if (!ctx || x == null || y == null) return;

  let color = "#9ca3af"; // gray-400
  if (armed) color = "#22c55e"; // green-500
  if (shoot) color = "#ef4444"; // red-500

  const size = 12;

  // Circle
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  // Crosshair
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(x - size * 1.5, y);
  ctx.lineTo(x + size * 1.5, y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x, y - size * 1.5);
  ctx.lineTo(x, y + size * 1.5);
  ctx.stroke();
}
