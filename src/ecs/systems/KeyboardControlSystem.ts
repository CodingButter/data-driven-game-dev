import type { System } from "../core/system"
import type { World } from "../core/world"
import { Controller } from "../components/Controller"
import { DesiredMove } from "../components/DesiredMove"
import type { KeyCode } from "@/core/input/KeyCode"
import { Input } from "@/core/input/Input"

function anyDown(keys: readonly KeyCode[]): boolean {
  for (const k of keys) if (Input.isDown(k)) return true
  return false
}

export const KeyboardControlSystem: System = {
  update(world: World): void {
    for (const e of world.query(Controller, DesiredMove)) {
      const c = Controller.get(e)!
      const d = DesiredMove.get(e)!

      let x = 0,
        y = 0
      if (anyDown(c.right)) x += 1
      if (anyDown(c.left)) x -= 1
      if (anyDown(c.up)) y -= 1
      if (anyDown(c.down)) y += 1

      if (x !== 0 || y !== 0) {
        const m = Math.hypot(x, y)
        x /= m
        y /= m
      }

      d.dx = x
      d.dy = y
    }
  },
}
