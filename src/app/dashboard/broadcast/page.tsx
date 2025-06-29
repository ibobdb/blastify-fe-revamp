'use client';
import { ImportIcon, TrashIcon, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import ParaphraseList from '@/components/dashboard/paraphrase-list';
import broadcastService from '@/services/broadcast.service';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import BroadcastContactManagement from '@/components/dashboard/broadcast-contact-management';

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
  const [paraphraseList, setParaphraseList] = useState<string[]>([]);
  const [messageContent, setMessageContent] = useState('');
  const [variationType, setVariationType] = useState<'random' | 'select'>(
    'random'
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [includeImage, setIncludeImage] = useState(false);

  // Form setup with React Hook Form
  const { register } = useForm<MessageFormValues>({
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
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Broadcast</h1>
          <p className="text-muted-foreground mt-1">
            Send messages to multiple contacts or groups at once. Use this
            feature to reach a wider audience quickly.
          </p>
        </div>
      </div>{' '}
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

                <BroadcastContactManagement />
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-semibold mb-2">Message Options</h3>
            {/* Include Image Option */}{' '}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="includeImage"
                className="mt-1 h-4 w-4"
                checked={includeImage}
                onChange={() => setIncludeImage(!includeImage)}
              />
              <div>
                <label htmlFor="includeImage" className="font-medium text-sm">
                  Include Image
                </label>
                <p className="text-xs text-gray-500">
                  Attach an image to your broadcast message
                </p>

                {includeImage && (
                  <div className="mt-3 space-y-3">
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
                        <div className="flex flex-col items-center justify-center py-3">
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
                        </div>
                      </label>{' '}
                      {imagePreviewUrl && (
                        <div className="mt-4">
                          <div className="relative">
                            <img
                              src={imagePreviewUrl}
                              alt="Selected"
                              className="max-h-[180px] w-auto mx-auto rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
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
                          <div className="flex justify-between mt-1 text-xs text-gray-500">
                            <span>{selectedImage?.name}</span>
                            <span>
                              {selectedImage?.size
                                ? (selectedImage.size / 1024).toFixed(1) + ' KB'
                                : ''}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
                {enableParaphrase && (
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-4">
                      <div className="group relative">
                        <label className="flex items-center space-x-1 cursor-pointer">
                          <input
                            type="radio"
                            name="paraphraseOption"
                            defaultChecked
                            onChange={(e) =>
                              e.target.value == 'on' &&
                              setVariationType('random')
                            }
                            className="h-3 w-3"
                          />
                          <span>Use random version</span>
                        </label>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
                          Send a different version to each contact
                        </div>
                      </div>
                      <div className="group relative">
                        <label className="flex items-center space-x-1 cursor-pointer">
                          <input
                            type="radio"
                            name="paraphraseOption"
                            className="h-3 w-3"
                            onChange={(e) =>
                              e.target.value == 'on' &&
                              setVariationType('select')
                            }
                          />
                          <span>Select one version</span>
                        </label>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
                          Use the same version for all contacts
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={fetchParaphrases}
                      disabled={generateLoading}
                      className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs disabled:bg-blue-400"
                    >
                      {generateLoading ? (
                        <RefreshCcw size={12} className="animate-spin" />
                      ) : (
                        <RefreshCcw size={12} />
                      )}
                      <span>
                        {generateLoading ? 'Generating...' : 'Generate'}
                      </span>
                    </button>
                  </div>
                )}
                {enableParaphrase && (
                  <div className="mt-2">
                    <ParaphraseList
                      variations={paraphraseList}
                      isLoading={generateLoading}
                      type={'random'}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end w-full mt-6">
          <div className="flex gap-3">
            <button
              type="button"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              Send Broadcast Now
            </button>
            <button
              type="button"
              className="border border-blue-600 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              Schedule Broadcast
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
