import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { CalendarDays, Clock, CheckCircle2 } from 'lucide-react';

export function SchedulerDialog() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [scheduled, setScheduled] = useState(false);
  const [error, setError] = useState('');

  const handleSchedule = () => {
    setError('');
    if (!date || !time) {
      setError('Please select both date and time.');
      return;
    }
    setScheduled(true);
    setTimeout(() => {
      setScheduled(false);
      setOpen(false);
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-white rounded px-4 py-2 mb-2"
      >
        Schedule
      </Button>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Broadcast</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p className="text-sm text-gray-600 bg-gray-50 rounded px-3 py-2 border border-gray-200 mb-2">
            Select a date and time to schedule your broadcast. The message will
            be sent automatically at your chosen time. You can review or cancel
            scheduled broadcasts before they are sent.
          </p>
          {/* Date input */}
          <div className="flex items-center gap-2">
            <CalendarDays className="text-blue-600" size={20} />
            <label className="block text-sm font-medium mb-1">Date</label>
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          />
          {/* Time input */}
          <div className="flex items-center gap-2 mt-2">
            <Clock className="text-blue-600" size={20} />
            <label className="block text-sm font-medium mb-1">Time</label>
          </div>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          />
          {/* Error message */}
          {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
          {/* Scheduled confirmation */}
          {scheduled && (
            <div className="flex items-center gap-2 text-green-600 mt-2 animate-fade-in">
              <CheckCircle2 size={18} />
              <span>
                Broadcast scheduled for {date} at {time}
              </span>
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleSchedule}
            className="bg-blue-600 text-white"
            disabled={scheduled}
          >
            {scheduled ? 'Scheduled!' : 'Schedule'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
