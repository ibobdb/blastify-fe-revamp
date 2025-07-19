'use client';

import { format } from 'date-fns';
import {
  Calendar,
  Clock,
  MessageSquare,
  Phone,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DataMessage {
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

interface HistoryDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  historyItem: DataMessage | null;
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'sent':
    case 'delivered':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'failed':
    case 'error':
      return <XCircle className="w-4 h-4 text-red-500" />;
    case 'pending':
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    default:
      return <AlertCircle className="w-4 h-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'sent':
    case 'delivered':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'failed':
    case 'error':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

const getAckStatusInfo = (status: string) => {
  switch (status) {
    case '-1':
      return { variant: 'destructive' as const, label: 'Error' };
    case '0':
      return { variant: 'secondary' as const, label: 'Pending' };
    case '1':
      return { variant: 'default' as const, label: 'Server' };
    case '2':
      return { variant: 'outline' as const, label: 'Sent' };
    case '3':
      return { variant: 'default' as const, label: 'Read' };
    case '4':
      return { variant: 'secondary' as const, label: 'Played' };
    default:
      return { variant: 'outline' as const, label: status };
  }
};

export function HistoryDetailDialog({
  open,
  onOpenChange,
  historyItem,
}: HistoryDetailDialogProps) {
  if (!historyItem) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Message Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <div className="flex items-center gap-2">
                {getStatusIcon(historyItem.status)}
                <Badge className={getStatusColor(historyItem.status)}>
                  {getAckStatusInfo(historyItem.status).label}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Source
              </label>
              <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                {historyItem.source}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </label>
            <p className="text-sm font-mono bg-muted px-3 py-2 rounded">
              {historyItem.number}
            </p>
          </div>

          {/* Message Content */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Message Content
            </label>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">
                {historyItem.content}
              </p>
            </div>
          </div>

          {/* Media URL */}
          {historyItem.mediaUrl && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Media
              </label>
              <div className="space-y-3">
                {/* Check if the URL is an image */}
                {/\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i.test(
                  historyItem.mediaUrl
                ) ? (
                  <div className="space-y-2">
                    <div className="border rounded-lg overflow-hidden bg-muted/30">
                      <img
                        src={historyItem.mediaUrl}
                        alt="Message attachment"
                        className="max-w-full h-auto max-h-96 object-contain"
                        onError={(e) => {
                          // If image fails to load, hide it and show the URL instead
                          e.currentTarget.style.display = 'none';
                          const parent =
                            e.currentTarget.parentElement?.parentElement;
                          const urlFallback =
                            parent?.querySelector('.url-fallback');
                          if (urlFallback) {
                            urlFallback.classList.remove('hidden');
                          }
                        }}
                      />
                    </div>
                    <div className="url-fallback hidden">
                      <a
                        href={historyItem.mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 break-all"
                      >
                        {historyItem.mediaUrl}
                      </a>
                    </div>
                  </div>
                ) : (
                  /* For non-image media, show as a link */
                  <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/30">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Media File</p>
                      <a
                        href={historyItem.mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 break-all"
                      >
                        {historyItem.mediaUrl}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error Information */}
          {historyItem.error && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-red-600 dark:text-red-400">
                Error Details
              </label>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200">
                  {historyItem.error}
                </p>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Created At
              </label>
              <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                {format(new Date(historyItem.createdAt), 'PPpp')}
              </p>
            </div>

            {historyItem.scheduleDate && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Scheduled For
                </label>
                <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  {format(new Date(historyItem.scheduleDate), 'PPpp')}
                </p>
              </div>
            )}
          </div>

          {/* WhatsApp Specific Information */}
          {(historyItem.whatsappMsgId ||
            historyItem.ackStatus ||
            historyItem.deliveredAt ||
            historyItem.readAt ||
            historyItem.playedAt) && (
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium text-sm text-muted-foreground">
                WhatsApp Details
              </h4>

              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                {historyItem.whatsappMsgId && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Message ID
                    </label>
                    <p className="text-xs font-mono bg-muted px-2 py-1 rounded break-all">
                      {historyItem.whatsappMsgId}
                    </p>
                  </div>
                )}
                {historyItem.deliveredAt && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Delivered
                    </label>
                    <p className="text-xs font-mono bg-muted px-2 py-1 rounded">
                      {format(new Date(historyItem.deliveredAt), 'PP pp')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Message ID */}
          <div className="space-y-2 border-t pt-4">
            <label className="text-sm font-medium text-muted-foreground">
              Record ID
            </label>
            <p className="text-xs font-mono bg-muted px-2 py-1 rounded break-all">
              {historyItem.id}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
