import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import {
  Bell,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  UserPlus,
  Calendar,
  Settings,
  Zap,
  MoreHorizontal,
  X,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { notificarionService } from '@/services/notification.service';

// Update the local interface to match the service interface
interface NotificationData {
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

interface LocalNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  timestamp: string;
  isRead: boolean;
  avatar?: string;
  actionType?: 'message' | 'user' | 'system' | 'broadcast' | 'device';
  priority: string;
}

// Helper function to convert API notification to local format
const convertToLocalNotification = (
  notification: NotificationData
): LocalNotification => {
  // Map notification type to UI type
  const getUIType = (
    type: string,
    priority: string
  ): LocalNotification['type'] => {
    switch (type.toLowerCase()) {
      case 'success':
        return 'success';
      case 'error':
      case 'failed':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return priority === 'high' ? 'warning' : 'info';
    }
  };

  // Map notification type to action type
  const getActionType = (type: string): LocalNotification['actionType'] => {
    switch (type.toLowerCase()) {
      case 'broadcast':
        return 'broadcast';
      case 'user':
      case 'registration':
        return 'user';
      case 'device':
      case 'connection':
        return 'device';
      case 'message':
        return 'message';
      case 'system':
      case 'maintenance':
        return 'system';
      default:
        return 'system';
    }
  };

  // Format timestamp
  const formatTimestamp = (createdAt: string): string => {
    const now = new Date();
    const notificationDate = new Date(createdAt);
    const diffInMinutes = Math.floor(
      (now.getTime() - notificationDate.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60)
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7)
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

    return notificationDate.toLocaleDateString();
  };

  return {
    id: notification.id,
    title: notification.title,
    message: notification.body,
    type: getUIType(notification.type, notification.priority),
    timestamp: formatTimestamp(notification.createdAt),
    isRead: notification.isRead,
    priority: notification.priority,
    actionType: getActionType(notification.type),
  };
};

const getNotificationIcon = (
  type: LocalNotification['type'],
  actionType?: LocalNotification['actionType']
) => {
  if (actionType === 'broadcast') return <Zap className="h-4 w-4" />;
  if (actionType === 'user') return <UserPlus className="h-4 w-4" />;
  if (actionType === 'device') return <Settings className="h-4 w-4" />;
  if (actionType === 'message') return <MessageSquare className="h-4 w-4" />;
  if (actionType === 'system') return <Calendar className="h-4 w-4" />;

  switch (type) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'warning':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'info':
    default:
      return <Bell className="h-4 w-4 text-blue-500" />;
  }
};

const getBadgeVariant = (type: LocalNotification['type']) => {
  switch (type) {
    case 'success':
      return 'default';
    case 'warning':
      return 'secondary';
    case 'error':
      return 'destructive';
    case 'info':
    default:
      return 'outline';
  }
};

export function NotificationList() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [notifications, setNotifications] = useState<LocalNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificarionService.getNotifications({
        limit: 20,
        page: 1,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      if (response.status) {
        const localNotifications = response.data.notifications.map(
          convertToLocalNotification
        );
        setNotifications(localNotifications);
        setUnreadCount(response.data.unreadCount);
      } else {
        setError(response.message || 'Failed to fetch notifications');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  // Mark notifications as read
  const markAsRead = async (notificationIds: string[]) => {
    try {
      await notificarionService.markAsRead({ notificationIds });
      // Refresh notifications after marking as read
      fetchNotifications();
    } catch (err) {
      console.error('Error marking notifications as read:', err);
    }
  };

  // Delete notifications
  const deleteNotifications = async (notificationIds: string[]) => {
    try {
      await notificarionService.deleteNotifications({ notificationIds });
      // Refresh notifications after deletion
      fetchNotifications();
    } catch (err) {
      console.error('Error deleting notifications:', err);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
    if (unreadIds.length > 0) {
      await markAsRead(unreadIds);
    }
  };

  // Clear all notifications
  const clearAll = async () => {
    try {
      // Call deleteNotifications with no payload to clear all
      await notificarionService.deleteNotifications({});
      // Refresh notifications after deletion
      fetchNotifications();
    } catch (err) {
      console.error('Error clearing all notifications:', err);
    }
  };

  // Fetch notifications on component mount and when opened
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={notificationRef}>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Notifications"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>
      {isOpen && (
        <Card className="absolute top-14 right-0 w-96 z-[100] shadow-lg animate-in fade-in-0 zoom-in-95 duration-200 slide-in-from-top-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={
                    isExpanded
                      ? 'Collapse notifications'
                      : 'Expand notifications'
                  }
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          {isExpanded && (
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-32 text-red-500">
                  <p className="text-sm">{error}</p>
                </div>
              ) : (
                <ScrollArea className="h-[350px]">
                  <div className="px-2 pb-4 space-y-2">
                    {notifications.length === 0 ? (
                      <div className="flex items-center justify-center h-32 text-muted-foreground">
                        <p className="text-sm">No notifications</p>
                      </div>
                    ) : (
                      notifications.map((notification, index) => (
                        <div key={notification.id}>
                          <div
                            className={`group flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors ${
                              !notification.isRead ? 'bg-muted/30' : ''
                            }`}
                          >
                            <div className="flex-shrink-0 mt-1">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={notification.avatar} />
                                <AvatarFallback className="bg-primary/10">
                                  {getNotificationIcon(
                                    notification.type,
                                    notification.actionType
                                  )}
                                </AvatarFallback>
                              </Avatar>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4
                                      className={`text-xs font-medium leading-none ${
                                        !notification.isRead
                                          ? 'font-semibold'
                                          : ''
                                      }`}
                                    >
                                      {notification.title}
                                    </h4>
                                    {!notification.isRead && (
                                      <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge
                                      variant={getBadgeVariant(
                                        notification.type
                                      )}
                                      className="text-xs"
                                    >
                                      {notification.type}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {notification.timestamp}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Mark as read"
                                    disabled={notification.isRead}
                                    onClick={() =>
                                      markAsRead([notification.id])
                                    }
                                  >
                                    <Check
                                      className={`h-3 w-3 ${
                                        notification.isRead
                                          ? 'text-green-500'
                                          : ''
                                      }`}
                                    />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Dismiss notification"
                                    onClick={() =>
                                      deleteNotifications([notification.id])
                                    }
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                          {index < notifications.length - 1 && (
                            <Separator className="my-2" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              )}

              <div className="px-4 py-3 border-t">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={markAllAsRead}
                    disabled={loading || unreadCount === 0}
                  >
                    Mark All Read
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={clearAll}
                    disabled={loading || notifications.length === 0}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
