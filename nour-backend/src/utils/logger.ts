/**
 * Simple logger utility
 * No external dependencies to avoid circular references
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private getLogLevel(): string {
    // Simple check without importing config
    return process.env.LOG_LEVEL || 'info';
  }

  private isDevelopment(): boolean {
    return process.env.NODE_ENV !== 'production';
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
    return `[${this.getTimestamp()}] [${level.toUpperCase()}] ${message} ${args.map(a => {
      try {
        return typeof a === 'object' ? JSON.stringify(a) : String(a);
      } catch {
        return String(a);
      }
    }).join(' ')}`;
  }

  debug(message: string, ...args: any[]): void {
    if (this.isDevelopment() && this.getLogLevel() === 'debug') {
      console.debug(this.formatMessage('debug', message, ...args));
    }
  }

  info(message: string, ...args: any[]): void {
    console.info(this.formatMessage('info', message, ...args));
  }

  warn(message: string, ...args: any[]): void {
    console.warn(this.formatMessage('warn', message, ...args));
  }

  error(message: string, ...args: any[]): void {
    console.error(this.formatMessage('error', message, ...args));
  }
}

export const logger = new Logger();
export default logger;