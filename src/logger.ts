import colors from 'picocolors'
import config from './config'

type LogLevel = 'log' | 'error' | 'warn' | 'info'

class logger {
  private shresh: number

  constructor() {
    this.shresh = Number(process.env.LOG_LEVEL)
  }

  public log(msg: string) {
    console.log(msg)
  }

  public warn(msg: string) {
    console.log(msg)
  }

  public error(msg: string) {
    console.log(msg)
  }

  public info(msg: string) {
    console.log(msg)
  }
}

export default new logger()
