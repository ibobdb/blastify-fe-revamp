'use client';

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface SendProgressProps {
  total: number;
  sent: number;
  failed: number;
  scheduled: number;
}

export function SendProgress({
  total,
  sent,
  failed,
  scheduled,
}: SendProgressProps) {
  const progress = total > 0 ? Math.floor(((sent + failed) / total) * 100) : 0;

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium">Broadcast Progress</h3>
          <span className="text-sm font-medium">{progress}% Complete</span>
        </div>

        <Progress value={progress} className="h-2" />

        <div className="grid grid-cols-3 gap-4 text-center mt-2">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
            <div className="flex justify-center mb-1">
              <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
            </div>
            <div className="text-sm font-medium">Sent</div>
            <div className="text-2xl font-bold">{sent}</div>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md">
            <div className="flex justify-center mb-1">
              <Clock className="h-5 w-5 text-amber-500 dark:text-amber-400" />
            </div>
            <div className="text-sm font-medium">Scheduled</div>
            <div className="text-2xl font-bold">{scheduled}</div>
          </div>

          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
            <div className="flex justify-center mb-1">
              <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
            </div>
            <div className="text-sm font-medium">Failed</div>
            <div className="text-2xl font-bold">{failed}</div>
          </div>
        </div>

        <div className="text-xs text-center text-gray-500 mt-2">
          Sending messages: {sent + failed} of {total} completed
        </div>
      </div>
    </Card>
  );
}
