export type Entity = number
export interface SpriteSheet {
  id: string
  url: string
  source: HTMLImageElement | HTMLCanvasElement
  tile_width: number
  tile_height: number
  marginX?: number
  marginY?: number
  spacingX?: number
  spacingY?: number
}
