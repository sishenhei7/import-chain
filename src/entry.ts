import { resolve, join } from 'path'
import { existsSync, statSync, promises as fsPromises } from 'fs'
import debug from 'debug'

const debugEntry = debug('import-chain:entry')

function isDirectory(fileName: string) {
  if (existsSync(fileName)) {
    return statSync(fileName).isDirectory()
  }
}

function isFile(fileName: string) {
  if (existsSync(fileName)) {
    return statSync(fileName).isFile()
  }
}

export default async function getEntryFiles(entryList: string[]): Promise<string[]> {
  let res: string[] = []
  const directories: string[] = []

  entryList.forEach(entry => {
    const entryPath = resolve(entry)
    if (isFile(entryPath)) {
      res.push(entryPath)
    } else if (isDirectory(entryPath)) {
      directories.push(entryPath)
    } else {
      debugEntry(`未处理的入口文件：${entryPath}`)
    }
  })

  await Promise.all(
    directories.map(async directoryPath => {
      const childFiles = await fsPromises.readdir(directoryPath)
      const files = await getEntryFiles(childFiles.map(file => join(directoryPath, file)))
      res = res.concat(files)
    }),
  )

  return res
}
