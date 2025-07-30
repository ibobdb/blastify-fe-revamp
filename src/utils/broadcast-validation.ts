// Enhanced broadcast validation examples and usage patterns

import {
  ConfirmResult,
  ScheduleResponse,
} from '@/components/dashboard/broadcast-send-confirm';
import broadcastService from '@/services/broadcast.service';
import { toast } from 'sonner';

// Example of comprehensive broadcast handler with all validation scenarios
export const createBroadcastHandler = (
  messageContent: string,
  contacts: Array<{ name: string; number: string }>,
  includeImage: boolean,
  selectedImage: File | null,
  enableParaphrase: boolean,
  finalParaphrase: string[]
) => {
  return async (schedule: ScheduleResponse): Promise<ConfirmResult> => {
    try {
      // 1. Input Validation
      if (!messageContent?.trim()) {
        return {
          success: false,
          error: 'Message content is required and cannot be empty.',
        };
      }

      if (messageContent.trim().length > 4096) {
        return {
          success: false,
          error: 'Message content is too long (maximum 4096 characters).',
        };
      }

      if (!contacts?.length) {
        return {
          success: false,
          error: 'Please add at least one contact to send the broadcast.',
        };
      }

      // 2. Image Validation
      if (includeImage) {
        if (!selectedImage) {
          return {
            success: false,
            error: 'Please select an image to include in the broadcast.',
          };
        }

        const maxSize = 2 * 1024 * 1024; // 2MB
        if (selectedImage.size > maxSize) {
          return {
            success: false,
            error: 'Image file is too large. Maximum size is 2MB.',
          };
        }

        const allowedTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
        ];
        if (!allowedTypes.includes(selectedImage.type)) {
          return {
            success: false,
            error: 'Invalid image format. Please use JPG, PNG, or GIF.',
          };
        }
      }

      // 3. Paraphrase Validation
      if (enableParaphrase && !finalParaphrase?.length) {
        return {
          success: false,
          error:
            'Please generate and select paraphrases before sending the broadcast.',
        };
      }

      // 4. Schedule Validation
      if (schedule.status) {
        const now = new Date();
        const scheduledDate = new Date(schedule.date);

        if (scheduledDate <= now) {
          return {
            success: false,
            error: 'Scheduled time must be in the future.',
          };
        }

        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

        if (scheduledDate > oneYearFromNow) {
          return {
            success: false,
            error: 'Cannot schedule broadcasts more than 1 year in advance.',
          };
        }
      }

      // 5. Prepare Broadcast Data
      const broadcastData = {
        content: messageContent.trim(),
        numbers: contacts.map((c) => c.number),
        ...(includeImage && selectedImage && { media: selectedImage }),
        ...(enableParaphrase &&
          finalParaphrase.length > 0 && { variations: finalParaphrase }),
        ...(schedule.status && {
          scheduleTime: formatScheduleDate(schedule.date),
        }),
      };

      // 6. Send Broadcast
      const response = await broadcastService.sendBroadcast(broadcastData);

      // 7. Handle Response
      if (!response.status) {
        return {
          success: false,
          error:
            response.message || 'Failed to send broadcast. Please try again.',
        };
      }

      // 8. Success Response
      const successMessage = schedule.status
        ? `Broadcast scheduled successfully for ${schedule.date.toLocaleString()}`
        : `Broadcast sent successfully to ${contacts.length} contact${
            contacts.length > 1 ? 's' : ''
          }!`;

      toast.success(successMessage);

      return {
        success: true,
        message: successMessage,
      };
    } catch (error) {
      // Handle different error types
      let errorMessage =
        'An unexpected error occurred while sending the broadcast.';

      if (error instanceof Error) {
        // Handle specific API errors
        if (
          error.message.includes('network') ||
          error.message.includes('fetch')
        ) {
          errorMessage =
            'Network error. Please check your connection and try again.';
        } else if (
          error.message.includes('unauthorized') ||
          error.message.includes('401')
        ) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (
          error.message.includes('quota') ||
          error.message.includes('limit')
        ) {
          errorMessage =
            'You have reached your broadcast limit. Please try again later.';
        } else if (
          error.message.includes('invalid number') ||
          error.message.includes('phone')
        ) {
          errorMessage =
            'One or more phone numbers are invalid. Please check and try again.';
        } else {
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    }
  };
};

// Helper function to format schedule date
const formatScheduleDate = (date: Date): string => {
  const localDate = new Date(date);
  const tzOffset = localDate.getTimezoneOffset() * 60000;
  const localISO = new Date(localDate.getTime() - tzOffset)
    .toISOString()
    .slice(0, 16);
  return localISO;
};

// Example validation patterns for different scenarios
export const ValidationPatterns = {
  // Basic validation for immediate send
  immediate: async (data: any): Promise<ConfirmResult> => {
    if (!data.content?.trim()) {
      return { success: false, error: 'Message content is required.' };
    }
    if (!data.contacts?.length) {
      return { success: false, error: 'At least one contact is required.' };
    }
    return { success: true, message: 'Ready to send immediately!' };
  },

  // Validation for scheduled broadcasts
  scheduled: async (
    data: any,
    schedule: ScheduleResponse
  ): Promise<ConfirmResult> => {
    const immediateResult = await ValidationPatterns.immediate(data);
    if (!immediateResult.success) return immediateResult;

    const now = new Date();
    if (schedule.date <= now) {
      return { success: false, error: 'Scheduled time must be in the future.' };
    }

    return {
      success: true,
      message: `Ready to schedule for ${schedule.date.toLocaleString()}!`,
    };
  },

  // Validation with media
  withMedia: async (data: any): Promise<ConfirmResult> => {
    const basicResult = await ValidationPatterns.immediate(data);
    if (!basicResult.success) return basicResult;

    if (data.includeImage && !data.selectedImage) {
      return { success: false, error: 'Please select an image.' };
    }

    if (data.selectedImage && data.selectedImage.size > 2 * 1024 * 1024) {
      return { success: false, error: 'Image too large (max 2MB).' };
    }

    return { success: true, message: 'Ready to send with media!' };
  },

  // Validation with paraphrases
  withParaphrases: async (data: any): Promise<ConfirmResult> => {
    const basicResult = await ValidationPatterns.immediate(data);
    if (!basicResult.success) return basicResult;

    if (data.enableParaphrase && !data.finalParaphrase?.length) {
      return { success: false, error: 'Please generate paraphrases.' };
    }

    return { success: true, message: 'Ready to send with variations!' };
  },
};

// Example usage in component
export const useBroadcastValidation = () => {
  const validateAndSend = async (
    formData: any,
    schedule: ScheduleResponse
  ): Promise<ConfirmResult> => {
    try {
      // Choose appropriate validation pattern
      let validator;

      if (schedule.status) {
        validator = ValidationPatterns.scheduled;
      } else if (formData.includeImage) {
        validator = ValidationPatterns.withMedia;
      } else if (formData.enableParaphrase) {
        validator = ValidationPatterns.withParaphrases;
      } else {
        validator = ValidationPatterns.immediate;
      }

      // Run validation
      const validationResult = await validator(formData, schedule);
      if (!validationResult.success) {
        return validationResult;
      }

      // Proceed with sending
      const response = await broadcastService.sendBroadcast({
        content: formData.content,
        numbers: formData.contacts.map((c: any) => c.number),
        media: formData.includeImage ? formData.selectedImage : null,
        variations: formData.enableParaphrase ? formData.finalParaphrase : [],
        scheduleTime: schedule.status
          ? formatScheduleDate(schedule.date)
          : undefined,
      });

      if (!response.status) {
        return {
          success: false,
          error: response.message || 'Failed to send broadcast.',
        };
      }

      return {
        success: true,
        message: schedule.status
          ? `Successfully scheduled for ${schedule.date.toLocaleString()}`
          : 'Broadcast sent successfully!',
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unexpected error occurred.',
      };
    }
  };

  return { validateAndSend };
};
