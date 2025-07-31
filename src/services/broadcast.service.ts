// Create a broadcast-specific logger instance
import api from '@/services/api';
export interface BroadcastMessage {
  content: string;
  numbers: string[];
  media?: File | string | null; // File or URL of the media to send
  variations?: string[];
  scheduleDate?: string;
}

export interface BroadcastSendResponse {
  status: boolean;
  message: string;
  data: {
    messageCount: number;
    hasMedia: boolean;
    usingVariations: boolean;
  };
}
export interface ParaphraseRequest {
  content: string;
}
export interface ParaphraseResponse {
  status: string;
  message: string;
  data: {
    variations: string[];
  };
}
export interface Contact {
  name: string;
  number: string;
}

export interface ImportContactResponse {
  status: string;
  message: string;
  data: {
    count: number;
    contacts: Contact[];
  };
}
const broadcastService = {
  sendBroadcast: async (
    broadcastData: BroadcastMessage
  ): Promise<BroadcastSendResponse> => {
    // Sending broadcast message

    try {
      // Validate input data
      if (
        !broadcastData.content ||
        !broadcastData.numbers ||
        broadcastData.numbers.length === 0
      ) {
        throw new Error(
          'Content and at least one recipient number are required'
        );
      }

      // Prepare the request payload
      const payload = {
        content: broadcastData.content,
        numbers: broadcastData.numbers,
        media: broadcastData.media || null,
        variations: broadcastData.variations || [],
        scheduleDate: broadcastData.scheduleDate || '',
      };

      // Send the request to the API
      const response = await api.post<BroadcastSendResponse>(
        '/message/send-messages',
        payload,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // atau header lain sesuai kebutuhan
          },
        }
      );

      // Log the response
      // Broadcast message sent successfully

      return response.data;
    } catch (error) {
      // Log the error
      // Failed to send broadcast message
      throw error;
    }
  },
  generateParaphrase: async (content: string): Promise<ParaphraseResponse> => {
    // Generating paraphrase
    try {
      // Validate input data
      if (!content || !content.trim()) {
        throw new Error('Content is required for paraphrasing');
      }
      const response = await api.post<ParaphraseResponse>(
        '/message/paraphrase',
        { content }
      );
      return response.data;
    } catch (error) {
      // Failed to generate paraphrase
      throw error;
    }
  },
  importContact: async (): Promise<ImportContactResponse> => {
    try {
      // Importing contacts
      // Send the request to the API
      const response = await api.get<ImportContactResponse>(
        '/client/get-contact'
      );
      // broadcastLogger.info('Contacts imported successfully', { response });
      return response.data;
    } catch (error) {
      // Failed to import contacts
      throw error;
    }
  },
};

export default broadcastService;
