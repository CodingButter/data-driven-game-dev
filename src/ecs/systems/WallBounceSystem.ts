import type { System } from "../core/system"
import type { World } from "../core/world"
import { Transform2D } from "../components/Transform2D"
import { Velocity } from "../components/Velocity"
import { Sprite } from "../components/Sprite"

export function WallBounceSystem(canvas: HTMLCanvasElement): System {
  const wallBounceSystem: System = {
    update(world: World, dt: number) {
      for (const e of world.query(Transform2D, Velocity, Sprite)) {
        const t = Transform2D.get(e)!
        const v = Velocity.get(e)!
        const s = Sprite.get(e)!
        const [ax, ay] = s.anchor ?? [0, 0]
        // find offsets based on anchor
        const offsetX = s.w * ax
        const offsetY = s.h * ay

        //test lef and right walls
        if (t.x - offsetX < 0 || t.x + s.w - offsetX > canvas.width) {
          v.vx = -v.vx
          v.vr = -v.vr
          //clamp position inside walls
          t.x = Math.max(t.x, 0 + offsetX)
          t.x = Math.min(t.x, canvas.width - s.w + offsetX)
        }
        //test top and bottom walls
        if (t.y - offsetY < 0 || t.y + s.h - offsetY > canvas.height) {
          v.vy = -v.vy
          v.vr = -v.vr
          //clamp position inside walls
          t.y = Math.max(t.y, 0 + offsetY)
          t.y = Math.min(t.y, canvas.height - s.h + offsetY)
        }
      }
    },
  }

  return wallBounceSystem
}
