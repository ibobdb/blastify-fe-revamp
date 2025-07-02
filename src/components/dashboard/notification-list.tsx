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

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  timestamp: string;
  isRead: boolean;
  avatar?: string;
  actionType?: 'message' | 'user' | 'system' | 'broadcast' | 'device';
}

const dummyNotifications: Notification[] = [
  {
    id: '1',
    title: 'Message Sent Successfully',
    message: 'Your broadcast to 250 contacts has been delivered successfully.',
    type: 'success',
    timestamp: '2 minutes ago',
    isRead: false,
    actionType: 'broadcast',
  },
  {
    id: '2',
    title: 'New User Registration',
    message: 'John Doe has registered and is pending verification.',
    type: 'info',
    timestamp: '15 minutes ago',
    isRead: false,
    actionType: 'user',
  },
  {
    id: '3',
    title: 'Device Connection Failed',
    message:
      'Unable to connect to WhatsApp device. Please check your connection.',
    type: 'error',
    timestamp: '1 hour ago',
    isRead: true,
    actionType: 'device',
  },
  {
    id: '4',
    title: 'Scheduled Message',
    message: 'Your scheduled message for 3:00 PM has been sent.',
    type: 'success',
    timestamp: '2 hours ago',
    isRead: true,
    actionType: 'message',
  },
  {
    id: '5',
    title: 'System Maintenance',
    message: 'System maintenance is scheduled for tonight at 11:00 PM.',
    type: 'warning',
    timestamp: '3 hours ago',
    isRead: false,
    actionType: 'system',
  },
  {
    id: '6',
    title: 'Contact Import Complete',
    message: 'Successfully imported 150 contacts from CSV file.',
    type: 'success',
    timestamp: '1 day ago',
    isRead: true,
    actionType: 'system',
  },
  {
    id: '7',
    title: 'Message Delivery Failed',
    message: 'Failed to deliver message to 5 contacts due to invalid numbers.',
    type: 'error',
    timestamp: '2 days ago',
    isRead: true,
    actionType: 'broadcast',
  },
  {
    id: '8',
    title: 'New Message Received',
    message: 'You have received a new message from a contact.',
    type: 'info',
    timestamp: '3 days ago',
    isRead: true,
    actionType: 'message',
  },
];

const getNotificationIcon = (
  type: Notification['type'],
  actionType?: Notification['actionType']
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

const getBadgeVariant = (type: Notification['type']) => {
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
  const notificationRef = useRef<HTMLDivElement>(null);
  const unreadCount = dummyNotifications.filter((n) => !n.isRead).length;

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
              <ScrollArea className="h-[350px]">
                <div className="px-2 pb-4 space-y-2">
                  {dummyNotifications.map((notification, index) => (
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
                                    !notification.isRead ? 'font-semibold' : ''
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
                                  variant={getBadgeVariant(notification.type)}
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
                              >
                                <Check
                                  className={`h-3 w-3 ${
                                    notification.isRead ? 'text-green-500' : ''
                                  }`}
                                />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Dismiss notification"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {index < dummyNotifications.length - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  ))}{' '}
                </div>
              </ScrollArea>

              <div className="px-4 py-3 border-t">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Mark All Read
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
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
