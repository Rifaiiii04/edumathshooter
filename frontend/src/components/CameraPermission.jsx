export default function CameraPermission({ onGranted }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
        <div className="text-6xl mb-6">📷</div>
        <h1 className="text-3xl font-bold text-white mb-4">
          Siap untuk Bermain!
        </h1>
        <p className="text-white/80 mb-4">
          Pastikan backend Python sudah berjalan di terminal:
        </p>
        <div className="bg-black/30 rounded-lg p-4 mb-6 text-left">
          <code className="text-green-400 text-sm">
            python -m app.main
          </code>
        </div>
        <p className="text-white/80 mb-8 text-sm">
          Backend akan mengakses kamera Anda untuk mendeteksi gesture tangan.
          Pastikan kamera tidak digunakan oleh aplikasi lain.
        </p>
        <button
          onClick={onGranted}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 w-full"
        >
          Lanjutkan ke Tutorial
        </button>
      </div>
    </div>
  );
}

