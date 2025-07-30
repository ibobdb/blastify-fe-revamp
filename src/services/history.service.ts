import api from './api';
import { Pagination } from '@/types/pagination';

export interface HistoryResponse {
  status: boolean;
  message: string;
  data: {
    data: DataMessage[];
    pagination: Pagination;
    summary: HistorySummary;
  };
}
export interface DataMessage {
  id: string;
  number: string;
  content: string;
  status: string;
  mediaUrl: string | null;
  error: string | null;
  scheduleDate: string;
  createdAt: string;
  whatsappMsgId: string | null;
  ackStatus: string | null;
  deliveredAt: string | null;
  readAt: string | null;
  playedAt: string | null;
  source: string;
}
interface HistoryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
}

interface PeriodStats {
  days: number;
  count: number;
  percentage: number;
  changeFromPrevious: number;
}

interface StatusSummary {
  status: string;
  total: number;
  percentage: number;
  periods: {
    last7Days: PeriodStats;
    last30Days: PeriodStats;
    last90Days: PeriodStats;
  };
}

export interface HistorySummary {
  total: number;
  byStatus: StatusSummary[];
  byPeriod: {
    last7Days: PeriodStats;
    last30Days: PeriodStats;
    last90Days: PeriodStats;
  };
}
export const historyService = {
  getHistory: async (params: HistoryParams): Promise<HistoryResponse> => {
    try {
      const response = await api.get(`/message`, { params });
      if (!response.data.status) {
        throw new Error(response.data.message || 'Failed to fetch history');
      }
      return response.data as HistoryResponse;
    } catch (error) {
      throw error;
    }
  },
};
