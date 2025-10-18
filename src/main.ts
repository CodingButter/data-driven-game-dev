import { World } from "@/ecs/core/world"
import { runSystems } from "@/ecs/core/system"
import { Transform2D } from "@/ecs/components/Transform2D"
import { Velocity } from "@/ecs/components/Velocity"
import { Sprite } from "@/ecs/components/Sprite"
import { FrameRate } from "@/ecs/components/FrameRate"
import { DesiredMove } from "@/ecs/components/DesiredMove"
import { Controller } from "@/ecs/components/Controller"
import { Locomotion } from "@/ecs/components/Locomotion"

import { RenderSystem } from "@/ecs/systems/RenderSystem"
import { MovementSystem } from "@/ecs/systems/MovementSystem"
import { WallBounceSystem } from "./ecs/systems/WallBounceSystem"
import { FrameRateSystem } from "@/ecs/systems/FrameRateSystem"
import { KeyboardControlSystem } from "@/ecs/systems/KeyboardControlSystem"
import { SteeringSystem } from "./ecs/systems/SteeringSystem"
import { Engine, type UpdateFn, type RenderFn } from "@/core/engine"
import { loadPrefabs } from "@/game/prefabs/loader"
import { registerComponent } from "@/game/components/registry"
import { spawnPrefab } from "@/game/prefabs/spawner"

const WIDTH = 600
const HEIGHT = 400
const canvas = document.createElement("canvas")
document.body.appendChild(canvas)
;(async () => {
  registerComponent()
  await loadPrefabs()
  // Create our World and register our Systems
  const world = new World()
  const renderSystems = [RenderSystem(canvas, WIDTH, HEIGHT), FrameRateSystem]
  const updateSystems = [
    MovementSystem,
    WallBounceSystem(canvas),
    FrameRateSystem,
    KeyboardControlSystem,
    SteeringSystem,
  ]

  //  Createe on entity: Transform + Velocity + Sprite
  spawnPrefab(world, "Player")
  spawnPrefab(world, "Enemy")
  // create frame rate entity
  const fr = world.create()
  world.add(FrameRate, fr, FrameRate.create())

  const onRender = () => {
    runSystems(world, renderSystems)
  }

  const onUpdate = (dt: number) => {
    runSystems(world, updateSystems, dt)
  }

  const engine = new Engine(onUpdate, onRender, { stepHz: 240 })
  engine.start()
})()
