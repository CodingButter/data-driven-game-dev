import type { Renderer } from "@/core/renderer/renderer"

export interface Scene {
  overlay?: boolean
  sceneManager?: SceneManager
  onEnter(): void
  onExit(): void
  update(dt: number): void
  render(): void
}

export class SceneManager {
  private stack: Scene[] = []
  public renderer: Renderer
  constructor(renderer: Renderer) {
    this.renderer = renderer
  }

  start(initialSate: Scene): void {
    this.push(initialSate)
  }

  push(scene: Scene): void {
    if (!scene.overlay && this.stack.length > 0) {
      this.pop()
    }
    this.stack.push(scene)
    scene.onEnter()
  }

  pop(): void {
    if (this.stack.length === 0) {
      return
    }
    const scene = this.stack.pop()!
    scene.onExit()
  }

  update(dt: number): void {
    if (this.stack.length === 0) {
      return
    }
    const scene = this.stack[this.stack.length - 1]
    scene && scene.update(dt)
  }

  render(): void {
    if (this.stack.length === 0) {
      return
    }
    this.stack.forEach((scene) => scene.render())
  }
}
