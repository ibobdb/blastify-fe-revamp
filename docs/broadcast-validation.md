# Broadcast Validation System Documentation

## Overview

The enhanced `BroadcastSendConfirm` component now includes comprehensive validation for both success and failure scenarios. This system provides better user experience with proper error handling, retry mechanisms, and clear feedback.

## Key Features

### 1. Enhanced Type System

```typescript
export type ConfirmResult = {
  success: boolean;
  message?: string;
  error?: string;
};

export interface BroadcastSendConfirmProps {
  isOpen: boolean;
  isScheduled?: boolean;
  onClose: () => void;
  onConfirm?: (
    schedule: ScheduleResponse
  ) => Promise<ConfirmResult> | ConfirmResult;
  onReset?: () => void;
}
```

### 2. Multi-Step Dialog Flow

- **Step 1**: Confirmation dialog (immediate or scheduled)
- **Step 2**: Success dialog with options to keep or reset state
- **Step 3**: Schedule setup dialog (for scheduled broadcasts)
- **Step 4**: Failure dialog with retry and cancel options

### 3. Comprehensive Validation

#### Input Validation

- Message content (required, length limits)
- Contact list (at least one contact required)
- Image validation (size, format)
- Paraphrase validation (if enabled)
- Schedule validation (future dates, reasonable limits)

#### Error Handling

- Network errors
- Authentication errors
- Quota/limit errors
- Invalid data errors
- Unexpected errors

## Implementation Guide

### Basic Implementation

```typescript
import {
  BroadcastSendConfirm,
  ConfirmResult,
  ScheduleResponse,
} from '@/components/dashboard/broadcast-send-confirm';

const handleBroadcast = async (
  schedule: ScheduleResponse
): Promise<ConfirmResult> => {
  try {
    // Your validation logic
    if (!messageContent) {
      return { success: false, error: 'Message content is required' };
    }

    // Your broadcast logic
    const response = await broadcastService.sendBroadcast(data);

    if (!response.status) {
      return { success: false, error: response.message };
    }

    return {
      success: true,
      message: 'Broadcast sent successfully!',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Unexpected error occurred',
    };
  }
};

// In your component JSX
<BroadcastSendConfirm
  isOpen={isOpen}
  isScheduled={isScheduled}
  onClose={() => setIsOpen(false)}
  onConfirm={handleBroadcast}
  onReset={resetState}
/>;
```

### Advanced Implementation with Comprehensive Validation

```typescript
const handleBroadcastWithValidation = async (
  schedule: ScheduleResponse
): Promise<ConfirmResult> => {
  try {
    // 1. Content validation
    if (!messageContent?.trim()) {
      return { success: false, error: 'Message content is required' };
    }

    if (messageContent.length > 4096) {
      return {
        success: false,
        error: 'Message too long (max 4096 characters)',
      };
    }

    // 2. Contact validation
    if (!contacts?.length) {
      return { success: false, error: 'At least one contact is required' };
    }

    // 3. Media validation
    if (includeImage && !selectedImage) {
      return { success: false, error: 'Please select an image' };
    }

    if (selectedImage && selectedImage.size > 2 * 1024 * 1024) {
      return { success: false, error: 'Image too large (max 2MB)' };
    }

    // 4. Schedule validation
    if (schedule.status && schedule.date <= new Date()) {
      return { success: false, error: 'Scheduled time must be in the future' };
    }

    // 5. Send broadcast
    const broadcastData = {
      content: messageContent,
      numbers: contacts.map((c) => c.number),
      media: includeImage ? selectedImage : null,
      scheduleTime: schedule.status ? schedule.date.toISOString() : undefined,
    };

    const response = await broadcastService.sendBroadcast(broadcastData);

    if (!response.status) {
      return {
        success: false,
        error: response.message || 'Failed to send broadcast',
      };
    }

    const successMessage = schedule.status
      ? `Scheduled for ${schedule.date.toLocaleString()}`
      : 'Sent successfully!';

    return { success: true, message: successMessage };
  } catch (error) {
    console.error('Broadcast error:', error);

    // Handle specific error types
    if (error.message?.includes('network')) {
      return { success: false, error: 'Network error. Please try again.' };
    }

    if (error.message?.includes('unauthorized')) {
      return {
        success: false,
        error: 'Authentication failed. Please log in again.',
      };
    }

    return {
      success: false,
      error: error.message || 'Unexpected error occurred',
    };
  }
};
```

## Validation Patterns

### 1. Immediate Send Pattern

```typescript
const immediateHandler = async (
  schedule: ScheduleResponse
): Promise<ConfirmResult> => {
  // Basic validation
  if (!isValid()) {
    return { success: false, error: 'Validation failed' };
  }

  // Send immediately
  const result = await sendBroadcast();

  return result.success
    ? { success: true, message: 'Sent successfully!' }
    : { success: false, error: result.error };
};
```

### 2. Scheduled Send Pattern

```typescript
const scheduledHandler = async (
  schedule: ScheduleResponse
): Promise<ConfirmResult> => {
  // Validate schedule time
  if (schedule.date <= new Date()) {
    return { success: false, error: 'Time must be in the future' };
  }

  // Schedule broadcast
  const result = await scheduleBroadcast(schedule);

  return result.success
    ? {
        success: true,
        message: `Scheduled for ${schedule.date.toLocaleString()}`,
      }
    : { success: false, error: result.error };
};
```

### 3. Media Validation Pattern

```typescript
const mediaHandler = async (
  schedule: ScheduleResponse
): Promise<ConfirmResult> => {
  // Validate media
  if (includeMedia && !mediaFile) {
    return { success: false, error: 'Please select media file' };
  }

  if (mediaFile && mediaFile.size > MAX_FILE_SIZE) {
    return { success: false, error: 'File too large' };
  }

  // Continue with broadcast...
};
```

## Error Handling Best Practices

### 1. User-Friendly Error Messages

```typescript
const getErrorMessage = (error: any): string => {
  if (error.message?.includes('network')) {
    return 'Network connection failed. Please check your internet and try again.';
  }

  if (error.message?.includes('quota')) {
    return 'You have reached your broadcast limit. Please try again later.';
  }

  if (error.message?.includes('invalid number')) {
    return 'One or more phone numbers are invalid. Please check and try again.';
  }

  return error.message || 'An unexpected error occurred. Please try again.';
};
```

### 2. Retry Logic

```typescript
const handleWithRetry = async (
  schedule: ScheduleResponse,
  retryCount = 0
): Promise<ConfirmResult> => {
  try {
    return await sendBroadcast(schedule);
  } catch (error) {
    if (retryCount < 3 && isRetryableError(error)) {
      await delay(1000 * Math.pow(2, retryCount)); // Exponential backoff
      return handleWithRetry(schedule, retryCount + 1);
    }

    return { success: false, error: getErrorMessage(error) };
  }
};
```

### 3. Logging and Monitoring

```typescript
const handleBroadcastWithLogging = async (
  schedule: ScheduleResponse
): Promise<ConfirmResult> => {
  const startTime = Date.now();

  try {
    logger.info('Starting broadcast', {
      isScheduled: schedule.status,
      contactCount: contacts.length,
    });

    const result = await sendBroadcast(schedule);

    logger.info('Broadcast completed', {
      success: result.success,
      duration: Date.now() - startTime,
    });

    return result;
  } catch (error) {
    logger.error('Broadcast failed', {
      error: error.message,
      duration: Date.now() - startTime,
    });

    return { success: false, error: getErrorMessage(error) };
  }
};
```

## Testing

### Unit Tests

```typescript
describe('Broadcast validation', () => {
  it('should validate message content', async () => {
    const result = await validateBroadcast({ content: '' });
    expect(result.success).toBe(false);
    expect(result.error).toContain('content is required');
  });

  it('should validate contacts', async () => {
    const result = await validateBroadcast({ content: 'test', contacts: [] });
    expect(result.success).toBe(false);
    expect(result.error).toContain('contact');
  });

  it('should validate schedule time', async () => {
    const pastDate = new Date(Date.now() - 1000);
    const result = await validateSchedule({ date: pastDate, status: true });
    expect(result.success).toBe(false);
    expect(result.error).toContain('future');
  });
});
```

### Integration Tests

```typescript
describe('Broadcast integration', () => {
  it('should handle successful broadcast', async () => {
    mockBroadcastService.sendBroadcast.mockResolvedValue({ status: true });

    const result = await handleBroadcast(validSchedule);

    expect(result.success).toBe(true);
    expect(result.message).toContain('successfully');
  });

  it('should handle API errors', async () => {
    mockBroadcastService.sendBroadcast.mockRejectedValue(
      new Error('API Error')
    );

    const result = await handleBroadcast(validSchedule);

    expect(result.success).toBe(false);
    expect(result.error).toContain('API Error');
  });
});
```

## Migration Guide

### From Old System

```typescript
// Old way
const handleSend = async () => {
  try {
    await broadcastService.send(data);
    toast.success('Sent!');
  } catch (error) {
    toast.error('Failed!');
  }
};

<BroadcastSendConfirm onConfirm={handleSend} />;
```

### To New System

```typescript
// New way
const handleSend = async (
  schedule: ScheduleResponse
): Promise<ConfirmResult> => {
  try {
    const response = await broadcastService.send(data);
    return { success: true, message: 'Sent successfully!' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

<BroadcastSendConfirm onConfirm={handleSend} />;
```

The system now handles toast notifications automatically based on the returned `ConfirmResult`.
