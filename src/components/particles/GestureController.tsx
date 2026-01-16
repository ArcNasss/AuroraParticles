import { useEffect, useRef, useState } from 'react';
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { useParticleStore } from './Store';

export const GestureController = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const setHandStatus = useParticleStore((state) => state.setHandStatus);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults((results) => {
      setIsLoaded(true);
      onResults(results);
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) {
          await hands.send({ image: videoRef.current });
        }
      },
      width: 640,
      height: 480,
    });

    camera.start();

    return () => {
      // @ts-ignore
      if (camera.stop) camera.stop();
      hands.close();
    };
  }, []);

  const onResults = (results: Results) => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      // Check for 2 Hands Heart (🫶)
      if (results.multiHandLandmarks.length === 2) {
        const hand1 = results.multiHandLandmarks[0][9]; // Middle MCP
        const hand2 = results.multiHandLandmarks[1][9];
        
        const dist = Math.hypot(hand1.x - hand2.x, hand1.y - hand2.y);
        
        // If hands are close enough
        if (dist < 0.5) {
          const cx = (hand1.x + hand2.x) / 2;
          const cy = (hand1.y + hand2.y) / 2;
          setHandStatus(true, 'twoHandsHeart', { x: 1 - cx, y: cy });
          return;
        }
      }

      // Single Hand Logic (Primary Hand)
      const landmarks = results.multiHandLandmarks[0];
      const wrist = landmarks[0];
      const palm = landmarks[9]; // Middle MCP
      const handSize = Math.hypot(palm.x - wrist.x, palm.y - wrist.y);

      // Helper to check if finger is curled
      const isCurled = (tipIdx: number, mcpIdx: number) => {
        const tip = landmarks[tipIdx];
        const mcp = landmarks[mcpIdx];
        const distTip = Math.hypot(tip.x - wrist.x, tip.y - wrist.y);
        const distMcp = Math.hypot(mcp.x - wrist.x, mcp.y - wrist.y);
        return distTip < distMcp * 1.2; // Tip is closer to wrist than MCP (or similar)
      };

      // Check Closed (Fist) - Priority 1
      // Check Index(8), Middle(12), Ring(16), Pinky(20)
      const fingersCurled = [
        isCurled(8, 5),
        isCurled(12, 9),
        isCurled(16, 13),
        isCurled(20, 17)
      ];
      
      const curledCount = fingersCurled.filter(c => c).length;
      
      // If at least 3 fingers are curled (excluding thumb), it's likely a fist/closed
      // But Finger Heart also has curled fingers (Middle, Ring, Pinky).
      // Key difference: Index finger.
      // In Fist: Index is curled.
      // In Finger Heart: Index is NOT fully curled (it meets thumb).
      
      const indexCurled = isCurled(8, 5);
      
      // Check Pinch (Finger Heart) - Priority 2
      const thumbTip = landmarks[4];
      const indexTip = landmarks[8];
      const pinchDist = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);
      const isPinch = pinchDist < handSize * 0.5;

      // Logic Decision Tree
      let state: 'open' | 'closed' | 'neutral' | 'fingerHeart' | 'twoHandsHeart' | 'victory' = 'neutral';

      // Check Victory (V)
      // Index Extended, Middle Extended, Ring Curled, Pinky Curled
      const isVictory = !isCurled(8, 5) && !isCurled(12, 9) && isCurled(16, 13) && isCurled(20, 17);

      // Refined Logic:
      // Fist: Index is curled (Tip closer to wrist than MCP).
      // Finger Heart: Pinch (Thumb close to Index) AND Index is NOT fully curled (Tip further than MCP).
      
      if (curledCount >= 3 && indexCurled) {
        // If index is curled (and others too), it's a Fist, regardless of pinch
        state = 'closed';
      } else if (isPinch && !indexCurled) {
        // If pinching and index is NOT curled -> Finger Heart
        state = 'fingerHeart';
      } else if (isVictory) {
        state = 'victory';
      } else {
        // Check Open
        // Count extended fingers
        const tips = [8, 12, 16, 20];
        const mcpIndices = [5, 9, 13, 17];
        let openCount = 0;
        tips.forEach((tipIdx, i) => {
          if (!isCurled(tipIdx, mcpIndices[i])) openCount++;
        });
        // Thumb check
        const thumbMcp = landmarks[2];
        const distThumbTip = Math.hypot(thumbTip.x - wrist.x, thumbTip.y - wrist.y);
        const distThumbMcp = Math.hypot(thumbMcp.x - wrist.x, thumbMcp.y - wrist.y);
        if (distThumbTip > distThumbMcp * 1.1) openCount++;

        if (openCount >= 3) state = 'open';
        else state = 'neutral';
      }

      const x = 1 - palm.x; 
      const y = palm.y;
      setHandStatus(true, state, { x, y });
    } else {
      setHandStatus(false, 'neutral', { x: 0.5, y: 0.5 });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-32 h-24 bg-black/50 rounded-lg overflow-hidden border border-white/20 z-50 shadow-lg backdrop-blur-sm">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <video
        ref={videoRef}
        className="w-full h-full object-cover transform -scale-x-100"
        playsInline
        muted
      />
      <div className="absolute bottom-1 left-1 text-[10px] text-white/70 font-mono">
        Gesture Cam
      </div>
    </div>
  );
};
