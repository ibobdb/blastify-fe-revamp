import logger from '@/utils/logger';

/**
 * Logging Test Component
 *
 * This is a simple test component that demonstrates
 * the various logging capabilities. This file can be imported
 * and the test() function can be called from any component.
 */
export function loggerTest() {
  // Create component-specific loggers
  const testLogger = logger.child('LoggerTest');

  // Test all log levels
  testLogger.debug('This is a debug message from the test component');
  testLogger.info('Logger test initiated', {
    timestamp: new Date().toISOString(),
  });
  testLogger.warn('This is a warning message', { code: 'TEST_WARNING' });

  try {
    // Simulate an error
    throw new Error('Test error for logging system');
  } catch (error) {
    testLogger.error('Error caught during logger test', error);
  }

  // Test with object context
  const testData = {
    success: true,
    count: 42,
    items: ['item1', 'item2'],
    nested: {
      property: 'value',
    },
  };
  testLogger.info('Test with complex data object', testData);

  // Test with sensitive data that should be redacted
  testLogger.info('User data', {
    userId: '123456',
    username: 'testuser',
    email: 'test@example.com',
    // These should be redacted in logs
    password: 'this-should-not-appear-in-logs',
    token: 'secret-token-should-be-redacted',
    creditCard: '4111-1111-1111-1111',
  });

  testLogger.info('Logger test completed successfully');
}

export default loggerTest;
