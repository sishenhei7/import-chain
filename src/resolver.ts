import ts from 'typescript'
import FileItem from './file'
import normalizePath from './path'
import store from './store'

export default function resolveModule(fileItem: FileItem): void {
  const { path: filePath } = fileItem
  if (store.has(filePath)) {
    return
  }
  store.set(filePath, fileItem)

  const sourceFile = ts.createSourceFile(filePath, ts.sys.readFile(filePath) || '', ts.ScriptTarget.Latest)

  sourceFile?.statements?.forEach((node: ts.Node) => {
    if (ts.isImportDeclaration(node)) {
      if (ts.isStringLiteral(node.moduleSpecifier)) {
        const childPath = normalizePath(node.moduleSpecifier.text)

        if (childPath) {
          const child = store.get(childPath) || new FileItem(childPath)
          fileItem.addImport(child)
          resolveModule(child)
        } else {
          console.log(`文件${node.moduleSpecifier.text}不存在，已忽略！`)
        }
      }
    }
  })
}
