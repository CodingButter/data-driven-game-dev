import { defineComponent } from "../core/component"

export interface ITransform2D {
  x: number
  y: number
  rotation: number // in degrees
  sx: number
  sy: number
  scaleX?: number // alias for sx
  scaleY?: number // alias for sy
}

export const Transform2D = defineComponent({
  x: 50,
  y: 50,
  rotation: 0,
  sx: 1,
  sy: 1,
  scaleX: 1,
  scaleY: 1,
} as ITransform2D)

export type Transform2D = ReturnType<(typeof Transform2D)["create"]>
