export default function ControlPanel({ start, pause, connected }) {
  const handleStart = (e) => {
    e.preventDefault();
    if (connected && start) {
      start();
    }
  };

  const handlePause = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (pause) {
      pause();
    }
  };

  return (
    <div className="flex gap-2 p-3 bg-slate-800/95 backdrop-blur-md border-t border-white/10 text-white relative z-10">
      <button
        type="button"
        onClick={handleStart}
        className="px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 relative z-10 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800 transform active:scale-95 shadow-md hover:shadow-lg font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
        disabled={!connected}
      >
        Start
      </button>

      <button
        type="button"
        onClick={handlePause}
        className="px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 relative z-10 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-slate-800 transform active:scale-95 shadow-md hover:shadow-lg font-semibold"
      >
        Pause
      </button>

      <span className={`ml-auto text-xs flex items-center gap-1.5 opacity-70`}>
        <span
          className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
            connected ? "bg-green-400" : "bg-red-400"
          }`}
        />
        {connected ? "Connected" : "Disconnected"}
      </span>
    </div>
  );
}
