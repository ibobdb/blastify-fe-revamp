'use client';

import * as React from 'react';
import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface DateTimePickerProps {
  value?: Date | null;
  onChange?: (value: { date: Date | null; isValid: boolean }) => void;
  minToday?: boolean; // Optional: restrict to today or later
}

export function DateTimePicker({
  value,
  onChange,
  minToday,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | null>(value ?? new Date());
  const [time, setTime] = React.useState<string>(
    value
      ? value.toTimeString().slice(0, 8)
      : new Date().toTimeString().slice(0, 8)
  );
  const [error, setError] = React.useState<string | null>(null);

  // Helper: is selected date today?
  const isToday = date && new Date().toDateString() === date.toDateString();

  // Helper: get min time string (HH:mm:ss) for today + 5 min, else undefined
  let minTime: string | undefined = undefined;
  if (isToday) {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    minTime = now.toTimeString().slice(0, 8);
  }

  React.useEffect(() => {
    setError(null);
    let localError: string | null = null;
    let isValid = true;
    let resultDate: Date | null = null;
    if (date && time) {
      // Validation: minToday
      if (minToday) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selected = new Date(date);
        selected.setHours(0, 0, 0, 0);
        if (selected < today) {
          localError = 'Date cannot be before today.';
        }
      }
      // Validation: time at least 5 min in future if today
      if (!localError && isToday) {
        const [h, m, s] = time.split(':').map(Number);
        const selectedDate = new Date(date);
        selectedDate.setHours(h, m, s || 0, 0);
        const now = new Date();
        now.setSeconds(0, 0);
        now.setMinutes(now.getMinutes() + 5);
        if (selectedDate < now) {
          localError = 'Time must be at least 5 minutes in the future.';
        }
      }
      if (localError) {
        setError(localError);
        isValid = false;
      } else {
        setError(null);
        isValid = true;
      }
      const [h, m, s] = time.split(':').map(Number);
      resultDate = new Date(date);
      resultDate.setHours(h);
      resultDate.setMinutes(m);
      resultDate.setSeconds(s);
      onChange?.({ date: resultDate, isValid });
    } else if (!date) {
      setError(null);
      isValid = false;
      onChange?.({ date: null, isValid });
    }
    // eslint-disable-next-line
  }, [date, time, minToday]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4">
        <div className="flex flex-col gap-3">
          <Label htmlFor="date-picker" className="px-1">
            Date
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date-picker"
                className="w-32 justify-between font-normal"
              >
                {date ? date.toLocaleDateString() : 'Select date'}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={date ?? undefined}
                captionLayout="dropdown"
                onSelect={(d) => {
                  setDate(d ?? null);
                  setOpen(false);
                }}
                disabled={
                  minToday
                    ? (d) => d < new Date(new Date().setHours(0, 0, 0, 0))
                    : undefined
                }
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="time-picker" className="px-1">
            Time
          </Label>
          <Input
            type="time"
            id="time-picker"
            step="1"
            value={time}
            min={minTime}
            onChange={(e) => setTime(e.target.value)}
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </div>
      </div>
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
}
