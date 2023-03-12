import { resolve, join, dirname } from 'node:path'
import { existsSync, readFileSync } from 'node:fs'

export type Tsconfig = Record<string, any>

let tsconfig: Tsconfig | null
const extensions = ['.ts', '.tsx', '.vue', '.js']

function ensureFileExist(filePath: string): string {
  if (existsSync(filePath)) {
    return filePath
  }

  for (const extension of extensions) {
    const pathWithExtension = `${filePath}${extension}`
    if (existsSync(pathWithExtension)) {
      return pathWithExtension
    }
  }

  return ''
}

function getTsconfig(): Tsconfig | null {
  if (tsconfig || tsconfig === null) {
    return tsconfig
  }

  const tsconfigPath = [resolve('tsconfig.json'), resolve('tsconfig.build.json')]
  for (const path of tsconfigPath) {
    if (existsSync(path)) {
      tsconfig = JSON.parse(readFileSync(path, 'utf-8'))
      return tsconfig
    }
  }

  tsconfig = null
  return tsconfig
}

export default function normalizePath(childPath: string, parentPath = ''): string {
  if (childPath.startsWith('./')) {
    return ensureFileExist(resolve(dirname(parentPath), childPath))
  }

  // tsconfig 里面的路径
  const { baseUrl, paths } = getTsconfig()?.compilerOptions ?? {}
  if (baseUrl && paths) {
    const currentBaseUrl = resolve(baseUrl)
    for (const key in paths) {
      if (key.endsWith('*') && childPath.startsWith(key.slice(0, -1))) {
        const pathList = paths[key]
        for (const pathItem of pathList) {
          const mapped = pathItem.slice(0, -1)
          const mappedDir = resolve(currentBaseUrl, mapped)
          const potential = join(mappedDir, childPath.substring(key.slice(0, -1).length))
          const potentialPath = ensureFileExist(potential)

          if (potentialPath) {
            return potentialPath
          }
        }
      }
    }
  }

  return ensureFileExist(resolve(childPath))
}
