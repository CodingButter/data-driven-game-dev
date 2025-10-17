import type { World } from "./world"

export interface System {
  update(world: World, dt: number): void
}

export function runSystems(world: World, systems: System[], dt: number = 0) {
  for (const s of systems) s.update(world, dt)
}
