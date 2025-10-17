import type { System } from "../core/system"
import { World } from "../core/world"
import { DesiredMove } from "../components/DesiredMove"
import { Locomotion } from "../components/Locomotion"
import { Velocity } from "../components/Velocity"

export const SteeringSystem: System = {
  update(world: World, dt: number): void {
    const EPS = 0.0001 // treat vary small numbers as zero to avoid jitter

    for (const e of world.query(DesiredMove, Locomotion, Velocity)) {
      const wish = DesiredMove.get(e)!
      const loco = Locomotion.get(e)!
      const vel = Velocity.get(e)!

      // 1) Target velocity from desired direction
      const tx = wish.dx * loco.maxSpeed
      const ty = wish.dy * loco.maxSpeed

      // 2) Delta toward target
      const dvx = tx - vel.vx
      const dvy = ty - vel.vy

      // 3) Choose accel vs decel based on whether we're moving toward target
      const dot = dvx * vel.vx + dvy * vel.vy
      const rate = dot >= 0 ? loco.accel : loco.decel
      const maxStep = rate * dt

      // 4) Apply a bounded change toward target this tick
      const magDelta = Math.hypot(dvx, dvy)
      if (magDelta > EPS) {
        const s = Math.min(1, maxStep / magDelta)
        vel.vx += dvx * s
        vel.vy += dvy * s
      }

      // 5) Option drag bleed
      if (loco.drag > 0) {
        const k = Math.max(0, 1 - loco.drag * dt)
        vel.vx *= k
        vel.vy *= k
      }

      // 6) Clam max speed
      const speed = Math.hypot(vel.vx, vel.vy)
      if (speed > loco.maxSpeed) {
        const s = loco.maxSpeed / speed
        vel.vx *= s
        vel.vy *= s
      }

      // 7) Deadzon to prevent micro drift
      if (Math.abs(vel.vx) < EPS) vel.vx = 0
      if (Math.abs(vel.vy) < EPS) vel.vy = 0
    }
  },
}
