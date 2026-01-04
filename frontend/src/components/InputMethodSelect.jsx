import { HandRaisedIcon, ComputerDesktopIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/solid";

export default function InputMethodSelect({ onSelect }) {
  const inputMethods = [
    {
      id: "gesture",
      name: "Gesture (Tangan)",
      description: "Gunakan gerakan tangan untuk mengontrol game",
      icon: HandRaisedIcon,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "mouse",
      name: "Mouse",
      description: "Gunakan mouse untuk mengontrol game (Desktop)",
      icon: ComputerDesktopIcon,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "touch",
      name: "Touch",
      description: "Tap layar untuk mengontrol game (Mobile)",
      icon: DevicePhoneMobileIcon,
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Pilih Metode Input
          </h1>
          <p className="text-gray-400">
            Pilih cara kamu ingin mengontrol game
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {inputMethods.map((method) => {
            const IconComponent = method.icon;
            return (
              <button
                key={method.id}
                onClick={() => onSelect(method.id)}
                className={`bg-slate-800/90 backdrop-blur-sm rounded-xl p-6 text-left hover:scale-105 transition-all duration-200 border-2 border-white/10 hover:border-white/30 group`}
              >
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {method.name}
                </h3>
                <p className="text-gray-400 text-sm">
                  {method.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

