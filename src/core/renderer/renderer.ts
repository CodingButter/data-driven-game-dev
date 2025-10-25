import type { Transform2D } from "@/ecs/components"
import type { Sprite } from "@/ecs/components/Sprite"
import type { SpriteSheet } from "@/ecs/core/types"

export type Camera2D = {
  x: number // world (CSS) units
  y: number // world (CSS) units
  zoom: number // 1 = 100%
}

export type Color = string // rgb rgba hex hsl hsla

export interface Renderer {
  readonly width: number
  readonly height: number
  setCamera(camera: Partial<Camera2D>): void
  getCamera(): Camera2D
  resize(width: number, height: number): void
  clear(color?: Color): void
  rect(
    x: number,
    y: number,
    w: number,
    h: number,
    color: Color,
    options?: {
      rotation?: number
      anchor?: [number, number] // 0-1, 0.5 = center
      alpha?: number
    }
  ): void
  image(
    image: HTMLImageElement | HTMLCanvasElement,
    x: number,
    y: number,
    w: number,
    h: number,
    options?: {
      sx: number
      sy: number
      sw: number
      sh: number
      rotation?: number
      anchor?: [number, number] // 0-1, 0.5 = center
      alpha?: number
      smoothing?: boolean // default true
    }
  ): void
  sprite(sprite: Sprite, spriteSheet: SpriteSheet, transform: Transform2D): void
  text(
    str: string,
    x: number,
    y: number,
    options?: {
      color?: Color
      size?: number // pixels
      font?: string
      align?: CanvasTextAlign
      baseline?: CanvasTextBaseline
      alpha?: number
      rotation?: number
      anchor?: [number, number] // 0-1, 0.5 = center
    }
  ): void
  getNative(): CanvasRenderingContext2D // access to the underlying rendering context
}

export function makeCanvasRenderer(
  canvas: HTMLCanvasElement,
  options?: {
    width?: number
    height?: number
    defaultFont?: string
    imageSmoothing?: boolean
    cameraMode?: "topleft" | "center"
  }
): Renderer {
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
  let _width = options?.width ?? canvas.width
  let _height = options?.height ?? canvas.height
  const cameraMode = options?.cameraMode ?? "topleft"
  const state: Camera2D = { x: 0, y: 0, zoom: 1 }

  ctx.imageSmoothingEnabled = options?.imageSmoothing ?? true
  const defaultFont = options?.defaultFont ?? "14px monospace"

  function applyCamera() {
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    if (cameraMode === "topleft") {
      ctx.setTransform(state.zoom, 0, 0, state.zoom, -state.x * state.zoom, -state.y * state.zoom)
    } else {
      const ox = _width * 0.5
      const oy = _height * 0.5
      ctx.setTransform(
        state.zoom,
        0,
        0,
        state.zoom,
        ox - state.x * state.zoom,
        oy - state.y * state.zoom
      )
    }
  }

  function clearAll(color?: Color) {
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    if (!color) ctx.clearRect(0, 0, _width, _height)
    else {
      ctx.fillStyle = color
      ctx.fillRect(0, 0, _width, _height)
    }
    ctx.restore()
    applyCamera()
  }

  applyCamera()

  const api: Renderer = {
    get width() {
      return _width
    },
    get height() {
      return _height
    },
    setCamera(partial) {
      if (partial.x !== undefined) state.x = partial.x
      if (partial.y !== undefined) state.y = partial.y
      if (partial.zoom !== undefined) state.zoom = partial.zoom
      applyCamera()
    },
    getCamera() {
      return { ...state }
    },
    resize(width, height) {
      _width = width
      _height = height
      canvas.width = width
      canvas.height = height
      applyCamera()
    },
    clear(color) {
      clearAll(color)
    },
    rect(x, y, w, h, color, options) {
      ctx.save()
      if (options?.alpha !== undefined && options?.alpha !== 1) ctx.globalAlpha = options.alpha
      ctx.fillStyle = color
      if (options?.anchor) {
        x -= w * options.anchor[0]
        y -= h * options.anchor[1]
      }
      if (options?.rotation) {
        ctx.translate(x + w / 2, y + h / 2)
        ctx.rotate(options.rotation)
        ctx.translate(-w / 2, -h / 2)
        ctx.fillRect(0, 0, w, h)
      } else {
        ctx.fillRect(x, y, w, h)
      }
      ctx.restore()
    },
    image(image, x, y, w, h, options) {
      ctx.save()
      if (options?.alpha !== undefined && options?.alpha !== 1) ctx.globalAlpha = options.alpha
      if (options?.smoothing === false) ctx.imageSmoothingEnabled = false
      if (options?.anchor) {
        x -= w * options.anchor[0]
        y -= h * options.anchor[1]
      }
      if (options?.rotation) {
        ctx.translate(x + w / 2, y + h / 2)
        ctx.rotate(options.rotation)
        ctx.translate(-w / 2, -h / 2)
      }
      if (options?.sx !== undefined) {
        ctx.drawImage(image, options.sx, options.sy, options.sw, options.sh, x, y, w, h)
      } else {
        ctx.drawImage(image, x, y, w, h)
      }
      ctx.restore()
    },
    sprite(sprite: Sprite, spriteSheet: SpriteSheet, transform: Transform2D): void {
      const {
        source,
        tile_width,
        tile_height,
        marginX = 0,
        marginY = 0,
        spacingX = 0,
        spacingY = 0,
      } = spriteSheet
      const { x: tx, y: ty, rotation, scaleX, scaleY, sx, sy } = transform
      const { w: sw, h: sh, anchor, spritePosition } = sprite
      const [tileX, tileY] = spritePosition as [number, number]

      const ix = marginX + tileX * (tile_width + spacingX)
      const iy = marginY + tileY * (tile_height + spacingY)

      ctx.save()
      ctx.translate(tx, ty)
      rotation && ctx.rotate(rotation)
      scaleX && scaleY && ctx.scale(scaleX, scaleY)
      ctx.drawImage(
        source,
        ix,
        iy,
        tile_width,
        tile_height,
        -anchor[0] * sw,
        -anchor[1] * sh,
        tile_width,
        tile_height
      )
      ctx.restore()
    },
    text(str, x, y, options) {
      ctx.save()
      if (options?.alpha !== undefined && options?.alpha !== 1) ctx.globalAlpha = options.alpha
      ctx.fillStyle = options?.color ?? "black"
      ctx.font = (options?.size ? options.size + "px " : "") + (options?.font ?? defaultFont)
      ctx.textAlign = options?.align ?? "left"
      ctx.textBaseline = options?.baseline ?? "alphabetic"
      if (options?.anchor) {
        const metrics = ctx.measureText(str)
        const textWidth = metrics.width
        const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
        x -= textWidth * options.anchor[0]
        y -= textHeight * options.anchor[1]
      }
      if (options?.rotation) {
        ctx.translate(x, y)
        ctx.rotate(options.rotation)
        ctx.fillText(str, 0, 0)
      } else {
        ctx.fillText(str, x, y)
      }
      ctx.restore()
    },
    getNative() {
      return ctx
    },
  }
  return api
}
