import type { Renderer } from "@/core/renderer/renderer"

export interface Scene {
  overlay?: boolean
  sceneManager?: SceneManager
  onEnter(): void
  onExit(): void
  update(delta: number): void
  render(): void
}

export class SceneManager {
  private stack: Scene[] = []
  public renderer: Renderer
  constructor(renderer: Renderer) {
    this.renderer = renderer
  }

  start(initialScene: Scene) {
    this.push(initialScene)
  }

  push(scene: Scene) {
    if (!scene.overlay && this.stack.length > 0) {
      this.pop()
    }
    this.stack.push(scene)
    scene.onEnter()
  }

  pop() {
    if (this.stack.length === 0) return
    const scene = this.stack.pop()
    scene && scene.onExit()
  }

  update(delta: number) {
    if (this.stack.length === 0) return
    const currentScene = this.stack[this.stack.length - 1]
    currentScene && currentScene.update(delta)
  }

  render() {
    if (this.stack.length === 0) return
    this.stack.forEach((scene) => scene.render())
  }
}
