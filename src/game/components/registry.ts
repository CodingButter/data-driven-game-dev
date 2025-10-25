import Components from "@/game/components"
type Factory<T = unknown> = (data: any) => T

export type ComponentRegistryEntry = {
  type: any
  fromJSON: Factory
}

const registry: Map<string, ComponentRegistryEntry> = new Map()

export function registerComponents() {
  for (const key in Components) {
    registry.set(key, {
      type: (Components as any)[key],
      fromJSON: (data: any) => (Components as any)[key].create(data),
    })
  }
}

export function getComponentEntry(name: string): ComponentRegistryEntry | undefined {
  return registry.get(name)
}
