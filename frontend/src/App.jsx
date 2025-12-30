import { useGestureSocket } from "./hooks/useGestureSocker";
import GameCanvas from "./game/GameCanvas";
import ControlPanel from "./components/ControlPanel"

export default function App() {
  const { gesture, start, pause, connected } = useGestureSocket();

  return (
    <div className="w-screen h-screen flex flex-col">
      <ControlPanel start={start} pause={pause} connected={connected} />
      <GameCanvas gesture={gesture} />
    </div>
  );
}
