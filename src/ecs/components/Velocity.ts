import { defineComponent } from "../core/component"

export const Velocity = defineComponent({
  vx: 0,
  vy: 0,
  vr: 0,
})

export type Velocity = ReturnType<(typeof Velocity)["create"]>
