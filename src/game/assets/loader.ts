import type { PrefabDef } from "@/game/prefabs/types"
import type { SpriteSheet } from "@/ecs/core/types"

const _prefabs: Map<string, PrefabDef> = new Map()
const _spriteSheets: Map<string, SpriteSheet> = new Map()

export function registerSpriteSheet(sheet: SpriteSheet) {
  _spriteSheets.set(sheet.id, sheet)
}

export async function load<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    console.log(`Failed to load resource: ${url}`)
  }
  return (await response.json()) as T
}

async function loadAndRegisterPrefab(url: string): Promise<PrefabDef> {
  const prefab: PrefabDef = await load<PrefabDef>(url)
  _prefabs.set(prefab.id, prefab)
  return prefab
}

export async function loadAndRegisterPrefabs(url: string[]) {
  return Promise.all(url.map(loadAndRegisterPrefab))
}

async function loadAndRegisterSpriteSheet(url: string): Promise<SpriteSheet> {
  const sheet = await load<SpriteSheet>(url)
  console.log(`sheeturl: ${sheet.url}`)
  sheet.source = new Image()
  sheet.source.src = sheet.url
  console.log(`Loading sprite sheet: ${sheet.id} from ${sheet.url}`)
  await new Promise((resolve, reject): void => {
    sheet.source.onload = () => resolve(true)
    sheet.source.onerror = () => reject(false)
  })
  _spriteSheets.set(sheet.id, sheet)
  return sheet
}

export async function loadAndRegisterAssets(url: string) {
  const assets = await load<{ prefabs: string[]; tilemaps: string[] }>(url)
  await loadAndRegisterPrefabs(assets.prefabs)
  await Promise.all(assets.tilemaps.map(loadAndRegisterSpriteSheet))
}

export function getPrefab(id: string): PrefabDef {
  const p = _prefabs.get(id)
  if (!p) {
    throw new Error(`Prefab with id ${id} not found`)
  }
  return p
}

export function getSpriteSheet(id: string): SpriteSheet {
  const sheet = _spriteSheets.get(id)
  if (!sheet) {
    throw new Error(`SpriteSheet with id ${id} not found`)
  }
  return sheet
}
