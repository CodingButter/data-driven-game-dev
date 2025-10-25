import type { System } from "../../ecs/core/system"
import type { World } from "../../ecs/core/world"
import { Transform2D } from "../../ecs/components/Transform2D"
import { Sprite } from "../../ecs/components/Sprite"
import type { Renderer, Color } from "@/core/renderer/renderer"
import { getSpriteSheet } from "../assets/loader"
export function RenderSystem(renderer: Renderer, color: Color = "#1f2937"): System {
  // Create Canvas and set size

  const renderSystem: System = {
    update: (world: World) => {
      renderer.clear(color)

      for (const e of world.query(Transform2D, Sprite)) {
        const t = Transform2D.get(e)!
        const s = Sprite.get(e)!
        const ss = getSpriteSheet(s.spriteSheetId as string)
        if (!ss) continue
        renderer.sprite(s, ss, t)
      }
    },
  }
  return renderSystem
}
