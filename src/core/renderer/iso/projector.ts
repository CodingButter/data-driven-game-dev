export const TILE_W: number = 50
export const TILE_H: number = 25

/**
 * Convert isometric coordinates to screen coordinates.
 * @param ix The isometric x-coordinate.
 * @param iy The isometric y-coordinate.
 * @returns The screen coordinates.
 * Notes: Assumes TILE_W and TILE_H are defined globally.
 */
export function isoToScreen(ix: number, iy: number): { x: number; y: number } {
  const x = (ix - iy) * (TILE_W / 2)
  const y = (ix + iy) * (TILE_H / 2)
  return { x, y }
}

/**
 * Convert screen coordinates to isometric coordinates.
 * @param sx The screen x-coordinate.
 * @param sy The screen y-coordinate.
 * @returns The isometric coordinates.
 * Notes: Assumes TILE_W and TILE_H are defined globally.
 */
export function screenToIso(sx: number, sy: number): { ix: number; iy: number } {
  const ix = (sx / (TILE_W / 2) + sy / (TILE_H / 2)) / 2
  const iy = (sy / (TILE_H / 2) - sx / (TILE_W / 2)) / 2
  return { ix, iy }
}
