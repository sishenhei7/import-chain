import { resolve, join, dirname } from 'node:path'
import { existsSync, readFileSync } from 'node:fs'
import config from './config'

export type Tsconfig = Record<string, any>

let tsconfig: Tsconfig | null

function ensureFileExist(filePath: string): string {
  if (existsSync(filePath)) {
    return filePath
  }

  for (const extension of config.extensions) {
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

  const tsconfigPath = [
    resolve('tsconfig.json'),
    resolve('tsconfig.build.json'),
    ...(config.tsconfigPath ? [resolve(config.tsconfigPath)] : []),
  ]
  for (const path of tsconfigPath) {
    if (existsSync(path)) {
      tsconfig = JSON.parse(readFileSync(path, 'utf-8'))
      return tsconfig
    }
  }

  tsconfig = null
  return tsconfig
}

function getMappingPath(path: string, key: string, mapped: string, baseUrl: string): string {
  const mappedPath = mapped.slice(0, -1)
  const mappedDir = resolve(baseUrl, mappedPath)
  const potential = join(mappedDir, path.substring(key.slice(0, -1).length))
  const potentialPath = ensureFileExist(potential)
  return potentialPath
}

export default function normalizePath(childPath: string, parentPath = ''): string {
  if (childPath.startsWith('./')) {
    return ensureFileExist(resolve(dirname(parentPath), childPath))
  }

  // tsconfig 里面的路径
  const { baseUrl, paths } = getTsconfig()?.compilerOptions ?? {}
  if (baseUrl && paths) {
    for (const key in paths) {
      if (key.endsWith('*') && childPath.startsWith(key.slice(0, -1))) {
        for (const pathItem of paths[key]) {
          const potentialPath = getMappingPath(childPath, key, pathItem, baseUrl)
          if (potentialPath) {
            return potentialPath
          }
        }
      }
    }
  }

  // config 里面的路径
  const { mappingPath = {} } = config
  for (const key in mappingPath) {
    for (const pathItem of mappingPath[key]) {
      const potentialPath = getMappingPath(childPath, key, pathItem, '.')
      if (potentialPath) {
        return potentialPath
      }
    }
  }

  return ensureFileExist(resolve(childPath))
}
