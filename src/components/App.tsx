import { ParticleScene } from './particles/ParticleScene';
import { GestureController } from './particles/GestureController';
import { UIOverlay } from './particles/UIOverlay';

function App() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <ParticleScene />
      <GestureController />
      <UIOverlay />
    </div>
  );
}

export default App;
