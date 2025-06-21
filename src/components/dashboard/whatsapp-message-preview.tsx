'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { format } from 'date-fns';

interface WhatsAppMessageProps {
  message: string;
  imageUrl?: string | null;
  date?: Date;
  className?: string;
}

export function WhatsAppMessage({
  message,
  imageUrl,
  date = new Date(),
  className,
}: WhatsAppMessageProps) {
  return (
    <div
      className={cn(
        'flex flex-col max-w-[80%] ml-auto bg-[#dcf8c6] rounded-lg p-2 shadow-sm',
        className
      )}
    >
      {imageUrl && (
        <div className="mb-2 overflow-hidden rounded">
          <Image
            src={imageUrl}
            alt="Message attachment"
            width={200}
            height={200}
            className="object-cover w-full"
          />
        </div>
      )}
      <div className="text-sm break-words whitespace-pre-wrap">{message}</div>
      <div className="text-[10px] text-gray-500 ml-auto mt-1">
        {format(date, 'h:mm a')}
      </div>
    </div>
  );
}

export function WhatsAppChatPreview({
  message,
  imageUrl,
  className,
}: WhatsAppMessageProps) {
  return (
    <div
      className={cn(
        'flex flex-col w-full bg-[#e5ddd5] p-4 rounded-lg',
        className
      )}
    >
      <div className="bg-[#f0f2f5] p-2 mb-4 rounded-t-lg flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        <div className="text-sm font-medium">WhatsApp Preview</div>
      </div>
      <div className="flex flex-col gap-3 p-2">
        <WhatsAppMessage
          message={message}
          imageUrl={imageUrl}
          date={new Date()}
        />
      </div>
    </div>
  );
}
