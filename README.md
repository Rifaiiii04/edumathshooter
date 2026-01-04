# Vectory

**Master Math Through Interactive Action**

An educational game that transforms mathematics learning into an exciting adventure. Answer math questions by shooting the correct answers using mouse or touch input.

## 🎮 Features

- **Multiple Input Methods**: Mouse and Touch controls (available now)
- **Gesture Control**: Hand gesture support (requires local setup - see below)
- **Difficulty Levels**: Easy, Medium, and Hard
- **Math Operations**: Addition, Subtraction, Multiplication, Division, and Mixed
- **Health System**: Three hearts - lose health for wrong answers or timeouts
- **High Score System**: Challenge yourself to achieve the highest score

## 🚀 Quick Start

### Online (Mouse & Touch Only)

The game is hosted on Netlify. Simply visit the website and start playing with mouse or touch controls.

### Local Setup (For Gesture Control)

Gesture control requires running the backend locally as it needs WebSocket connection and camera access.

#### Prerequisites

- Node.js 18+
- Python 3.8+
- Webcam

#### Installation

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

**Backend:**

```bash
cd backend
pip install -r requirements.txt
python -m app.main
```

#### Usage

1. Start backend: `python -m app.main` (runs on `ws://localhost:8765`)
2. Start frontend: `npm run dev` (runs on `http://localhost:5173`)
3. Open browser and select Gesture input method
4. Show your hand to the camera
5. Form a gun gesture (index finger extended, other fingers curled)
6. Move hand to aim, raise index finger upward to shoot

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Python, FastAPI, WebSocket, OpenCV, MediaPipe

## 🤝 Contributing

This project is open for contributions! We're particularly looking for help with:

- **Gesture Detection**: Improving accuracy, hand tracking, and state machine
- **UI/UX Improvements**: Better interface and user experience
- **Bug Fixes**: Fixing reported issues
- **Documentation**: Improving guides and documentation

### How to Contribute

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

See [GitHub Issues](https://github.com/Rifaiiii04/edumathshooter/issues) to report bugs or suggest features.

## 🔗 Links

- **GitHub**: [https://github.com/Rifaiiii04/edumathshooter](https://github.com/Rifaiiii04/edumathshooter)
- **Issues**: [https://github.com/Rifaiiii04/edumathshooter/issues](https://github.com/Rifaiiii04/edumathshooter/issues)

---

**Note**: Gesture control requires local setup. Mouse and Touch controls work online immediately.
