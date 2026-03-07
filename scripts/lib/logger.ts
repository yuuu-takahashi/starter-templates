/**
 * Logging utilities for generation scripts.
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LoggerOptions {
  verbose?: boolean;
  level?: LogLevel;
}

export class Logger {
  private verbose: boolean;
  private level: LogLevel;
  private startTimes: Map<string, number> = new Map();

  constructor(options: LoggerOptions = {}) {
    this.verbose = options.verbose ?? false;
    this.level = options.level ?? LogLevel.INFO;
  }

  debug(message: string, context?: unknown): void {
    if (this.verbose) {
      console.log(`[DEBUG] ${message}`, context ? context : '');
    }
  }

  info(message: string): void {
    console.log(message);
  }

  warn(message: string): void {
    console.warn(`⚠️  ${message}`);
  }

  error(message: string, error?: Error): void {
    console.error(`❌ ${message}`);
    if (error) {
      console.error(`   ${error.message}`);
    }
  }

  start(operationName: string): void {
    if (this.verbose) {
      this.startTimes.set(operationName, Date.now());
      console.log(`⏱️  Starting: ${operationName}`);
    }
  }

  end(operationName: string): void {
    if (this.verbose && this.startTimes.has(operationName)) {
      const duration = Date.now() - this.startTimes.get(operationName)!;
      this.startTimes.delete(operationName);
      console.log(`⏱️  Completed: ${operationName} (${duration}ms)`);
    }
  }

  success(message: string): void {
    console.log(`✓ ${message}`);
  }

  generated(filePath: string): void {
    this.info(`  Generated: ${filePath}`);
  }
}

// Singleton instance
export const logger = new Logger();

export const createLogger = (options: LoggerOptions): Logger => new Logger(options);
