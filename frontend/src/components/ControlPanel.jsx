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
        disabled={!connected}
        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 relative z-10 ${
          connected
            ? "bg-green-500 hover:bg-green-600 active:bg-green-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-slate-800 transform active:scale-95 shadow-md hover:shadow-lg"
            : "bg-gray-500 cursor-not-allowed opacity-50"
        }`}
      >
        Start
      </button>

      <button
        type="button"
        onClick={handlePause}
        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 relative z-10 ${
          connected
            ? "bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-slate-800 transform active:scale-95 text-white shadow-md hover:shadow-lg"
            : "bg-gray-500 cursor-not-allowed opacity-50"
        }`}
      >
        Pause
      </button>

      <span className={`ml-auto text-xs flex items-center gap-1.5 opacity-70`}>
        <span
          className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
            connected ? "bg-green-400" : "bg-red-400"
          }`}
        />
        {connected ? "Terhubung" : "Terputus"}
      </span>
    </div>
  );
}
