import { defineComponent } from "../core/component"

export const Locomotion = defineComponent({
  maxSpeed: 200 as number, // px/s
  accel: 1400 as number, // px/s² when moving towared desired
  decel: 1800 as number, // px/s² when moving away from desired
  drag: 0, // s^-1 gentle bleed (0 = none, 1 = stop in 1s)
})

export type Locomotion = ReturnType<(typeof Locomotion)["create"]>
