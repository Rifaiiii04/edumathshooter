import {
  PlayIcon,
  HandRaisedIcon,
  ComputerDesktopIcon,
  AcademicCapIcon,
  ChartBarIcon,
  TrophyIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/solid";
import icon from "../assets/images/icon.png";
import gestureVideo from "../assets/video/gesture.mp4";
import mouseVideo from "../assets/video/mouse.mp4";

export default function LandingPage({ onGetStarted }) {
  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      icon: HandRaisedIcon,
      title: "Gesture Control",
      description:
        "Use natural hand gestures to aim and shoot. Point your finger like a gun for an immersive gaming experience. Requires local setup - see GitHub for instructions.",
      video: gestureVideo,
      isLocalOnly: true,
    },
    {
      icon: ComputerDesktopIcon,
      title: "Mouse & Touch",
      description:
        "Play with traditional mouse controls or touch your screen. Simple and intuitive for everyone. Available now!",
      video: mouseVideo,
      isLocalOnly: false,
    },
  ];

  const benefits = [
    {
      icon: AcademicCapIcon,
      title: "Learn While Playing",
      description:
        "Master mathematics through interactive gameplay that makes learning fun and engaging.",
    },
    {
      icon: ChartBarIcon,
      title: "Track Your Progress",
      description:
        "Monitor your improvement with real-time scoring and difficulty adjustments.",
    },
    {
      icon: TrophyIcon,
      title: "Challenge Yourself",
      description:
        "Test your skills across multiple difficulty levels and mathematical operations.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img
                src={icon}
                alt="Vectory Icon"
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-bold text-white">Vectory</span>
            </div>
            <button
              onClick={onGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              Get Started
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Master Math Through
              <span className="block text-blue-400">Interactive Action</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-200/80 max-w-3xl mx-auto mb-8">
              Transform mathematics learning into an exciting adventure. Answer
              questions, improve your skills, and achieve mastery through
              gameplay.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onGetStarted}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-600/30 flex items-center gap-2"
              >
                <PlayIcon className="w-6 h-6" />
                Start Playing Now
              </button>
              <button
                onClick={scrollToFeatures}
                className="bg-slate-800 hover:bg-slate-700 text-blue-300 font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-200 border border-slate-700"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              Multiple Ways to Play
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-blue-200/70 max-w-2xl mx-auto px-4">
              Choose your preferred input method and start your mathematical
              journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-16">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-slate-900 rounded-xl p-8 border border-slate-800 hover:border-blue-600/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-blue-600/20 p-3 rounded-lg">
                      <IconComponent className="w-8 h-8 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold text-white">
                        {feature.title}
                      </h3>
                      {feature.isLocalOnly && (
                        <span className="text-xs text-blue-400 bg-blue-600/20 px-2 py-1 rounded mt-1 inline-block">
                          Local Setup Required
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-blue-200/70 mb-6 text-lg">
                    {feature.description}
                  </p>
                  <div className="relative rounded-lg overflow-hidden bg-slate-950 aspect-video border border-slate-800">
                    <video
                      src={feature.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {feature.isLocalOnly && (
                    <a
                      href="https://github.com/Rifaiiii04/edumathshooter"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 sm:mt-4 w-full bg-slate-800 hover:bg-slate-700 text-blue-300 font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2 border border-slate-700 hover:border-blue-600/50"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="hidden sm:inline">
                        View Setup Instructions on GitHub
                      </span>
                      <span className="sm:hidden">View GitHub</span>
                      <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose Vectory?
            </h2>
            <p className="text-xl text-blue-200/70 max-w-2xl mx-auto">
              Experience mathematics learning like never before
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-slate-900 rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 border border-slate-800 hover:border-blue-600/50 transition-all duration-300"
                >
                  <div className="bg-blue-600/20 p-3 sm:p-4 rounded-lg w-fit mb-4 sm:mb-6">
                    <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-3 sm:mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-blue-200/70 text-sm sm:text-base md:text-lg">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900 rounded-2xl p-12 border border-slate-800 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Learning?
            </h2>
            <p className="text-xl text-blue-200/70 mb-8 max-w-2xl mx-auto">
              Join thousands of students improving their math skills through
              interactive gameplay
            </p>
            <button
              onClick={onGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-5 rounded-lg text-xl transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-600/30 flex items-center gap-3 mx-auto"
            >
              <PlayIcon className="w-7 h-7" />
              Get Started Free
              <ArrowRightIcon className="w-6 h-6" />
            </button>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-blue-200/60">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-blue-400" />
                <span>No sign-up required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-blue-400" />
                <span>Free to play</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-blue-400" />
                <span>Multiple difficulty levels</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900 rounded-2xl p-12 border border-slate-800">
            <div className="text-center mb-8">
              <div className="bg-blue-600/20 p-4 rounded-lg w-fit mx-auto mb-6">
                <CodeBracketIcon className="w-12 h-12 text-blue-400" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Open for Contributions
              </h2>
              <p className="text-xl text-blue-200/70 max-w-2xl mx-auto">
                Vectory is currently under active development. We welcome
                contributions, especially for gesture detection improvements!
              </p>
            </div>
            <div className="bg-slate-950 rounded-xl p-6 border border-slate-800 mb-6">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <HandRaisedIcon className="w-6 h-6 text-blue-400" />
                Gesture Detection in Development
              </h3>
              <p className="text-blue-200/70 mb-4">
                The gesture control feature is still being refined. We're
                actively working on improving accuracy, responsiveness, and user
                experience. Your feedback and contributions are highly valued!
              </p>
              <ul className="space-y-2 text-blue-200/60 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Gesture recognition accuracy improvements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Better hand tracking and cursor stabilization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Enhanced state machine for gesture detection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Cross-browser compatibility testing</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/Rifaiiii04/edumathshooter"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 border border-slate-700 hover:border-blue-600/50"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                View on GitHub
                <ArrowRightIcon className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/Rifaiiii04/edumathshooter/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-semibold px-8 py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 border border-blue-600/30 hover:border-blue-600/50"
              >
                Report Issues
                <ArrowRightIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img
                  src={icon}
                  alt="Vectory Icon"
                  className="w-8 h-8 object-contain"
                />
                <span className="text-xl font-bold text-white">Vectory</span>
              </div>
              <p className="text-blue-200/60 text-sm">
                Master mathematics through interactive gameplay. Learn,
                practice, and excel.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-blue-200/60 text-sm">
                <li>Gesture Control</li>
                <li>Mouse & Touch Support</li>
                <li>Multiple Difficulty Levels</li>
                <li>Real-time Scoring</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Game Modes</h4>
              <ul className="space-y-2 text-blue-200/60 text-sm">
                <li>Addition</li>
                <li>Subtraction</li>
                <li>Multiplication</li>
                <li>Division</li>
                <li>Mixed Operations</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contribute</h4>
              <p className="text-blue-200/60 text-sm mb-4">
                Vectory is open source and under active development. Help us
                improve, especially the gesture detection feature!
              </p>
              <a
                href="https://github.com/Rifaiiii04/edumathshooter"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                GitHub Repository
              </a>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center">
            <p className="text-blue-200/60 text-sm">
              © 2024 Vectory. Challenge yourself with math problems. Improve
              your skills. Have fun learning.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
