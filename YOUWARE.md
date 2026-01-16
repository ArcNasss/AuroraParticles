# YOUWARE Project - Gesture Particle System

## Project Status
- **Project Type**: React + Three.js + MediaPipe
- **Entry Point**: `src/main.tsx`
- **Build System**: Vite 7.0.0
- **Styling System**: Tailwind CSS 3.4.17

## Features Implemented
1. **Real-time 3D Particle System**:
   - Built with Three.js and React Three Fiber.
   - Renders 15,000 interactive particles.
   - Supports dynamic morphing between patterns (Sphere, Cube, Ring, Random).

2. **Gesture Control**:
   - Integrated MediaPipe Hands for real-time hand tracking.
   - **Gesture Detection**: Improved logic to distinguish between Fist (curled index) and Finger Heart (extended index pinch).
   - **Open Hand (5 Fingers ✋)**: Morphs particles into text **"LOVE U FROM NASRIL"**.
   - **Fist (Mengepal ✊)**: Morphs particles into **Zootopia Theme** (Rabbit & Fox with names).
   - **Finger Heart (🫰)**: Morphs particles into a **Hollow Heart (Border Only)**.
   - **Two Hands Heart (🫶)**: Morphs particles into a **Nested Heart (Layered)** like 💗.
   - **Victory Sign (✌️)**: Morphs particles into text **"HAPPY BIRTHDAY NANDA"**.
   - **Rotation Control**: Limited interactive rotation to prevent flipping/mirroring issues.
   - **Hand Position**: Controls the rotation/orientation of the particle system.

3. **Interactive UI**:
   - **Pattern Selector**: Switch between 3D models instantly.
   - **Color Picker**: Adjust the visual tone of the particles.
   - **Fullscreen Mode**: Immersive experience button.
   - **Status Indicator**: Visual feedback for hand detection status.

## Technical Details
- **State Management**: Zustand store (`src/components/particles/store.ts`) bridges the Gesture Controller and the 3D Scene.
- **Performance**: Uses `BufferGeometry` and `Float32Array` for efficient particle rendering.
- **Computer Vision**: Runs MediaPipe Hands entirely in the browser (client-side).

## Usage
1. Allow camera access when prompted.
2. Show your hand to the camera.
3. Open your hand to expand particles.
4. Close your hand to contract particles.
5. Move your hand to rotate the system.
6. Use the UI to change patterns and colors.
