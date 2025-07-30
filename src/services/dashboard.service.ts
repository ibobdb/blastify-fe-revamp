export interface DashboardSummaryRequest {
  start_date: string;
  end_date: string;
}

export interface DashboardSummaryResponse {
  success: boolean;
  message: string;
  data: {
    totalDevices: number;
    broadcastSent: number;
    activeSchedules: number;
    currentQuota: number;
  };
}

export interface DashboardBroadcastActivityRequest {
  start_date: string;
  end_date: string;
}

export interface DashboardBroadcastActivityResponse {
  success: boolean;
  message: string;
  data: {
    date: string;
    count: number;
  }[];
}

import api from '@/services/api';

export const dashboardService = {
  async getDashboardSummary(
    request: DashboardSummaryRequest
  ): Promise<DashboardSummaryResponse> {
    try {
      const response = await api.get<DashboardSummaryResponse>(
        '/dashboard/summary',
        {
          params: {
            start_date: request.start_date,
            end_date: request.end_date,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async getBroadcastActivity(
    request: DashboardBroadcastActivityRequest
  ): Promise<DashboardBroadcastActivityResponse> {
    try {
      const response = await api.get<DashboardBroadcastActivityResponse>(
        '/dashboard/broadcastActivity',
        {
          params: {
            start_date: request.start_date,
            end_date: request.end_date,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
