import { resolve } from 'path'
import { existsSync } from 'fs'
import debug from 'debug'

const debugConfig = debug('import-chain:config')

function merge(config: Record<string, any>, overrides: Record<string, any>) {
  for (const key in config) {
    if (!key.startsWith('_') && overrides[key]) {
      config[key] = overrides[key]
    }
  }
}

class Config {
  public logLevel = 1
  public extensions: string[] = ['.ts', '.tsx', '.vue', '.js']
  public includedPath?: string[]
  public excludedPath?: string[]
  public mappingPath?: Record<string, string[]>
  public tsconfigPath?: string

  private _isLoaded = false

  public async loadConfig() {
    if (this._isLoaded) {
      return
    }

    this._isLoaded = true

    const configPath = resolve('import-chain.config')
    if (existsSync(configPath)) {
      try {
        const customConfig = (await import(configPath)).default
        merge(this, customConfig)
      } catch (error) {
        debugConfig('解析 config 文件错误！')
        console.log(error)
      }
    } else {
      debugConfig('没有找到 config 文件！')
    }
  }
}

export function defineConfig(config: Config): Config {
  return config
}

export default new Config()
