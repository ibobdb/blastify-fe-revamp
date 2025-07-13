import api from './api';
interface QuotaResponse {
  status: boolean;
  message: string;
  data: {
    userId: string;
    balance: number;
    lockedAmount: number;
    availableBalance: number;
  };
}

export const quotaService = {
  async getQuota(): Promise<QuotaResponse> {
    try {
      const response = await api.get('/quota/check-quota');

      if (!response.status) {
        throw new Error('Failed to fetch quota');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching quota:', error);
      throw error;
    }
  },
};
