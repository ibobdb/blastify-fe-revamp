/**
 * Logger utility for Blastify
 *
 * This utility provides structured logging with different severity levels,
 * timestamps, and optional file output for production environments.
 */

// Define log levels in order of severity
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

// Interface for logger configuration
export interface LoggerConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  enableFileOutput: boolean;
  filePath?: string;
  useColors?: boolean;
  includeTimestamps?: boolean;
}

// Default configuration
const DEFAULT_CONFIG: LoggerConfig = {
  minLevel:
    process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  enableConsole: true,
  enableFileOutput: process.env.NODE_ENV === 'production',
  filePath: './logs/blastify.log',
  useColors: process.env.NODE_ENV !== 'production',
  includeTimestamps: true,
};

// ANSI color codes for console output
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',

  // Text colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  // Background colors
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
};

// Color mapping for different log levels
const LEVEL_COLORS = {
  [LogLevel.DEBUG]: COLORS.cyan,
  [LogLevel.INFO]: COLORS.green,
  [LogLevel.WARN]: COLORS.yellow,
  [LogLevel.ERROR]: COLORS.red,
  [LogLevel.FATAL]: `${COLORS.bright}${COLORS.bgRed}${COLORS.white}`,
};

// Text representation of log levels
const LEVEL_NAMES = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
  [LogLevel.FATAL]: 'FATAL',
};

/**
 * Main Logger class
 */
class Logger {
  private config: LoggerConfig;
  private fileStream: any = null;
  private isFileStreamInitialized: boolean = false;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    // Don't initialize file stream in browser environment
    if (typeof window === 'undefined' && this.config.enableFileOutput) {
      this.initFileStream();
    }
  }

  private initFileStream(): void {
    // Only attempt in a Node.js environment
    if (typeof window === 'undefined' && !this.isFileStreamInitialized) {
      try {
        // We use dynamic import here to avoid issues with browser environments
        // This will be properly initialized only in a Node.js environment
        const fs = require('fs');
        const path = require('path');

        // Ensure log directory exists
        if (this.config.filePath) {
          const logDir = path.dirname(this.config.filePath);
          if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
          }
        }

        this.isFileStreamInitialized = true;
      } catch (error) {
        console.error('Failed to initialize logger file stream:', error);
        this.config.enableFileOutput = false;
      }
    }
  }

  private writeToFile(message: string): void {
    if (!this.config.enableFileOutput || typeof window !== 'undefined') return;

    try {
      // Use Node.js fs module for file operations
      const fs = require('fs');
      fs.appendFileSync(this.config.filePath!, message + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: any
  ): string {
    const levelName = LEVEL_NAMES[level];
    let formattedMessage = '';

    // Add timestamp if configured
    if (this.config.includeTimestamps) {
      const timestamp = new Date().toISOString();
      formattedMessage += `[${timestamp}] `;
    }

    // Add log level
    formattedMessage += `[${levelName}] `;

    // Add message
    formattedMessage += message;

    // Add context if provided
    if (context) {
      try {
        const contextStr =
          typeof context === 'object'
            ? JSON.stringify(context, null, 2)
            : context.toString();

        formattedMessage += ` - ${contextStr}`;
      } catch (error) {
        formattedMessage += ' - [Context serialization failed]';
      }
    }

    return formattedMessage;
  }

  private colorize(level: LogLevel, message: string): string {
    if (!this.config.useColors) return message;

    const color = LEVEL_COLORS[level];
    return `${color}${message}${COLORS.reset}`;
  }

  /**
   * Log a message at the specified level
   */
  private log(level: LogLevel, message: string, context?: any): void {
    // Skip if below the configured minimum level
    if (level < this.config.minLevel) return;

    const formattedMessage = this.formatMessage(level, message, context);

    // Output to console if enabled
    if (this.config.enableConsole) {
      const colorizedMessage = this.colorize(level, formattedMessage);

      switch (level) {
        case LogLevel.DEBUG:
          console.debug(colorizedMessage);
          break;
        case LogLevel.INFO:
          console.info(colorizedMessage);
          break;
        case LogLevel.WARN:
          console.warn(colorizedMessage);
          break;
        case LogLevel.ERROR:
        case LogLevel.FATAL:
          console.error(colorizedMessage);
          break;
      }
    }

    // Write to file if enabled
    if (this.config.enableFileOutput) {
      this.writeToFile(formattedMessage);
    }
  }

  debug(message: string, context?: any): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: any): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: any): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error | any): void {
    let context = error;

    if (error instanceof Error) {
      context = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        ...(error as any), // Include any additional properties
      };
    }

    this.log(LogLevel.ERROR, message, context);
  }

  fatal(message: string, error?: Error | any): void {
    let context = error;

    if (error instanceof Error) {
      context = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        ...(error as any),
      };
    }

    this.log(LogLevel.FATAL, message, context);
  }

  /**
   * Creates a child logger with a specific prefix
   */
  child(prefix: string): Logger {
    const childLogger = new Logger(this.config);

    // Override log methods to add prefix
    ['debug', 'info', 'warn', 'error', 'fatal'].forEach((method) => {
      const originalMethod = (childLogger as any)[method];
      (childLogger as any)[method] = function (message: string, context?: any) {
        originalMethod.call(childLogger, `[${prefix}] ${message}`, context);
      };
    });

    return childLogger;
  }
}

// Create and export the default logger instance
export const logger = new Logger();

// Export a function to create custom loggers
export function createLogger(config: Partial<LoggerConfig> = {}): Logger {
  return new Logger(config);
}

export default logger;
