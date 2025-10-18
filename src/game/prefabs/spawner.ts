import { getPrefab } from "@/game/prefabs/loader"
import { getComponentEntry } from "@/game/components/registry"
import type { World } from "@/ecs/core/world"

type SpawnOpts = {
  overrides?: Record<string, any>
}

export function spawnPrefab(world: World, prefabId: string, opts: SpawnOpts = {}) {
  const { overrides = {} } = opts
  const def = getPrefab(prefabId)

  const eid = world.create()
  for (const [name, baseData] of Object.entries(def.components)) {
    const entry = getComponentEntry(name)
    if (!entry) throw new Error(`Component ${name} not registered in registry`)
    const data = {
      ...baseData,
      ...(overrides[name] ?? {}),
    }

    const instance = entry.fromJSON(data)
    world.add(entry.type, eid, instance)
  }
}
