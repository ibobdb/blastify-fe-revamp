import api from './api';
import type {
  UserListResponse,
  addQuotaRequest,
  addQuotaResponse,
} from '@/types/admin';
export const adminService = {
  async getListUsers(): Promise<UserListResponse> {
    try {
      const response = await api.get('/users');

      // Ensure the response matches UserListResponse
      const userListResponse: UserListResponse = {
        success: response.data.status || true, // Default to true if status not provided
        message: response.data.message || 'Users retrieved successfully',
        data: response.data.data || [],
      };
      return userListResponse;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
  async addQuota({
    userId,
    amount,
  }: addQuotaRequest): Promise<addQuotaResponse> {
    try {
      const response = await api.post('/quota/add-quota', { userId, amount });

      // Ensure the response matches addQuotaResponse
      const addQuotaResponse: addQuotaResponse = {
        status: response.data.status || true, // Default to true if status not provided
        message: response.data.message || 'Quota added successfully',
        data: {
          userId: response.data.data?.userId || userId,
          addedAmount: response.data.data?.addedAmount || amount,
        },
      };
      return addQuotaResponse;
    } catch (error) {
      console.error('Error adding quota:', error);
      throw error;
    }
  },
};
