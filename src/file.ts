import { resolve, relative } from 'path'
import debug from 'debug'

const debugFile = debug('import-chain:file')

export default class FileItem {
  private imports: Set<FileItem> = new Set()
  private parents: Set<FileItem> = new Set()

  constructor(public path: string) {}

  public addImport(child: FileItem): void {
    this.imports.add(child)
    child.addParents(this)
  }

  public addParents(parent: FileItem): void {
    this.parents.add(parent)
  }

  public getImports(): string[] {
    return Array.from(this.imports.values()).map(item => item.path)
  }

  public getParentsPath(): string[][] {
    const res = []
    const relativePath = relative(resolve(), this.path)
    for (const parent of this.parents.values()) {
      for (const pathList of parent.getParentsPath()) {
        res.push([...pathList, relativePath])
      }
    }
    debugFile(relativePath, res)
    return res.length ? res : [[relativePath]]
  }
}
