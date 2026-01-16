import { useParticleStore, ParticlePattern } from './Store';
import { Maximize, Minimize } from 'lucide-react';
import { useState } from 'react';

export const UIOverlay = () => {
  const { pattern, setPattern, color, setColor, isHandDetected, handState } = useParticleStore();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const patterns: ParticlePattern[] = ['sphere', 'cube', 'ring', 'random'];

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none p-6 flex flex-col justify-between z-10">
      {/* Header */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">NASRIL'S <span className="text-cyan-400">Gifts</span></h1>
          <p className="text-xs text-white/50 mt-1">For 18 nanda birthday💗</p>
        </div>
        <button 
          onClick={toggleFullscreen}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-md"
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
      </div>

      {/* Status Indicator */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 pointer-events-none">
        <div className={`px-4 py-2 rounded-full backdrop-blur-md border transition-colors duration-300 flex items-center gap-2 ${
          isHandDetected 
            ? 'bg-green-500/20 border-green-500/50 text-green-300' 
            : 'bg-red-500/20 border-red-500/50 text-red-300'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isHandDetected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
          <span className="text-xs font-mono uppercase">
            {isHandDetected ? `Connected: ${handState}` : 'No Hand Detected'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="pointer-events-auto bg-black/40 backdrop-blur-lg border border-white/10 rounded-2xl p-4 w-full max-w-xs self-end md:self-start">
        <div className="space-y-4">
          {/* Pattern Selector */}
          <div>
            <label className="text-xs text-white/60 uppercase tracking-widest mb-2 block">Model Pattern</label>
            <div className="grid grid-cols-2 gap-2">
              {patterns.map((p) => (
                <button
                  key={p}
                  onClick={() => setPattern(p)}
                  className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                    pattern === p 
                      ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]' 
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="text-xs text-white/60 uppercase tracking-widest mb-2 block">Visual Tone</label>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {['#00ffff', '#ff00ff', '#ffff00', '#ff3333', '#33ff33', '#ffffff'].map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    color === c ? 'border-white scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c, boxShadow: `0 0 10px ${c}40` }}
                />
              ))}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white to-black border border-white/20 flex items-center justify-center text-xs text-white cursor-pointer relative hover:scale-110 transition-transform">
                +
                <input 
                  type="color" 
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
