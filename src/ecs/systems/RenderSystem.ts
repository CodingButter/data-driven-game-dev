import type { System } from "../core/system"
import type { World } from "../core/world"
import { Transform2D } from "../components/Transform2D"
import { Sprite } from "../components/Sprite"
import { FrameRate } from "../components/FrameRate"
import type { Renderer, Color } from "@/renderer/renderer"

export function RenderSystem(renderer: Renderer, color: Color = "#1f2937"): System {
  // Create Canvas and set size

  const renderSystem: System = {
    update: (world: World) => {
      renderer.clear(color)

      for (const e of world.query(FrameRate)) {
        const fr = FrameRate.get(e)!
        renderer.text(`FPS: ${fr.fps.toFixed(1)}`, 10, 10, {
          color: "#51c007ff",
          size: 24,
          align: "left",
          baseline: "top",
        })
      }

      for (const e of world.query(Transform2D, Sprite)) {
        const t = Transform2D.get(e)!
        const s = Sprite.get(e)!

        renderer.rect(t.x, t.y, s.w, s.h, s.color, {
          anchor: s.anchor || [0, 0],
          rotation: (t.rotation || 0) * (Math.PI / 180),
        })
      }
    },
  }
  return renderSystem
}
