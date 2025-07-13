/**
 * Test script to verify logger behavior in production
 * Run this with NODE_ENV=production to test production behavior
 */

const logger = require('./logger.ts');

// Test all logger methods
console.log('Testing logger in environment:', process.env.NODE_ENV);

logger.default.debug('This debug message should not appear in production');
logger.default.info('This info message should not appear in production');
logger.default.warn('This warning should not appear in production');
logger.default.error('This error should not appear in production');
logger.default.fatal('This fatal error should not appear in production');

// Test with context
logger.default.info('Test with context', { userId: 123, action: 'login' });

// Test error with Error object
const testError = new Error('Test error object');
logger.default.error('Error with object', testError);

console.log('Logger test completed');
