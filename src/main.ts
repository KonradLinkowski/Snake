import { canChangeDirection, directions } from './direction';
import { lerp } from './math';
import './style.css';
import { Apple, Direction, SnakePart } from './types';

const scoreElement = document.querySelector<HTMLSpanElement>('#score')!;
const canvas = document.querySelector<HTMLCanvasElement>('#game')!;
const smaller = Math.min(innerWidth, innerHeight);
canvas.width = smaller;
canvas.height = smaller;
const ctx = canvas.getContext('2d')!;
const size = 20;
const tileSize = smaller / size;
let score = 0;
addScore(0);

const apples: Apple[] = [];
spawnApple();

let direction: Direction = {
  x: 1,
  y: 0,
};

let nextDirection: Direction | undefined = undefined;

const head: SnakePart = {
  next: undefined,
  previous: undefined,
  x: 5 + direction.x,
  y: 5 + direction.y,
  cx: 5,
  cy: 5,
  sx: 5,
  sy: 5,
};

let tail: SnakePart = head;

for (let i = 0; i < 5; i += 1) {
  addPart({
    x: -1,
    y: 0,
  });
}

addEventListener('keydown', ({ code }) => {
  switch (code) {
    case 'KeyW':
    case 'ArrowUp':
      if (canChangeDirection(direction, directions['up'])) {
        nextDirection = directions['up'];
      }
      break;
    case 'KeyS':
    case 'ArrowDown':
      if (canChangeDirection(direction, directions['down'])) {
        nextDirection = directions['down'];
      }
      break;
    case 'KeyA':
    case 'ArrowLeft':
      if (canChangeDirection(direction, directions['left'])) {
        nextDirection = directions['left'];
      }
      break;
    case 'KeyD':
    case 'ArrowRight':
      if (canChangeDirection(direction, directions['right'])) {
        nextDirection = directions['right'];
      }
      break;
  }
});

let lastTime = 0;
const interval = 100;
let intervalTimer = 0;
let gameOver = false;

requestAnimationFrame(loop);

function loop(time: number) {
  if (gameOver) {
    return;
  }
  const dt = time - lastTime;
  lastTime = time;
  intervalTimer += dt;
  if (intervalTimer > interval) {
    intervalTimer -= interval;
    move();
  }
  if (isSelfColliding() || isWallColliding()) {
    gameOver = true;
  }
  tryToEatApple();
  interpolate();
  render();
  requestAnimationFrame(loop);
}

function interpolate() {
  let current = head;
  while (true) {
    current.cx = lerp(intervalTimer / interval, current.sx, current.x);
    current.cy = lerp(intervalTimer / interval, current.sy, current.y);
    if (!current.next) break;
    current = current.next;
  }
}

function isSelfColliding() {
  let current = head.next!;
  while (true) {
    if (current.x === head.x && current.y === head.y) {
      return true;
    }
    if (!current.next) break;
    current = current.next;
  }
  return false;
}

function isWallColliding() {
  return head.x < 0 || head.y < 0 || head.x >= size || head.y >= size;
}

function tryToEatApple() {
  const eatenIndex = apples.findIndex(
    (apple) => apple.x === head.sx && apple.y === head.sy
  );
  if (eatenIndex !== -1) {
    apples.splice(eatenIndex, 1);
    spawnApple();
    addPart();
    addScore();
  }
}

function move() {
  if (nextDirection) {
    direction = nextDirection;
    nextDirection = undefined;
  }
  let current = tail;
  while (current.previous) {
    const tempX = current.x;
    const tempY = current.y;
    current.x = current.previous.x;
    current.y = current.previous.y;
    current.sx = tempX;
    current.sy = tempY;
    current = current.previous;
  }
  const tempX = head.x;
  const tempY = head.y;
  head.x += direction.x;
  head.y += direction.y;
  head.sx = tempX;
  head.sy = tempY;
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < 100; y += 1) {
    for (let x = 0; x < 100; x += 1) {
      ctx.fillStyle = (x + y) % 2 == 0 ? 'lightgreen' : 'green';
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }

  for (const apple of apples) {
    ctx.fillStyle = 'red';
    const radius = (tileSize * 4) / 7;
    ctx.beginPath();
    ctx.arc(
      apple.x * tileSize + tileSize / 2,
      apple.y * tileSize + tileSize / 2,
      radius,
      0,
      Math.PI * 2
    );
    ctx.closePath();
    ctx.fill();
  }

  let current = tail;
  while (current.previous) {
    ctx.fillStyle = 'pink';
    const radius = (tileSize * 4) / 7;
    ctx.beginPath();
    ctx.arc(
      current.cx * tileSize + tileSize / 2,
      current.cy * tileSize + tileSize / 2,
      radius,
      0,
      Math.PI * 2
    );
    ctx.closePath();
    ctx.fill();
    current = current.previous;
  }
  ctx.fillStyle = 'magenta';
  const radius = (tileSize * 5) / 7;
  ctx.beginPath();
  ctx.arc(
    head.cx * tileSize + tileSize / 2,
    head.cy * tileSize + tileSize / 2,
    radius,
    0,
    Math.PI * 2
  );
  ctx.closePath();
  ctx.fill();
}

function addPart(offset = { x: 0, y: 0 }) {
  const g: SnakePart = {
    x: tail.x + offset.x,
    y: tail.y + offset.y,
    cx: tail.x + offset.x,
    cy: tail.y + offset.y,
    sx: tail.x + offset.x,
    sy: tail.y + offset.y,
  };
  tail.next = g;
  g.previous = tail;
  tail = g;
}

function spawnApple() {
  const x = Math.floor(Math.random() * size);
  const y = Math.floor(Math.random() * size);

  apples.push({
    x,
    y,
  });
}

function addScore(value = 1) {
  score += value;
  scoreElement.textContent = score.toString().padStart(3, '0');
}
