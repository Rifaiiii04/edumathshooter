export default function TutorialConfirmation({ onStartTutorial, onSkip }) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Ingin Coba Tutorial?
        </h1>
        <p className="text-white/80 mb-8">
          Tutorial akan memandu kamu langkah demi langkah untuk belajar cara bermain. 
          Kamu bisa langsung mencoba sistem gesture detection secara langsung.
        </p>
        <div className="flex gap-4">
          <button
            onClick={onSkip}
            className="flex-1 bg-white/20 hover:bg-white/30 text-white font-semibold py-3 rounded-lg transition-all duration-200"
          >
            Lewati
          </button>
          <button
            onClick={onStartTutorial}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Mulai Tutorial
          </button>
        </div>
      </div>
    </div>
  );
}

