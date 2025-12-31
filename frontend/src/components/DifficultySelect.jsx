export default function DifficultySelect({ onSelect }) {
  const difficulties = [
    { id: "easy", label: "Mudah", description: "Penjumlahan & Pengurangan 1-20" },
    { id: "medium", label: "Sedang", description: "Penjumlahan, Pengurangan & Perkalian 1-50" },
    { id: "hard", label: "Sulit", description: "Semua Operasi 1-100" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
        <h1 className="text-4xl font-bold text-white text-center mb-2">
          Math Shooter
        </h1>
        <p className="text-white/80 text-center mb-8">
          Pilih Tingkat Kesulitan
        </p>

        <div className="grid gap-4">
          {difficulties.map((diff) => (
            <button
              key={diff.id}
              onClick={() => onSelect(diff.id)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-6 text-left transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <h2 className="text-2xl font-semibold text-white mb-2">
                {diff.label}
              </h2>
              <p className="text-white/70">{diff.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

