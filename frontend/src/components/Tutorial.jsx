export default function Tutorial({ onSkip, onComplete }) {
  const steps = [
    {
      title: "Gesture Armed",
      description: "Bentuk tangan seperti pistol (jari telunjuk lurus, jari lain menekuk)",
      icon: "🔫",
    },
    {
      title: "Arahkan & Tembak",
      description: "Arahkan jari telunjuk ke jawaban yang benar, lalu gerakkan tangan ke bawah untuk menembak",
      icon: "🎯",
    },
    {
      title: "Jawab Soal",
      description: "Tembak jawaban yang benar untuk mendapat poin. Jawaban salah akan mengurangi poin!",
      icon: "✅",
    },
    {
      title: "Waktu Terbatas",
      description: "Jawab sebanyak mungkin soal dalam waktu 60 detik!",
      icon: "⏱️",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Tutorial</h1>
          <button
            onClick={onSkip}
            className="text-white/70 hover:text-white transition-colors"
          >
            Skip
          </button>
        </div>

        <div className="space-y-6 mb-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{step.icon}</span>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-white/80">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={onSkip}
            className="flex-1 bg-white/20 hover:bg-white/30 text-white font-semibold py-3 rounded-lg transition-all duration-200"
          >
            Skip
          </button>
          <button
            onClick={onComplete}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Mulai Bermain
          </button>
        </div>
      </div>
    </div>
  );
}

