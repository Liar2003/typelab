import { useRef, useMemo, memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useTypingStore } from '../../store/typingStore';
import { FINGER_MAP } from '../../engine/fingerMapping';
import * as THREE from 'three';

const fingerColors: Record<string, string> = {
  leftPinky: '#a855f7',
  leftRing: '#3b82f6',
  leftMiddle: '#22c55e',
  leftIndex: '#eab308',
  rightIndex: '#eab308',
  rightMiddle: '#22c55e',
  rightRing: '#3b82f6',
  rightPinky: '#a855f7',
};

interface KeyProps {
  position: [number, number, number];
  label: string;
  isPressed: boolean;
  isIncorrect: boolean;
  isExpected: boolean;
  fingerColor: string;
  width?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Key({ position, label, isPressed, isIncorrect, isExpected, fingerColor, width = 1 }: KeyProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const targetY = isPressed ? -0.1 : 0;

  let color = '#2a2a3a';
  if (isExpected) color = '#7c3aed';
  else if (isIncorrect) color = '#ef4444';
  else if (isPressed) color = '#22c55e';
  else color = fingerColor || '#2a2a3a';

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        position={[0, targetY, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.9 * width, 0.3, 0.9]} />
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.7}
          emissive={isExpected ? '#7c3aed' : '#000000'}
          emissiveIntensity={isExpected ? 0.5 : 0}
        />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.85 * width, 0.05, 0.85]} />
        <meshStandardMaterial
          color={isExpected ? '#ffffff' : '#1a1a2a'}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
    </group>
  );
}

interface KeyboardRowProps {
  keys: string[];
  row: number;
  pressedKeys: Set<string>;
  incorrectKeys: Set<string>;
  expectedKey: string;
}

function KeyboardRow({ keys, row, pressedKeys, incorrectKeys, expectedKey }: KeyboardRowProps) {
  const offset = row * 0.5;
  
  return (
    <group position={[offset, 0, row * -1.1]}>
      {keys.map((key, index) => {
        const finger = FINGER_MAP[key]?.finger;
        const fingerColor = finger ? fingerColors[finger] : '#2a2a3a';
        
        return (
          <Key
            key={key}
            position={[index * 1.1, 0, 0]}
            label={key}
            isPressed={pressedKeys.has(key)}
            isIncorrect={incorrectKeys.has(key)}
            isExpected={key === expectedKey}
            fingerColor={fingerColor}
          />
        );
      })}
    </group>
  );
}

export const Keyboard3D = memo(function Keyboard3D() {
  const characters = useTypingStore((s) => s.characters);
  const currentIndex = useTypingStore((s) => s.currentIndex);

  const pressedKeys = useMemo(() => {
    return new Set(
      characters
        .slice(0, currentIndex)
        .map((c) => c.expected.toLowerCase())
    );
  }, [characters, currentIndex]);

  const incorrectKeys = useMemo(() => {
    return new Set(
      characters
        .slice(0, currentIndex)
        .filter((c) => c.state === 'incorrect')
        .map((c) => c.expected.toLowerCase())
    );
  }, [characters, currentIndex]);

  const expectedKey = characters[currentIndex]?.expected.toLowerCase() || '';

  const rows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  ];

  return (
    <div className="w-full h-64 md:h-80">
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        shadows
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#7c3aed" />
        
        <group position={[-2.5, 0, 1]}>
          {rows.map((row, rowIndex) => (
            <KeyboardRow
              key={rowIndex}
              keys={row}
              row={rowIndex}
              pressedKeys={pressedKeys}
              incorrectKeys={incorrectKeys}
              expectedKey={expectedKey}
            />
          ))}
          <group position={[0, 0, 3.3]}>
            <Key
              position={[2.5, 0, 0]}
              label="Space"
              isPressed={pressedKeys.has(' ')}
              isIncorrect={incorrectKeys.has(' ')}
              isExpected={expectedKey === ' '}
              fingerColor="#4a4a5a"
              width={5}
            />
          </group>
        </group>
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 3}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
});
