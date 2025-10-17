import { defineComponent } from "../core/component"
import type { Color } from "@/renderer/renderer"

interface ISprite {
  w: number
  h: number
  color: Color
  anchor: [number, number] // 0~1
  rotation?: number // in degrees
}

export const Sprite = defineComponent({
  w: 64,
  h: 64,
  color: "#22c55e",
  anchor: [0.5, 0.5],
} as ISprite)

export type Sprite = ReturnType<(typeof Sprite)["create"]>
