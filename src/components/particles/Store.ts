import { create } from 'zustand';

export type ParticlePattern = 'sphere' | 'cube' | 'ring' | 'random';

interface ParticleState {
  // UI Controls
  pattern: ParticlePattern;
  color: string;
  setPattern: (pattern: ParticlePattern) => void;
  setColor: (color: string) => void;

  // Gesture State
  isHandDetected: boolean;
  handState: 'open' | 'closed' | 'neutral' | 'fingerHeart' | 'twoHandsHeart' | 'victory';
  handPosition: { x: number; y: number }; // Normalized 0-1
  setHandStatus: (detected: boolean, state: 'open' | 'closed' | 'neutral' | 'fingerHeart' | 'twoHandsHeart' | 'victory', position: { x: number; y: number }) => void;
}

export const useParticleStore = create<ParticleState>((set) => ({
  pattern: 'sphere',
  color: '#00ffff',
  setPattern: (pattern) => set({ pattern }),
  setColor: (color) => set({ color }),

  isHandDetected: false,
  handState: 'neutral',
  handPosition: { x: 0.5, y: 0.5 },
  setHandStatus: (detected, state, position) => set({ isHandDetected: detected, handState: state, handPosition: position }),
}));
