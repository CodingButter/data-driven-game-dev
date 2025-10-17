export type UpdateFn = (dt: number) => void
export type RenderFn = () => void

export type EngineOpts = {
  stepHz?: number // simulation rate( default 240Hz)
  maxStepsPerBurst?: number // cap updates per tick to avoid spiral
  useWorker?: boolean // future: run sim off-main thread
}

export class Engine {
  private readonly STEP: number
  private readonly MAX_STEPS: number

  private onUpdate: UpdateFn
  private onRender: RenderFn

  private chan: MessageChannel = new MessageChannel()
  private port: MessagePort = this.chan.port2

  private running: boolean = false
  private rafId: number = 0
  private last: number = 0
  private acc: number = 0

  // private worker?: Workder

  constructor(onUpdate: UpdateFn, onRender: RenderFn, opts: EngineOpts = {}) {
    this.onUpdate = onUpdate
    this.onRender = onRender
    this.STEP = 1 / (opts.stepHz ?? 240)
    this.MAX_STEPS = opts.maxStepsPerBurst ?? 120
    this.chan.port1.onmessage = () => {
      this.tickUpdate()
    }

    this.chan.port1.start?.()
    this.chan.port2.start?.()

    // if( opts.useWorkder) this.bootWorker() / future: swap strategy
  }

  public start() {
    if (this.running) return
    this.running = true
    this.last = performance.now() / 1000
    this.acc = 0
    this.scheduleUpdate()
    this.scheduleRender()
  }

  public stop() {
    if (!this.running) return
    this.running = false
    cancelAnimationFrame(this.rafId)
  }

  private scheduleUpdate(): void {
    this.port.postMessage(0)
  }

  private tickUpdate(): void {
    if (!this.running) return
    const now = performance.now() / 1000
    let dt = Math.min(now - this.last, 0.25) // avoid big dt after tab switch
    this.last = now
    this.acc += dt
    let steps = 0
    while (this.acc >= this.STEP && steps < this.MAX_STEPS) {
      this.onUpdate(this.STEP)
      this.acc -= this.STEP
      steps++
    }
    // immediately queue next update burst
    this.scheduleUpdate()
  }

  /** Vsynced render using requestAnimationFrame     */
  private scheduleRender(): void {
    this.rafId = requestAnimationFrame(() => this.tickRender())
  }

  private tickRender(): void {
    if (!this.running) return
    this.onRender()
    this.scheduleRender()
  }

  /** Optional: update handlers at runtime */
  public setUpdate(fn: UpdateFn): void {
    this.onUpdate = fn
  }
  public setRender(fn: RenderFn): void {
    this.onRender = fn
  }

  get step(): number {
    return this.STEP
  }

  // --- Worker strategy (future) ---
  // private bootWorker() {....} // spin worker, exchange snapshots via postMessage
}
