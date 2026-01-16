import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useParticleStore, ParticlePattern } from './Store';

const COUNT = 15000;

export const Particles = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const { pattern, color, handState, handPosition, isHandDetected } = useParticleStore();
  
  // Generate initial positions
  const particles = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return { positions };
  }, []);

  // Generate Saturn Targets
  const saturnTargets = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      let x = 0, y = 0, z = 0;
      if (i < COUNT * 0.3) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const r = 2.5; 
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.sin(phi) * Math.sin(theta);
        z = r * Math.cos(phi);
      } else {
        const theta = Math.random() * Math.PI * 2;
        const r = 4.5 + Math.random() * 3.5;
        x = r * Math.cos(theta);
        z = r * Math.sin(theta);
        y = (Math.random() - 0.5) * 0.1;
        const tilt = 0.44; 
        const yNew = y * Math.cos(tilt) - z * Math.sin(tilt);
        const zNew = y * Math.sin(tilt) + z * Math.cos(tilt);
        y = yNew;
        z = zNew;
      }
      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, []);

  // Generate Heart Border Targets (Hollow)
  const heartTargets = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const t = Math.random() * Math.PI * 2;
      const xBase = 16 * Math.pow(Math.sin(t), 3);
      const yBase = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
      const scale = 0.35; 
      const jitter = 0.5; 
      const jx = (Math.random() - 0.5) * jitter;
      const jy = (Math.random() - 0.5) * jitter;
      const jz = (Math.random() - 0.5) * jitter;
      const x = (xBase * scale) + jx;
      const y = (yBase * scale) + jy;
      const z = jz; 
      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, []);

  // Generate Layered Heart Targets (Nested Hearts)
  const layeredHeartTargets = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const t = Math.random() * Math.PI * 2;
      const xBase = 16 * Math.pow(Math.sin(t), 3);
      const yBase = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
      
      let scale = 0.35;
      // 3 Layers: Outer (50%), Middle (30%), Inner (20%)
      if (i < COUNT * 0.5) {
        scale = 0.35; // Outer
      } else if (i < COUNT * 0.8) {
        scale = 0.22; // Middle
      } else {
        scale = 0.12; // Inner
      }
      
      const jitter = 0.4; 
      const jx = (Math.random() - 0.5) * jitter;
      const jy = (Math.random() - 0.5) * jitter;
      const jz = (Math.random() - 0.5) * jitter;
      
      const x = (xBase * scale) + jx;
      const y = (yBase * scale) + jy;
      const z = jz; 
      
      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, []);

  // Generate Zootopia Targets (Fist)
  const zootopiaTargets = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return arr;
    
    const width = 600;
    const height = 500;
    canvas.width = width;
    canvas.height = height;
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = '#ffffff';
    
    // 1. "HALOO" Text
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HALOO', width / 2, 60);
    
    // 2. Rabbit Head (Judy) - Left
    const rx = 180;
    const ry = 250;
    // Ears
    ctx.beginPath();
    ctx.ellipse(rx - 25, ry - 70, 15, 60, -0.1, 0, Math.PI * 2);
    ctx.ellipse(rx + 25, ry - 70, 15, 60, 0.1, 0, Math.PI * 2);
    ctx.fill();
    // Head
    ctx.beginPath();
    ctx.arc(rx, ry, 55, 0, Math.PI * 2);
    ctx.fill();
    // Name
    ctx.font = 'bold 30px Arial';
    ctx.fillText('NANDA', rx, ry + 90);
    
    // 3. Fox Head (Nick) - Right
    const fx = 420;
    const fy = 250;
    // Ears
    ctx.beginPath();
    ctx.moveTo(fx - 50, fy - 40);
    ctx.lineTo(fx - 20, fy - 100);
    ctx.lineTo(fx, fy - 50);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(fx + 50, fy - 40);
    ctx.lineTo(fx + 20, fy - 100);
    ctx.lineTo(fx, fy - 50);
    ctx.fill();
    // Head (Triangular/Diamond)
    ctx.beginPath();
    ctx.moveTo(fx - 55, fy - 20);
    ctx.lineTo(fx + 55, fy - 20);
    ctx.lineTo(fx, fy + 60);
    ctx.fill();
    // Cheeks
    ctx.beginPath();
    ctx.arc(fx, fy - 20, 50, 0, Math.PI, true);
    ctx.fill();
    
    // Name
    ctx.font = 'bold 30px Arial';
    ctx.fillText('NASRIL', fx, fy + 90);
    
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const validPoints: {x: number, y: number}[] = [];
    
    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x += 2) {
        const i = (y * width + x) * 4;
        if (data[i] > 128) {
          validPoints.push({x, y});
        }
      }
    }
    
    if (validPoints.length === 0) return arr;
    
    for (let i = 0; i < COUNT; i++) {
      const p = validPoints[i % validPoints.length];
      const x = (p.x - width / 2) * 0.04;
      const y = -(p.y - height / 2) * 0.04;
      const z = (Math.random() - 0.5) * 0.5;
      
      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, []);

  // Generate Birthday Text Targets
  const textTargets = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return arr;
    
    const width = 500;
    const height = 300;
    canvas.width = width;
    canvas.height = height;
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.fillText('HAPPY', width / 2, height / 4);
    ctx.fillText('BIRTHDAY', width / 2, height / 2);
    ctx.fillText('NANDA', width / 2, height * 0.75);
    
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const validPoints: {x: number, y: number}[] = [];
    
    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x += 2) {
        const i = (y * width + x) * 4;
        if (data[i] > 128) {
          validPoints.push({x, y});
        }
      }
    }
    
    if (validPoints.length === 0) return arr;
    
    for (let i = 0; i < COUNT; i++) {
      const p = validPoints[i % validPoints.length];
      const x = (p.x - width / 2) * 0.05;
      const y = -(p.y - height / 2) * 0.05;
      const z = (Math.random() - 0.5) * 0.5;
      
      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, []);

  // Generate Love Text Targets (Open Hand)
  const loveTextTargets = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return arr;
    
    const width = 500;
    const height = 300;
    canvas.width = width;
    canvas.height = height;
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 50px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.fillText('LOVE U', width / 2, height / 4);
    ctx.fillText('FROM', width / 2, height / 2);
    ctx.fillText('NASRIL', width / 2, height * 0.75);
    
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const validPoints: {x: number, y: number}[] = [];
    
    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x += 2) {
        const i = (y * width + x) * 4;
        if (data[i] > 128) {
          validPoints.push({x, y});
        }
      }
    }
    
    if (validPoints.length === 0) return arr;
    
    for (let i = 0; i < COUNT; i++) {
      const p = validPoints[i % validPoints.length];
      const x = (p.x - width / 2) * 0.05;
      const y = -(p.y - height / 2) * 0.05;
      const z = (Math.random() - 0.5) * 0.5;
      
      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, []);

  // Helper to generate targets for other patterns
  const generateTargets = (type: ParticlePattern) => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      let x = 0, y = 0, z = 0;
      
      if (type === 'sphere') {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const r = 4 + (Math.random() - 0.5) * 0.5;
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.sin(phi) * Math.sin(theta);
        z = r * Math.cos(phi);
      } else if (type === 'cube') {
        const s = 6;
        x = (Math.random() - 0.5) * s;
        y = (Math.random() - 0.5) * s;
        z = (Math.random() - 0.5) * s;
      } else if (type === 'ring') {
        const theta = Math.random() * Math.PI * 2;
        const r = 5 + (Math.random() - 0.5) * 1.5;
        x = r * Math.cos(theta);
        y = r * Math.sin(theta);
        z = (Math.random() - 0.5) * 2;
      } else { // random
        x = (Math.random() - 0.5) * 15;
        y = (Math.random() - 0.5) * 15;
        z = (Math.random() - 0.5) * 15;
      }
      
      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  };

  const currentTargets = useRef(generateTargets('sphere'));
  useEffect(() => {
    currentTargets.current = generateTargets(pattern);
  }, [pattern]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    let targetArr = currentTargets.current;
    
    // Interaction Factors
    let expansion = 1.0;
    let attraction = 0.03;
    
    if (isHandDetected) {
      if (handState === 'open') {
        targetArr = loveTextTargets;
        expansion = 1.0;
        attraction = 0.1;
      } else if (handState === 'closed') {
        targetArr = zootopiaTargets; // Changed from saturnTargets
        expansion = 1.0;
        attraction = 0.1;
      } else if (handState === 'fingerHeart') {
        targetArr = heartTargets;
        expansion = 1.0;
        attraction = 0.1;
      } else if (handState === 'twoHandsHeart') {
        targetArr = layeredHeartTargets;
        const time = state.clock.getElapsedTime();
        const pulse = 1.8 + Math.sin(time * 10) * 0.2;
        expansion = pulse; 
        attraction = 0.1;
      } else if (handState === 'victory') {
        targetArr = textTargets;
        expansion = 1.0;
        attraction = 0.1;
      }
      
      // Limit Rotation to prevent flipping
      // Map 0..1 to -0.5..0.5 radians (~ -30..30 degrees)
      const targetRotX = (handPosition.y - 0.5) * 1.0; 
      const targetRotY = (handPosition.x - 0.5) * 1.0;
      
      // Smoothly interpolate
      pointsRef.current.rotation.x += (targetRotX - pointsRef.current.rotation.x) * 0.1;
      pointsRef.current.rotation.y += (targetRotY - pointsRef.current.rotation.y) * 0.1;
      
      // Clamp just in case
      pointsRef.current.rotation.x = THREE.MathUtils.clamp(pointsRef.current.rotation.x, -0.8, 0.8);
      pointsRef.current.rotation.y = THREE.MathUtils.clamp(pointsRef.current.rotation.y, -0.8, 0.8);
      
    } else {
      // Idle Animation: Gentle Sway instead of Spin
      const time = state.clock.getElapsedTime();
      // Sway Y axis +/- 0.2 radians
      const targetIdleY = Math.sin(time * 0.5) * 0.2;
      const targetIdleZ = Math.cos(time * 0.3) * 0.05;
      
      pointsRef.current.rotation.y += (targetIdleY - pointsRef.current.rotation.y) * 0.02;
      pointsRef.current.rotation.z += (targetIdleZ - pointsRef.current.rotation.z) * 0.02;
      
      // Reset X rotation to 0
      pointsRef.current.rotation.x += (0 - pointsRef.current.rotation.x) * 0.05;
    }

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;
      
      const tx = targetArr[ix] * expansion;
      const ty = targetArr[iy] * expansion;
      const tz = targetArr[iz] * expansion;
      
      positions[ix] += (tx - positions[ix]) * attraction;
      positions[iy] += (ty - positions[iy]) * attraction;
      positions[iz] += (tz - positions[iz]) * attraction;
      
      if (handState === 'open') {
         // No noise for text
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color={color}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
