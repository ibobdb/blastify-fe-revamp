'use client';
import { TimerIcon, Loader2Icon, CogIcon, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import ParaphraseList from '@/components/dashboard/paraphrase-list';
import broadcastService from '@/services/broadcast.service';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { Contact } from '@/services/broadcast.service';
import BroadcastContactManagement from '@/components/dashboard/broadcast-contact-management';
import {
  BroadcastSendConfirm,
  ConfirmResult,
} from '@/components/dashboard/broadcast-send-confirm';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PreviewMessage } from '@/components/dashboard/preview-message';
import { MainPageLayout } from '@/components/dashboard/main-page-layout';
import { ScheduleResponse } from '@/components/dashboard/broadcast-send-confirm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Message validation schema
const messageSchema = z.object({
  content: z
    .string()
    .min(5, 'Message content cannot be empty')
    .max(4096, 'Message content is too long (max 4096 characters)'),
  media: z.boolean().default(false),
  mediaFile: z.instanceof(File).optional(),
  number: z.string(),
  variations: z.array(z.string()).optional(),
});

// Form type inferred from the schema
type MessageFormValues = z.infer<typeof messageSchema>;

export default function BroadcastPage() {
  const [enableParaphrase, setEnableParaphrase] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [paraphraseList, setParaphraseList] = useState<string[]>([]);
  const [finalParaphrase, setFinalParaphrase] = useState<string[]>([]);
  const [messageContent, setMessageContent] = useState('');
  const [variationType, setVariationType] = useState<'random' | 'select'>(
    'random'
  );
  const [contacts, setContacts] = useState<Contact[]>([]); // Placeholder for contacts
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [includeImage, setIncludeImage] = useState(false);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmWithScheduler, setConfirmWithScheduler] = useState(false);
  const [selectedSchedule, setSelectedSchedule] =
    useState<ScheduleResponse | null>(null);

  // Reset all state handler
  const resetAllState = () => {
    setMessageContent('');
    setContacts([]);
    setSelectedImage(null);
    setImagePreviewUrl(null);
    setIncludeImage(false);
    setEnableParaphrase(false);
    setParaphraseList([]);
    setFinalParaphrase([]);
    setVariationType('random');
    reset();
    toast.success('Form reset successfully');
  };

  // Form setup with React Hook Form
  const { register, reset } = useForm<MessageFormValues>({
    // resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
      media: false,
      number: '',
      variations: [],
    },
  });

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(file);
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image removal
  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreviewUrl(null);
    // Reset the file input
    const fileInput = document.getElementById('imageInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const fetchParaphrases = async () => {
    setGenerateLoading(true);
    try {
      const response = await broadcastService.generateParaphrase(
        messageContent
      );
      if (!response.data || !response.data.variations) {
        throw new Error('No paraphrases returned from the service');
      }
      const variations = response.data.variations;
      setParaphraseList(variations);
      setGenerateLoading(false);
    } catch (error) {
      setGenerateLoading(false);
      console.error('Error fetching paraphrases:', error);
    }
  };
  const handleContacts = (contacts: Contact[]) => {
    setContacts(contacts);
  };

  const handleSendBroadcast = async (
    sch?: ScheduleResponse
  ): Promise<ConfirmResult> => {
    try {
      const validationResult = await validationData(sch);
      if (!validationResult) {
        return {
          success: false,
          error: 'Validation failed. Please check your input and try again.',
        };
      }

      // Call the broadcast service to send the message
      const response = await broadcastService.sendBroadcast(validationResult);

      if (!response.status) {
        return {
          success: false,
          error:
            response.message ||
            'Failed to send broadcast message. Please try again.',
        };
      }

      // Determine success message based on whether it's scheduled or immediate
      const successMessage = sch?.status
        ? `Broadcast scheduled successfully for ${sch.date.toLocaleString()}`
        : 'Broadcast sent successfully to all recipients!';

      toast.success(successMessage);
      return {
        success: true,
        message: successMessage,
      };
    } catch (error) {
      console.error('Error sending broadcast:', error);

      // Handle different types of errors
      let errorMessage =
        'An unexpected error occurred while sending the broadcast.';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      // Show toast for immediate feedback
      toast.error(errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    }
  };
  const validationData = async (isSch?: ScheduleResponse) => {
    try {
      // Validate message content
      if (!messageContent || messageContent.trim().length < 1) {
        throw new Error('Message content is required and cannot be empty.');
      }

      if (messageContent.trim().length > 4096) {
        throw new Error(
          'Message content is too long (maximum 4096 characters).'
        );
      }

      // Validate contacts
      if (!contacts || contacts.length === 0) {
        throw new Error(
          'Please add at least one contact to send the broadcast.'
        );
      }

      // Validate image if included
      if (includeImage && !selectedImage) {
        throw new Error('Please select an image to include in the broadcast.');
      }

      // Validate image size and type
      if (includeImage && selectedImage) {
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (selectedImage.size > maxSize) {
          throw new Error('Image file is too large. Maximum size is 2MB.');
        }

        const allowedTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
        ];
        if (!allowedTypes.includes(selectedImage.type)) {
          throw new Error('Invalid image format. Please use JPG, PNG, or GIF.');
        }
      }

      // Validate paraphrase if enabled
      if (enableParaphrase && finalParaphrase.length === 0) {
        throw new Error(
          'Please generate and select paraphrases before sending the broadcast.'
        );
      }

      // Validate scheduled date
      if (isSch?.status) {
        const now = new Date();
        const scheduledDate = new Date(isSch.date);

        if (scheduledDate <= now) {
          throw new Error('Scheduled time must be in the future.');
        }

        // Check if scheduled time is not too far in the future (e.g., 1 year)
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

        if (scheduledDate > oneYearFromNow) {
          throw new Error(
            'Cannot schedule broadcasts more than 1 year in advance.'
          );
        }
      }

      // Build the result object
      const result: any = {
        content: messageContent.trim(),
        numbers: contacts.map((c) => c.number).join(','),
      };

      // Add media if included
      if (includeImage && selectedImage) {
        result.media = selectedImage;
      }

      // Add variations if paraphrase is enabled
      if (enableParaphrase && finalParaphrase.length > 0) {
        result.variations = finalParaphrase;
      }

      // Add schedule date if scheduling
      if (isSch?.status) {
        const localDate = new Date(isSch.date);
        const tzOffset = localDate.getTimezoneOffset() * 60000;
        const localISO = new Date(localDate.getTime() - tzOffset)
          .toISOString()
          .slice(0, 16);
        result.scheduleDate = localISO;
      }

      return result;
    } catch (error) {
      console.error('Validation error:', error);

      // Show validation errors as toast messages
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Validation failed. Please check your input.');
      }

      // Return null to indicate validation failure
      return null;
    }
  };
  return (
    <MainPageLayout
      title="Broadcast"
      description="Send messages to multiple contacts or groups at once. Use this feature to reach a wider audience quickly."
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex gap-4">
          <div className="w-8/12 lg:grid-cols-2 gap-6">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold mb-2">Message Contacts</h3>
            </div>
            {/* Message Content Section */}
            <div className="space-y-4">
              <div>
                <textarea
                  {...register('content')}
                  className="w-full min-h-[200px] p-3 border rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                  placeholder="Enter your message content here..."
                  onChange={(e) => setMessageContent(e.target.value)}
                />{' '}
                <div className="text-xs text-gray-500 mt-1 space-y-1">
                  <p>WhatsApp message formatting:</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 border rounded-md p-2 bg-gray-50 dark:bg-gray-900">
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">
                        *text*
                      </code>
                      <span>
                        for <strong>bold</strong> text
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">
                        _text_
                      </code>
                      <span>
                        for <em>italic</em> text
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">
                        ~text~
                      </code>
                      <span>
                        for <span className="line-through">strikethrough</span>{' '}
                        text
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">
                        ```text```
                      </code>
                      <span>
                        for{' '}
                        <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">
                          monospace
                        </code>{' '}
                        text
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">
                        \n
                      </code>
                      <span>for line break</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Recipients Section - Empty for now but keeping the layout structure */}
            <div>{/* Content for the right column can be added later */}</div>
          </div>
          <div className="w-4/12 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between">
                  <h3 className="text-lg font-semibold mb-2">
                    Message Contacts
                  </h3>
                </div>

                <BroadcastContactManagement
                  onContactsChange={(c) => handleContacts(c)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-semibold mb-2">Message Options</h3>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="includeImage"
                className="mt-1 h-4 w-4"
                checked={includeImage}
                onChange={() => {
                  setIncludeImage(!includeImage);
                  if (includeImage) {
                    // If unchecking, remove the selected image as well
                    setSelectedImage(null);
                    setImagePreviewUrl(null);
                    const fileInput = document.getElementById(
                      'imageInput'
                    ) as HTMLInputElement;
                    if (fileInput) fileInput.value = '';
                  }
                }}
              />
              <div>
                <label htmlFor="includeImage" className="font-medium text-sm">
                  Include Image
                </label>
                <p className="text-xs text-gray-500">
                  Attach an image to your broadcast message
                </p>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    includeImage
                      ? 'opacity-100 max-h-[500px] scale-100 pointer-events-auto'
                      : 'opacity-0 max-h-0 scale-95 pointer-events-none'
                  }`}
                  aria-hidden={!includeImage}
                >
                  <div
                    className={`mt-3 space-y-3 ${
                      includeImage ? '' : 'invisible'
                    }`}
                  >
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-4 text-center">
                      <input
                        type="file"
                        id="imageInput"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <label
                        htmlFor="imageInput"
                        className="cursor-pointer block w-full"
                      >
                        <div className="flex flex-col items-center justify-center">
                          {imagePreviewUrl ? (
                            <div className="relative w-full h-full flex items-center justify-center">
                              <img
                                src={imagePreviewUrl}
                                alt="Selected"
                                className="max-h-[180px] w-auto mx-auto rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                                style={{ maxHeight: '160px' }}
                              />
                              <button
                                type="button"
                                onClick={removeSelectedImage}
                                className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 hover:bg-opacity-100 text-white rounded-full p-1 transition-opacity"
                                title="Remove image"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <line x1="18" y1="6" x2="6" y2="18"></line>
                                  <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <>
                              <svg
                                className="w-10 h-10 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                ></path>
                              </svg>
                              <p className="mt-2 text-sm text-gray-500">
                                Click to upload an image
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                PNG, JPG, GIF up to 2MB
                              </p>
                            </>
                          )}
                        </div>
                      </label>
                      {imagePreviewUrl && (
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <span>{selectedImage?.name}</span>
                          <span>
                            {selectedImage?.size
                              ? (selectedImage.size / 1024).toFixed(1) + ' KB'
                              : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Enable Paraphrase Option */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="enableParaphrase"
                className="mt-1 h-4 w-4"
                checked={enableParaphrase}
                onChange={() => setEnableParaphrase(!enableParaphrase)}
              />
              <div>
                <label
                  htmlFor="enableParaphrase"
                  className="font-medium text-sm"
                >
                  Enable Paraphrase
                </label>{' '}
                <p className="text-xs text-gray-500">
                  Create message variations to avoid spam filters. You can edit
                  paraphrases, use them randomly for each contact, or select a
                  single version for all messages.
                </p>{' '}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    enableParaphrase
                      ? 'opacity-100 max-h-[500px] scale-100 pointer-events-auto'
                      : 'opacity-0 max-h-0 scale-95 pointer-events-none'
                  }`}
                  aria-hidden={!enableParaphrase}
                >
                  <div className={enableParaphrase ? '' : 'invisible'}>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-4">
                        <RadioGroup
                          value={variationType}
                          onValueChange={(value) =>
                            setVariationType(value as 'random' | 'select')
                          }
                          className="flex flex-row space-x-4"
                          name="paraphraseOption"
                        >
                          <div>
                            <label
                              className="flex items-center space-x-1 cursor-pointer"
                              htmlFor="paraphrase-random"
                            >
                              <RadioGroupItem
                                value="random"
                                id="paraphrase-random"
                                className="h-3 w-3"
                              />
                              <span>Use random version</span>
                            </label>
                          </div>
                          <div>
                            <label
                              className="flex items-center space-x-1 cursor-pointer"
                              htmlFor="paraphrase-select"
                            >
                              <RadioGroupItem
                                value="select"
                                id="paraphrase-select"
                                className="h-3 w-3"
                              />
                              <span>Select one version</span>
                            </label>
                          </div>
                        </RadioGroup>
                      </div>
                      <button
                        onClick={fetchParaphrases}
                        disabled={generateLoading}
                        className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs disabled:bg-blue-400"
                      >
                        {generateLoading ? (
                          <Loader2Icon size={12} className="animate-spin" />
                        ) : (
                          <Loader2Icon size={12} />
                        )}
                        <span>
                          {generateLoading ? 'Generating...' : 'Generate'}
                        </span>
                      </button>
                    </div>
                    <div className="mt-2">
                      <ParaphraseList
                        variations={paraphraseList}
                        isLoading={generateLoading}
                        type={variationType}
                        onParaphrasesChange={(set) => setFinalParaphrase(set)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end w-full mt-6">
          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <CogIcon size={14} className="mr-2" />
                  More
                  <ChevronDown size={14} className="ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={resetAllState}
                  >
                    Reset
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <PreviewMessage
              message={messageContent || 'This is preview message'}
              image={includeImage ? imagePreviewUrl ?? undefined : undefined}
            />
            {/* <SchedulerDialog />
            <Button type="button" variant={'outline'}>
              Schedule Broadcast
            </Button> */}
            {/* Combined Button Group */}
            <div className="inline-flex gap-0.25">
              <Button
                type="button"
                className="rounded-l-sm rounded-r-none"
                disabled={sendLoading || !messageContent}
                onClick={async () => {
                  setSendLoading(true);
                  await new Promise((resolve) => setTimeout(resolve, 700));
                  setSendLoading(false);

                  // Basic validation before opening dialog
                  if (!messageContent || messageContent.trim().length === 0) {
                    toast.warning('Message content cannot be empty.');
                    return;
                  }
                  if (!contacts || contacts.length === 0) {
                    toast.error('Please add at least one contact.');
                    return;
                  }

                  setIsConfirmOpen(true);
                  setConfirmWithScheduler(false); // Set to false for immediate send
                }}
              >
                {sendLoading ? (
                  <>
                    <Loader2Icon size={16} className="animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Send Broadcast Now'
                )}
              </Button>
              <Button
                type="button"
                className="rounded-l-none rounded-r-sm"
                disabled={sendLoading || !messageContent}
                onClick={async () => {
                  setSendLoading(true);
                  await new Promise((resolve) => setTimeout(resolve, 700));
                  setSendLoading(false);

                  // Basic validation before opening dialog
                  if (!messageContent || messageContent.trim().length === 0) {
                    toast.warning('Message content cannot be empty.');
                    return;
                  }
                  if (!contacts || contacts.length === 0) {
                    toast.error('Please add at least one contact.');
                    return;
                  }

                  setIsConfirmOpen(true);
                  setConfirmWithScheduler(true); // Set to true for scheduling
                }}
              >
                <TimerIcon size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <BroadcastSendConfirm
        isOpen={isConfirmOpen}
        isScheduled={confirmWithScheduler}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleSendBroadcast}
        onReset={resetAllState}
      />
    </MainPageLayout>
  );
}
