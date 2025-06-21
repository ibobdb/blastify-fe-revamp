'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { WhatsAppChatPreview } from './whatsapp-message-preview';
import { Button } from '../ui/button';

interface MessagePreviewDialogProps {
  message: string;
  imageUrl?: string | null;
  trigger?: React.ReactNode;
  onSend: () => void;
}

export function MessagePreviewDialog({
  message,
  imageUrl,
  trigger,
  onSend,
}: MessagePreviewDialogProps) {
  const [open, setOpen] = React.useState(false);

  const handleSend = () => {
    onSend();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Preview Message</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Message Preview</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <WhatsAppChatPreview message={message} imageUrl={imageUrl} />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend}>Send Message</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
