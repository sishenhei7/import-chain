import { resolve, join } from 'path'
import { readdir } from 'node:fs/promises'
import { existsSync, statSync } from 'node:fs'

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
  const res: string[] = []
  await Promise.all(
    entryList.map(async entry => {
      const entryPath = resolve(entry)
      const childFiles = await readdir(entryPath)
      const directories: string[] = []

      childFiles.forEach(file => {
        const filePath = join(entryPath, file)
        if (isFile(filePath)) {
          res.push(filePath)
        } else if (isDirectory(filePath)) {
          directories.push(filePath)
        } else {
          console.log(`未处理的入口文件：${filePath}`)
        }
      })

      if (directories.length) {
        res.concat(await getEntryFiles(directories))
      }
    }),
  )
  return res
}
