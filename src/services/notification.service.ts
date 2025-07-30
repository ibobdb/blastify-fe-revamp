import api from './api';

interface NotificationRequest {
  limit?: number;
  page?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  type?: string;
  priority?: string;
  isRead?: boolean;
}
interface NotificationResponse {
  status: boolean;
  message: string;
  data: {
    notifications: Notification[];
    unreadCount: number;
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}
interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  priority: string;
  data: {
    reason: string;
  };
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}
interface NotificationIds {
  notificationIds?: string[];
}
interface NotificationReadResponse {
  status: boolean;
  message: string;
}
export const notificarionService = {
  async getNotifications(
    params: NotificationRequest
  ): Promise<NotificationResponse> {
    try {
      const response = await api.get('/notification', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async markAsRead(
    notificationId: NotificationIds
  ): Promise<NotificationReadResponse> {
    try {
      const response = await api.put(`/notification/read`, {
        notificationId,
      });
      if (!response.data.status) {
        throw new Error(
          response.data.message || 'Failed to mark notification as read'
        );
      }
      return {
        status: response.data.status,
        message: response.data.message,
      };
    } catch (error) {
      throw error;
    }
  },
  async deleteNotifications(
    notificationId: NotificationIds
  ): Promise<NotificationReadResponse> {
    try {
      const response = await api.delete(`/notification`, {
        data: notificationId,
      });
      if (!response.data.status) {
        throw new Error(
          response.data.message || 'Failed to delete notifications'
        );
      }
      return {
        status: response.data.status,
        message: response.data.message,
      };
    } catch (error) {
      throw error;
    }
  },
};
