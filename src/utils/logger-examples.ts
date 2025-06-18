/**
 * This file provides examples of how to use the logger utility throughout the application.
 * These are examples only and can be adapted as needed for your specific use cases.
 */

import logger, { createLogger, LogLevel } from './logger';

// Example 1: Basic usage with the default logger
export function basicLoggingExample() {
  // Different log levels
  logger.debug('This is a debug message');
  logger.info('This is an info message');
  logger.warn('This is a warning message');
  logger.error('This is an error message');
  logger.fatal('This is a fatal message');

  // With context/metadata
  logger.info('User logged in', { userId: '123', timestamp: new Date() });

  // With error objects
  try {
    throw new Error('Something went wrong');
  } catch (error) {
    logger.error('Error during operation', error);
  }
}

// Example 2: Creating component-specific loggers
export function componentLoggingExample() {
  // Authentication logger
  const authLogger = logger.child('Auth');
  authLogger.info('User authentication started');
  authLogger.info('Token validated');

  // API service logger
  const apiLogger = logger.child('API');
  apiLogger.debug('API request started', { endpoint: '/users', method: 'GET' });
  apiLogger.info('API request completed', { status: 200, duration: '120ms' });

  // Database logger
  const dbLogger = logger.child('Database');
  dbLogger.info('Query executed', { table: 'users', operation: 'SELECT' });
  dbLogger.warn('Slow query detected', {
    duration: '1500ms',
    query: 'SELECT * FROM users',
  });
}

// Example 3: Creating a custom logger instance with specific configuration
export function customLoggerExample() {
  // Create a production-like logger
  const prodLogger = createLogger({
    minLevel: LogLevel.ERROR, // Only log errors and fatals
    enableConsole: true,
    enableFileOutput: true,
    filePath: './logs/critical-errors.log',
    useColors: false, // No colors for production logs
  });

  prodLogger.debug('This debug message will not be logged'); // Filtered out
  prodLogger.info('This info message will not be logged'); // Filtered out
  prodLogger.warn('This warning will not be logged'); // Filtered out
  prodLogger.error('This error will be logged'); // Logged
  prodLogger.fatal('This fatal error will be logged'); // Logged
}

// Example 4: Performance logging patterns
export function performanceLoggingExample() {
  const perfLogger = logger.child('Performance');

  // Start timing
  const startTime = performance.now();

  // ... operation being timed ...

  // End timing
  const endTime = performance.now();
  const duration = endTime - startTime;

  perfLogger.info('Operation completed', {
    durationMs: duration,
    timestamp: new Date(),
    operation: 'dataProcessing',
  });

  // Threshold-based logging
  if (duration > 1000) {
    perfLogger.warn('Slow operation detected', {
      durationMs: duration,
      threshold: 1000,
      operation: 'dataProcessing',
    });
  }
}

// Example 5: Request/Response logging for API calls
export function requestLoggingExample() {
  const httpLogger = logger.child('HTTP');

  // Log outgoing request
  httpLogger.debug('API request initiated', {
    url: 'https://api.example.com/data',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Don't log sensitive data like full request bodies
    bodySize: JSON.stringify({ name: 'Test', data: [1, 2, 3] }).length,
    timestamp: new Date(),
  });

  // Log response
  httpLogger.info('API response received', {
    url: 'https://api.example.com/data',
    status: 200,
    duration: '350ms',
    // Don't log full response bodies in production
    responseSize: 1024,
  });
}
