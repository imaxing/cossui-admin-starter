/**
 * 日志工具类
 * 职责：提供统一的日志输出格式化方法
 */
export class Logger {
  private static timestamp(): string {
    const now = new Date()
    return now.toISOString().replace('T', ' ').substring(0, 19)
  }

  /**
   * 输出信息日志
   */
  static info(message: string): void {
    console.log(`[${this.timestamp()}] INFO: ${message}`)
  }

  /**
   * 输出错误日志
   */
  static error(message: string): void {
    console.log(`[${this.timestamp()}] ERROR: ${message}`)
  }

  /**
   * 输出警告日志
   */
  static warn(message: string): void {
    console.log(`[${this.timestamp()}] WARN: ${message}`)
  }

  /**
   * 输出调试日志
   */
  static debug(message: string): void {
    console.log(`[${this.timestamp()}] DEBUG: ${message}`)
  }
}
