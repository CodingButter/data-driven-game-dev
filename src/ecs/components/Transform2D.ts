import { defineComponent } from "../core/component"

export interface ITransform2D {
  x: number
  y: number
  rotation: number // in degrees
  sx: number
  sy: number
}

export const Transform2D = defineComponent({
  x: 50,
  y: 50,
  rotation: 0,
  sx: 1,
  sy: 1,
} as ITransform2D)

export type Transform2D = ReturnType<(typeof Transform2D)["create"]>
