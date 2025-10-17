import { defineComponent } from "../core/component"

export interface IFrameRate {
  dts: number[]
  fps: number
}
export const FrameRate = defineComponent({
  dts: [] as number[],
  average: 0,
  fps: 0,
} as IFrameRate)

export type FrameRate = ReturnType<(typeof FrameRate)["create"]>
