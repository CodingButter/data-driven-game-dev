import type { Entity } from "./types"
import type { ComponentDef } from "./component"

export class World {
  private _next: Entity = 1 as Entity

  // Create a new ID
  create(): Entity {
    return this._next++ as Entity
  }

  // Component operations
  add<T>(c: ComponentDef<T>, e: Entity, value: T): void {
    c.set(e, value)
  }
  get<T>(c: ComponentDef<T>, e: Entity): T | undefined {
    return c.get(e)
  }
  remove<T>(c: ComponentDef<T>, e: Entity): void {
    c.remove(e)
  }

  // Query: entities that have ALL provided components
  /**
   *  This is a generator function
   *  if will sort the components by the size of their store smallest to largest
   *  this way if one component is very rare it will be checked first
   * and we can skip checking the rest of the components for that entity
   */
  *query(...components: ComponentDef<any>[]): Iterable<Entity> {
    if (components.length === 0) return
    //start from the smallest store to minimize work
    const sorted: ComponentDef<any>[] = [...components].sort((a, b) => a.store.size - b.store.size)
    outer: for (const e of (sorted[0] as ComponentDef<any>).store.keys()) {
      for (let i = 1; i < sorted.length; i++) {
        if (!sorted[i]?.store.has(e)) continue outer
      }
      yield e
    }
  }
}
