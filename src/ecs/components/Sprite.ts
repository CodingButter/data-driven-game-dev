import { defineComponent } from "@/ecs/core/component"

interface ISprite {
  w: number // in cells
  h: number // in cells
  anchor: [number, number] // 0~1
  rotation?: number // in degrees
  spriteSheetId?: string
  spritePosition?: [number, number] // x,y tile position in spritesheet
}

export const Sprite = defineComponent({
  w: 1,
  h: 1,
  anchor: [0.5, 0.5],
  spritePosition: [0, 0],
} as ISprite)

export type Sprite = ReturnType<(typeof Sprite)["create"]>
