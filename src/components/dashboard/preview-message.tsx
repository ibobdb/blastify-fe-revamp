import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCheck, Check } from 'lucide-react';

interface PreviewMessageProps {
  message: string;
  image?: string;
}

// Helper to format WhatsApp message
function formatWhatsappMessage(text: string) {
  // Replace monospace first
  text = text.replace(
    /```([\s\S]*?)```/g,
    '<code class="whatsapp-mono">$1</code>'
  );
  // Bold
  text = text.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
  // Italic
  text = text.replace(/_([^_]+)_/g, '<em>$1</em>');
  // Strikethrough
  text = text.replace(
    /~([^~]+)~/g,
    '<span style="text-decoration:line-through">$1</span>'
  );
  // Line breaks
  text = text.replace(/\\n|\n/g, '<br/>');
  return text;
}

export function PreviewMessage({ message, image }: PreviewMessageProps) {
  // Get current time in HH:mm AM/PM format
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  const displayMinute = minutes < 10 ? `0${minutes}` : minutes;
  const currentTime = `${displayHour}:${displayMinute} ${ampm}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'outline'} className="animate-pulse">
          Preview Message
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs rounded-2xl p-0 overflow-hidden">
        <DialogHeader className="bg-[#4A90E2] px-6 py-3">
          <DialogTitle className="text-white text-base font-semibold">
            Message Preview
          </DialogTitle>
        </DialogHeader>
        <div className="bg-[#ece5dd] px-6 pt-4 pb-2 min-h-[350px] flex flex-col justify-end relative">
          <div className="absolute left-6 top-2 flex items-center gap-1 z-10">
            <span className="inline-block w-2 h-2 bg-[#25d366] rounded-full mr-1"></span>
            <span className="text-xs text-[#b1b1b1]">
              Messages to this chat are secured with end-to-end encryption
            </span>
          </div>
          <div className="flex flex-col items-end mt-6">
            <div className="bg-[#dcf8c6] rounded-xl p-0 text-sm text-gray-800 shadow w-fit max-w-full relative whatsapp-bubble overflow-hidden flex flex-col">
              {image && (
                <div className="overflow-hidden rounded-t-xl">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full max-w-[260px] max-h-[220px] object-cover align-top"
                    style={{ display: 'block', background: '#fff' }}
                  />
                </div>
              )}
              <div className="px-4 pt-2 pb-1 w-full flex flex-col max-w-[260px] break-words overflow-x-auto">
                <span
                  className="break-words text-left w-full whitespace-pre-line"
                  style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                  dangerouslySetInnerHTML={{
                    __html: formatWhatsappMessage(message),
                  }}
                />
                <div className="flex items-center justify-end mt-1 space-x-1 text-[11px] text-gray-500">
                  <span className="whitespace-nowrap">{currentTime}</span>
                  <CheckCheck size={15} stroke="#4A90E2" strokeWidth={1.5} />
                </div>
              </div>
              <span className="absolute right-0 bottom-0 w-0 h-0 border-t-[10px] border-t-[#dcf8c6] border-l-[10px] border-l-transparent"></span>
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 ">
          Preview shows how your message will appear to recipients
        </div>
        <DialogFooter className="pb-4">
          <div className="w-full flex justify-center">
            <DialogTrigger asChild>
              <Button>Close</Button>
            </DialogTrigger>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
