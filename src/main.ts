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

const WIDTH = 600
const HEIGHT = 400
const canvas = document.createElement("canvas")
document.body.appendChild(canvas)

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
const e = world.create()
world.add(Transform2D, e, Transform2D.create({ x: 100, y: 50 }))
world.add(Velocity, e, Velocity.create({ vx: 0, vy: 0, vr: 0 }))
world.add(Sprite, e, Sprite.create({ w: 64, h: 64, color: "#22c55e" }))
world.add(
  Controller,
  e,
  Controller.create({
    up: ["ArrowUp", "KeyW"],
    down: ["ArrowDown", "KeyS"],
    left: ["ArrowLeft", "KeyA"],
    right: ["ArrowRight", "KeyD"],
  })
)
world.add(DesiredMove, e, DesiredMove.create())
world.add(Locomotion, e, Locomotion.create())

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
