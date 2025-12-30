export default function ControlPanel({ start, pause, connected }) {
  const handleStart = (e) => {
    e.preventDefault();
    if (connected && start) {
      start();
    }
  };

  const handlePause = (e) => {
    e.preventDefault();
    if (connected && pause) {
      pause();
    }
  };

  return (
    <div className="flex gap-3 p-4 bg-slate-800 text-white relative z-10">
      <button
        type="button"
        onClick={handleStart}
        disabled={!connected}
        className={`px-4 py-2 rounded font-medium transition-all duration-200 relative z-10 ${
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
        disabled={!connected}
        className={`px-4 py-2 rounded font-medium transition-all duration-200 relative z-10 ${
          connected
            ? "bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-slate-800 transform active:scale-95 text-gray-900 shadow-md hover:shadow-lg"
            : "bg-gray-500 cursor-not-allowed opacity-50"
        }`}
      >
        Pause
      </button>

      <span className={`ml-4 text-sm flex items-center gap-2`}>
        <span
          className={`w-2 h-2 rounded-full transition-colors duration-200 ${
            connected ? "bg-green-500" : "bg-red-500"
          }`}
        />
        {connected ? "Connected" : "Disconnected"}
      </span>
    </div>
  );
}
