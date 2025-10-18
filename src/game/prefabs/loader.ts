import type { PrefabDef } from "./types"

const _prefabs: Map<string, PrefabDef> = new Map()

export async function loadPrefabs(url: string = "/assets/Prefabs.json") {
  const prefabList: string[] = await fetch(url).then((res) => res.json())
  return Promise.all(prefabList.map(loadPrefab))
}

async function loadPrefab(url: string): Promise<PrefabDef> {
  const prefab: PrefabDef = await fetch(url).then((res) => res.json())
  _prefabs.set(prefab.id, prefab)
  return prefab
}
export function getPrefab(id: string): PrefabDef {
  const p = _prefabs.get(id)
  if (!p) {
    throw new Error(`Prefab with id ${id} not found`)
  }
  return p
}
