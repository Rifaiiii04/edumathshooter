import { useState, useEffect } from "react";
import { useGestureSocket } from "../hooks/useGestureSocker";
import GameCanvas from "../game/GameCanvas";

export default function InteractiveTutorial({ onComplete }) {
  const { gesture, connected } = useGestureSocket();
  const [currentStep, setCurrentStep] = useState(0);
  const [stepCompleted, setStepCompleted] = useState(false);

  const steps = [
    {
      id: "show-hand",
      title: "Langkah 1: Tunjukkan Tangan",
      instruction: "Angkat tanganmu dan posisikan di depan kamera. Pastikan semua jari terlihat jelas oleh kamera. Kamu akan melihat titik abu-abu muncul di layar saat tangan terdeteksi.",
      checkCondition: () => gesture && gesture.x !== null && gesture.y !== null,
      position: "top-center",
    },
    {
      id: "armed-gesture",
      title: "Langkah 2: Bentuk Tangan Seperti Pistol",
      instruction: "Bentuk tanganmu seperti pistol: jari telunjuk lurus ke depan, sedangkan jari tengah, jari manis, dan kelingking ditekuk ke dalam. Titik akan berubah menjadi hijau saat berhasil.",
      checkCondition: () => gesture?.armed === true,
      position: "top-center",
    },
    {
      id: "aim",
      title: "Langkah 3: Arahkan ke Target",
      instruction: "Gerakkan tanganmu ke kiri, kanan, atas, atau bawah untuk mengarahkan titik hijau. Titik hijau akan mengikuti posisi jari telunjukmu di layar.",
      checkCondition: () => gesture?.armed === true && gesture.x !== null,
      position: "top-center",
    },
    {
      id: "shoot",
      title: "Langkah 4: Tembak!",
      instruction: "Dengan tangan masih berbentuk pistol, gerakkan tanganmu ke bawah dengan cepat dan tegas. Titik akan berubah menjadi merah saat kamu menembak. Coba sekarang!",
      checkCondition: () => gesture?.shoot === true,
      position: "top-center",
    },
  ];

  const currentStepData = steps[currentStep];

  useEffect(() => {
    if (!currentStepData) return;
    
    const conditionMet = currentStepData.checkCondition();
    if (conditionMet && !stepCompleted) {
      setStepCompleted(true);
      const timer = setTimeout(() => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1);
          setStepCompleted(false);
        } else {
          setTimeout(() => {
            onComplete();
          }, 1500);
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [gesture, currentStep, stepCompleted, currentStepData, steps.length, onComplete]);

  const getPopupPosition = () => {
    switch (currentStepData?.position) {
      case "top-center":
        return "top-24 left-1/2 transform -translate-x-1/2";
      case "bottom-center":
        return "bottom-24 left-1/2 transform -translate-x-1/2";
      default:
        return "top-24 left-1/2 transform -translate-x-1/2";
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col relative bg-slate-900">
      <div className="absolute top-4 left-4 z-30">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
          <div className="text-sm opacity-80">Tutorial</div>
          <div className="text-lg font-bold">
            Langkah {currentStep + 1} dari {steps.length}
          </div>
        </div>
      </div>

      <GameCanvas gesture={gesture} answers={[]} isPlaying={true} />

      {currentStepData && (
        <div className={`absolute ${getPopupPosition()} z-30 max-w-md w-full mx-4`}>
          <div className="bg-blue-600 rounded-xl p-6 shadow-2xl border-2 border-blue-400 relative">
            <div className="absolute -top-3 left-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-blue-400"></div>
            
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">
                  {currentStepData.title}
                </h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  {currentStepData.instruction}
                </p>
              </div>
            </div>

            {stepCompleted && (
              <div className="bg-green-500/20 border border-green-400 rounded-lg p-3 mb-4">
                <p className="text-green-300 text-sm font-medium">
                  ✓ Berhasil! Lanjut ke langkah berikutnya...
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      index === currentStep
                        ? "bg-white w-8"
                        : index < currentStep
                        ? "bg-green-400 w-4"
                        : "bg-white/30 w-4"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={onComplete}
                className="text-white/70 hover:text-white transition-colors text-sm"
              >
                Lewati Tutorial
              </button>
            </div>
          </div>
        </div>
      )}

      {!connected && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-red-500/80 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm">
            Pastikan backend Python berjalan untuk tutorial
          </div>
        </div>
      )}
    </div>
  );
}

