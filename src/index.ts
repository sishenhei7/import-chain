import getEntryFiles from './entry'
import FileItem from './file'
import normalizePath from './path'
import store from './store'
import resolveModule from './resolver'
import config from './config'
export { defineConfig } from './config'

export default async function getImportChain(filePath: string): Promise<string[][]> {
  await config.loadConfig()

  const entryPathList = await getEntryFiles(config.includedPath || [])
  for (const entryPath of entryPathList) {
    const normalizedEntryPath = normalizePath(entryPath)
    resolveModule(new FileItem(normalizedEntryPath))
  }

  const normalizedPath = normalizePath(filePath)
  if (!normalizedPath) {
    console.log(`这个文件不存在：${normalizedPath}`)
  }

  const fileItem = store.get(normalizedPath)
  if (!fileItem) {
    console.log(`这个文件没有被项目引用: ${normalizedPath}`)
    return []
  }
  return fileItem.getParentsPath()
}

// ;(async () => {
//   const args = process.argv.slice(2)
//   if (!args.length) {
//     console.log('请输入文件名！(示例: npm run import pages/experience/pay/common/base.ts)')
//   } else {
//     const infoList = await getImportChain(args[0])
//     console.log(
//       '引用的顶层文件为：',
//       infoList.map(item => item[0])
//     )
//     console.log('详细文件路径为：', infoList)
//   }
// })()
