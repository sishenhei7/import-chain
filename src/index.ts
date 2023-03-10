import ts from 'typescript'

class FileItem {
  constructor(
    public path: string,
    private imports: Set<string> = new Set(),
    private parents: Set<string> = new Set()
  ) {}

  public addImport(path: string) {
    this.imports.add(path)
  }

  public addParents(path: string) {
    this.parents.add(path)
  }
}

type FileStore = Map<string, FileItem>

export default function getImportChain (filePath: string): string[][] {

  return []
}