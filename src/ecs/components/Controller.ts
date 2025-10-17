import { defineComponent } from "../core/component"
import type { KeyCode } from "@/core/input/KeyCode"

export const Controller = defineComponent({
  left: [] as KeyCode[],
  right: [] as KeyCode[],
  up: [] as KeyCode[],
  down: [] as KeyCode[],
})

export type Controller = ReturnType<(typeof Controller)["create"]>
