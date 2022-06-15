export function lerp(v: number, min: number, max: number) {
  if (v < 0) return min;
  if (v > 1) return max;
  return v * (max - min) + min;
}
