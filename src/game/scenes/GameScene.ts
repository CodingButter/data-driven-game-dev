import { World } from "@/ecs/core/world"
import { runSystems, type System } from "@/ecs/core/system"
import { FrameRate } from "@/ecs/components/FrameRate"
import { RenderSystem } from "@/ecs/systems/RenderSystem"
import { MovementSystem } from "@/ecs/systems/MovementSystem"
import { WallBounceSystem } from "@/ecs/systems/WallBounceSystem"
import { FrameRateSystem } from "@/ecs/systems/FrameRateSystem"
import { KeyboardControlSystem } from "@/ecs/systems/KeyboardControlSystem"
import { SteeringSystem } from "@/ecs/systems/SteeringSystem"
import { spawnPrefab } from "@/game/prefabs/spawner"
import type { Scene, SceneManager } from "@/core/scenemanager"
import { PauseScene } from "@/game/scenes/PauseScene"
import { Input } from "@/core/input/Input"

export class GameScene implements Scene {
  private world: World = new World()
  public overlay: boolean = false
  public sceneManager: SceneManager
  private renderSystems: System[] = []
  private updateSystems: System[] = []

  constructor(sceneManager: SceneManager) {
    this.sceneManager = sceneManager
  }

  onEnter(): void {
    this.world = new World()
    this.renderSystems = [RenderSystem(this.sceneManager.renderer), FrameRateSystem]
    this.updateSystems = [
      MovementSystem,
      WallBounceSystem(this.sceneManager.renderer.width, this.sceneManager.renderer.height),
      FrameRateSystem,
      KeyboardControlSystem,
      SteeringSystem,
    ]

    //  Createe on entity: Transform + Velocity + Sprite
    spawnPrefab(this.world, "Player")
    spawnPrefab(this.world, "Enemy")
    // create frame rate entity
    const fr = this.world.create()
    this.world.add(FrameRate, fr, FrameRate.create())
  }

  onExit(): void {}

  update(delta: number): void {
    if (Input.wasPressed("Escape")) {
      this.sceneManager.push(new PauseScene(this.sceneManager))
    }
    runSystems(this.world, this.updateSystems, delta)
    Input.endTick()
  }

  render(): void {
    runSystems(this.world, this.renderSystems)
  }
}
