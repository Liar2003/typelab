import { FingerMapping, Finger } from '../types';

export const FINGER_MAP: FingerMapping = {
  'q': { finger: 'leftPinky', hand: 'left' },
  'a': { finger: 'leftPinky', hand: 'left' },
  'z': { finger: 'leftPinky', hand: 'left' },
  '1': { finger: 'leftPinky', hand: 'left' },
  '!': { finger: 'leftPinky', hand: 'left' },
  
  'w': { finger: 'leftRing', hand: 'left' },
  's': { finger: 'leftRing', hand: 'left' },
  'x': { finger: 'leftRing', hand: 'left' },
  '2': { finger: 'leftRing', hand: 'left' },
  '@': { finger: 'leftRing', hand: 'left' },
  
  'e': { finger: 'leftMiddle', hand: 'left' },
  'd': { finger: 'leftMiddle', hand: 'left' },
  'c': { finger: 'leftMiddle', hand: 'left' },
  '3': { finger: 'leftMiddle', hand: 'left' },
  '#': { finger: 'leftMiddle', hand: 'left' },
  
  'r': { finger: 'leftIndex', hand: 'left' },
  'f': { finger: 'leftIndex', hand: 'left' },
  'v': { finger: 'leftIndex', hand: 'left' },
  't': { finger: 'leftIndex', hand: 'left' },
  'g': { finger: 'leftIndex', hand: 'left' },
  'b': { finger: 'leftIndex', hand: 'left' },
  '4': { finger: 'leftIndex', hand: 'left' },
  '5': { finger: 'leftIndex', hand: 'left' },
  '$': { finger: 'leftIndex', hand: 'left' },
  '%': { finger: 'leftIndex', hand: 'left' },
  
  'y': { finger: 'rightIndex', hand: 'right' },
  'h': { finger: 'rightIndex', hand: 'right' },
  'n': { finger: 'rightIndex', hand: 'right' },
  'u': { finger: 'rightIndex', hand: 'right' },
  'j': { finger: 'rightIndex', hand: 'right' },
  'm': { finger: 'rightIndex', hand: 'right' },
  '6': { finger: 'rightIndex', hand: 'right' },
  '7': { finger: 'rightIndex', hand: 'right' },
  '^': { finger: 'rightIndex', hand: 'right' },
  '&': { finger: 'rightIndex', hand: 'right' },
  
  'i': { finger: 'rightMiddle', hand: 'right' },
  'k': { finger: 'rightMiddle', hand: 'right' },
  ',': { finger: 'rightMiddle', hand: 'right' },
  '8': { finger: 'rightMiddle', hand: 'right' },
  '*': { finger: 'rightMiddle', hand: 'right' },
  
  'o': { finger: 'rightRing', hand: 'right' },
  'l': { finger: 'rightRing', hand: 'right' },
  '.': { finger: 'rightRing', hand: 'right' },
  '9': { finger: 'rightRing', hand: 'right' },
  '(': { finger: 'rightRing', hand: 'right' },
  
  'p': { finger: 'rightPinky', hand: 'right' },
  ';': { finger: 'rightPinky', hand: 'right' },
  '/': { finger: 'rightPinky', hand: 'right' },
  '0': { finger: 'rightPinky', hand: 'right' },
  ')': { finger: 'rightPinky', hand: 'right' },
  '-': { finger: 'rightPinky', hand: 'right' },
  '=': { finger: 'rightPinky', hand: 'right' },
  '[': { finger: 'rightPinky', hand: 'right' },
  ']': { finger: 'rightPinky', hand: 'right' },
  '\\': { finger: 'rightPinky', hand: 'right' },
  "'": { finger: 'rightPinky', hand: 'right' },
  '`': { finger: 'rightPinky', hand: 'right' },
  
  ' ': { finger: 'leftIndex', hand: 'left' },
};

export function getFingerForKey(key: string): { finger: Finger; hand: 'left' | 'right' } | null {
  return FINGER_MAP[key.toLowerCase()] || null;
}

export function getFingerName(finger: Finger): string {
  const names: Record<Finger, string> = {
    leftPinky: 'Left Pinky',
    leftRing: 'Left Ring',
    leftMiddle: 'Left Middle',
    leftIndex: 'Left Index',
    rightIndex: 'Right Index',
    rightMiddle: 'Right Middle',
    rightRing: 'Right Ring',
    rightPinky: 'Right Pinky',
  };
  return names[finger];
}
