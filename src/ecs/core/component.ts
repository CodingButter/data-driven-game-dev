import type { Entity } from "./types"

export interface ComponentDef<T> {
  key: symbol // Unique identity for the component type
  defaults: T // Default data shape
  store: Map<Entity, T> // Storage: which entities have this component and their data
  create(init?: Partial<T>): T
  get(e: Entity): T | undefined
  set(e: Entity, value: T): void
  remove(e: Entity): void
  has(e: Entity): boolean
}

export function defineComponent<T>(defaults: T): ComponentDef<T> {
  const key = Symbol("component")
  const store = new Map<Entity, T>()

  const componentDef: ComponentDef<T> = {
    key,
    defaults,
    store,
    create: (init: Partial<T> = {}) => {
      return { ...defaults, ...init }
    },
    get: (e: Entity) => store.get(e),
    set: (e: Entity, value: T) => {
      store.set(e, value)
    },
    remove: (e: Entity) => {
      store.delete(e)
    },
    has: (e: Entity) => store.has(e),
  }

  return componentDef
}
