import { KeyCode, isKeyCode } from "./KeyCode"

export class InputManager {
  private down: Set<KeyCode> = new Set()
  private pressed: Set<KeyCode> = new Set()
  private released: Set<KeyCode> = new Set()
  private prevent: Set<KeyCode> = new Set([
    KeyCode.ArrowUp,
    KeyCode.ArrowDown,
    KeyCode.ArrowLeft,
    KeyCode.ArrowRight,
    KeyCode.Space,
    KeyCode.Tab,
  ])

  constructor() {
    // Bind once
    this.onKeyDown = this.onKeyDown.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)
    this.onBlur = this.onBlur.bind(this)

    // Listen to the relevant events
    window.addEventListener("keydown", this.onKeyDown)
    window.addEventListener("keyup", this.onKeyUp)
    window.addEventListener("blur", this.onBlur)
  }

  public reset() {
    this.down.clear()
    this.pressed.clear()
    this.released.clear()
  }

  public isDown(key: KeyCode): boolean {
    return this.down.has(key)
  }

  public wasPressed(key: KeyCode): boolean {
    return this.pressed.has(key)
  }

  public wasReleased(key: KeyCode): boolean {
    return this.released.has(key)
  }

  public getPreventDefault(): Set<KeyCode> {
    return this.prevent
  }

  public setPreventDefault(keys: Iterable<KeyCode>) {
    this.prevent = new Set(keys)
  }

  public endTick(): void {
    this.pressed.clear()
    this.released.clear()
  }

  private onKeyDown(e: KeyboardEvent): void {
    if (!isKeyCode(e.code)) return
    if (this.prevent.has(e.code)) e.preventDefault()

    if (!this.down.has(e.code)) this.pressed.add(e.code)
    this.down.add(e.code)
  }

  private onKeyUp(e: KeyboardEvent): void {
    if (!isKeyCode(e.code)) return
    if (this.prevent.has(e.code)) e.preventDefault()

    if (this.down.has(e.code)) this.released.add(e.code)
    this.down.delete(e.code)
  }

  private onBlur(): void {
    this.reset()
  }
}

export const Input = new InputManager()
