'use client';

import { useState, useEffect } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
import { useQuota } from '@/context';

export function QuotaNav() {
  const { quotaData, loading, error, refreshing, refreshQuota } = useQuota();

  const handleRefresh = () => {
    refreshQuota();
  };

  const formatCredits = (amount: number) => {
    return Math.floor(amount).toString();
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <span className="text-sm text-destructive">Error</span>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
          />
        </button>
      </div>
    );
  }

  if (!quotaData) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="flex items-center space-x-2 px-2 py-1 bg-muted/50 rounded-md">
        <span className="text-sm text-muted-foreground">Credits:</span>
        <span className="text-sm font-semibold text-blue-600">
          {formatCredits(quotaData.availableBalance)}
        </span>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          title="Refresh Quota"
          className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
        >
          <RefreshCw
            className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`}
          />
        </button>
      </div>
    </TooltipProvider>
  );
}
