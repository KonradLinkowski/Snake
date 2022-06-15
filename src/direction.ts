import { Direction } from './types';

export const directions = {
  up: {
    x: 0,
    y: -1,
  },
  down: {
    x: 0,
    y: 1,
  },
  left: {
    x: -1,
    y: 0,
  },
  right: {
    x: 1,
    y: 0,
  },
};

export function canChangeDirection(current: Direction, desired: Direction) {
  if (current.x === desired.x && current.y === desired.y) return false;
  if (current.x === -desired.x && current.y === desired.y) return false;
  if (current.x === desired.x && current.y === -desired.y) return false;
  return true;
}
