import type { System } from "../core/system"
import type { World } from "../core/world"
import { Transform2D } from "../components/Transform2D"
import { Velocity } from "../components/Velocity"

export const MovementSystem: System = {
  update(world: World, dt: number) {
    for (const e of world.query(Transform2D, Velocity)) {
      const t = Transform2D.get(e)!
      const v = Velocity.get(e)!
      t.x += v.vx * dt
      t.y += v.vy * dt
      t.rotation += v.vr * dt
    }
  },
}
