import type { Scene, SceneManager } from "@/core/scenemanager"
import { Input } from "@/core/input/Input"

type MenuItem = {
  label: string
  action: () => void
}

export class PauseScene implements Scene {
  public overlay: boolean = true
  public sceneManager: SceneManager
  selectedIndex: number = 0
  menuItems: MenuItem[] = [
    {
      label: "Resume Game",
      action: () => {
        this.sceneManager.pop()
      },
    },
    {
      label: "Quit to Main Menu",
      action: () => {
        // Pop PauseScene
        this.sceneManager.pop()
        // Pop GameScene
        this.sceneManager.pop()
      },
    },
  ]
  constructor(sceneManager: SceneManager) {
    this.sceneManager = sceneManager
  }

  onEnter(): void {}

  onExit(): void {}

  update(_: number): void {
    if (Input.wasPressed("Escape")) {
      this.sceneManager.pop()
    }
    if (Input.wasPressed("ArrowUp")) {
      this.selectedIndex = (this.selectedIndex - 1 + this.menuItems.length) % this.menuItems.length
    }
    if (Input.wasPressed("ArrowDown")) {
      this.selectedIndex = (this.selectedIndex + 1) % this.menuItems.length
    }
    if (Input.wasPressed("Enter")) {
      const menuItem = this.menuItems[this.selectedIndex]
      menuItem && menuItem.action()
    }
    Input.endTick()
  }

  render(): void {
    const renderer = this.sceneManager.renderer
    renderer.rect(0, 0, renderer.width, renderer.height, "rgba(0,0,0,0.5)")
    const menuX = renderer.width / 2
    const menuY = renderer.height / 2 - (this.menuItems.length * 30) / 2
    this.menuItems.forEach((item, index) => {
      const color = index === this.selectedIndex ? "yellow" : "white"
      renderer.text(item.label, menuX, menuY + index * 30, {
        color,
        size: 24,
        font: "Arial",
        align: "center",
        baseline: "middle",
      })
    })
  }
}
