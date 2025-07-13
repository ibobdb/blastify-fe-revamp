import api from './api';

interface CreateApiKeyResponse {
  status: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    key: string;
    isActive: boolean;
    expiresAt: string;
    createdAt: string;
  };
}
interface GetApiKeysResponse {
  status: boolean;
  message: string;
  data: {
    data: Array<{
      id: string;
      name: string;
      key: string;
      isActive: boolean;
      lastUsedAt: string | null;
      expiresAt: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    pagination: {
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}
interface CreateApiRequest {
  name: string;
  expiresAt?: string;
}

interface UpdateApiKeyRequest {
  name?: string;
  isActive?: boolean;
  expiresAt?: string;
}

interface DeleteApiKeyResponse {
  status: boolean;
  message: string;
}
export const apiManagementService = {
  async createApiKey(data: CreateApiRequest): Promise<CreateApiKeyResponse> {
    try {
      const response = await api.post('/api-keys/management', data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to create API key'
      );
    }
  },

  async getApiKeys(
    page: number = 1,
    limit: number = 10
  ): Promise<GetApiKeysResponse> {
    try {
      const response = await api.get('/api-keys/management', {
        params: { page, limit },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch API keys'
      );
    }
  },

  // endpoint: '/api-management/keys/:id' PUT,
  async updateApiKey(
    id: string,
    data: UpdateApiKeyRequest
  ): Promise<CreateApiKeyResponse> {
    try {
      const response = await api.put(`/api-management/keys/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to update API key'
      );
    }
  },

  // endpoint: '/api-management/keys/:id' DELETE,
  async deleteApiKey(id: string): Promise<DeleteApiKeyResponse> {
    try {
      const response = await api.delete(`/api-management/keys/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to delete API key'
      );
    }
  },
};
