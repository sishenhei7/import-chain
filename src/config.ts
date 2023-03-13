export interface Config {
  includedPath: string[]
  excludedPath: string[]
  extensions: string[]
  mappingPath?: Record<string, string[]>
  tsconfigPath?: string
}

export default {
  includedPath: ['./pages', './components/experience-booking/experience-activity'],
  excludedPath: [],
  extensions: ['.ts', '.tsx', '.vue', '.js']
} as Config
