import { defineComponent } from "../core/component"

export const DesiredMove = defineComponent({
  dx: 0 as number,
  dy: 0 as number,
})

export type DesiredMove = ReturnType<(typeof DesiredMove)["create"]>
