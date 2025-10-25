import { makeCanvasRenderer } from "@/core/renderer/renderer"
import { Engine, type UpdateFn, type RenderFn } from "@/core/engine"
import { SceneManager } from "@/core/scenemanager"
import { GameScene } from "@/game/scenes/GameScene"
import { registerComponents } from "@/game/components/registry"
import { loadAndRegisterAssets } from "./game/assets/loader"

registerComponents()

const WIDTH = 500
const HEIGHT = 400
const canvas = document.createElement("canvas")
document.body.appendChild(canvas)

const dpr = Math.max(1, window.devicePixelRatio || 1)
canvas.style.width = WIDTH + "px"
canvas.style.height = HEIGHT + "px"
canvas.width = Math.round(WIDTH * dpr)
canvas.height = Math.round(HEIGHT * dpr)
const renderer = makeCanvasRenderer(canvas, { cameraMode: "topleft" })

;(async () => {
  await loadAndRegisterAssets("/assets/Assets.json")
  const sceneManager = new SceneManager(renderer)
  const gameScene = new GameScene(sceneManager)
  sceneManager.start(gameScene)

  const onRender: RenderFn = () => {
    sceneManager.render()
  }

  const onUpdate: UpdateFn = (dt: number) => {
    sceneManager.update(dt)
  }

  const engine = new Engine(onUpdate, onRender, { stepHz: 240 })
  engine.start()
})()
