export interface Direction {
  x: number;
  y: number;
}

export interface SnakePart {
  x: number;
  y: number;
  cx: number;
  cy: number;
  sx: number;
  sy: number;
  previous?: SnakePart;
  next?: SnakePart;
}

export interface Apple {
  x: number;
  y: number;
}
