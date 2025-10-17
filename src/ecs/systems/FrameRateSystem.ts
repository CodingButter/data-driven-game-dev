import type { System } from "../core/system"
import type { World } from "../core/world"
import { FrameRate, type IFrameRate } from "../components/FrameRate"

export const FrameRateSystem: System = {
  update: (world: World, dt: number) => {
    for (const e of world.query(FrameRate)) {
      const fr = FrameRate.get(e) as IFrameRate
      fr.fps = 1 / dt
    }
  },
}
