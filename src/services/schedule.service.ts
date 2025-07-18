import api from '@/services/api';

export interface ScheduleResponse {
  status: boolean;
  message: string;
  data: {
    schedulers: Schedule[];
    pagination: Pagination;
  };
}
export interface ScheduleRequest {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
}
export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
export interface ScheduleCancelResponse {
  status: boolean;
  message: string;
  data: {
    schedulerId: string;
    messagesCancelled: number;
  };
}
export interface Schedule {
  id: string;
  scheduleDate: string;
  messageCount: number;
  status: ScheduleStatus;
  createdAt: string;
  updatedAt: string;
}
type ScheduleStatus =
  | 'pending'
  | 'completed'
  | 'cancelled'
  | 'failed'
  | 'scheduled';

export const scheduleService = {
  /**
   * Fetches the schedule data from the server.
   * @param {ScheduleRequest} params - The request parameters for fetching schedules.
   * @returns {Promise<ScheduleResponse>} A promise that resolves to the schedule response.
   */
  async fetchSchedules(params?: ScheduleRequest): Promise<ScheduleResponse> {
    const response = await api.get('/scheduler', { params });
    if (!response.data.status) {
      throw new Error('Failed to fetch schedules');
    }
    return response.data as ScheduleResponse;
  },

  async cancelSchedule(scheduleId: string): Promise<ScheduleCancelResponse> {
    const response = await api.delete(`/scheduler/${scheduleId}`, {
      method: 'POST',
    });
    if (!response.data.status) {
      throw new Error('Failed to cancel schedule');
    }
    return response.data as ScheduleCancelResponse;
  },
};
