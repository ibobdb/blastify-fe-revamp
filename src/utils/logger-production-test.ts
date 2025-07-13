/**
 * Test script to verify logger behavior in production
 * Run this with NODE_ENV=production to test production behavior
 */

import logger from './logger';

// Test all logger methods
console.log('Testing logger in environment:', process.env.NODE_ENV);

logger.debug('This debug message should not appear in production');
logger.info('This info message should not appear in production');
logger.warn('This warning should not appear in production');
logger.error('This error should not appear in production');
logger.fatal('This fatal error should not appear in production');

// Test with context
logger.info('Test with context', { userId: 123, action: 'login' });

// Test error with Error object
const testError = new Error('Test error object');
logger.error('Error with object', testError);

console.log('Logger test completed');
