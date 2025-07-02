'use client';

import { useState, useEffect } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
import { quotaService } from '@/services/quota.service';

interface QuotaData {
  userId: string;
  balance: number;
  lockedAmount: number;
  availableBalance: number;
}

export function QuotaNav() {
  const [quotaData, setQuotaData] = useState<QuotaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchQuota = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await quotaService.getQuota();
      setQuotaData(response.data);
    } catch (err) {
      console.error('Error fetching quota:', err);
      setError('Failed to load quota information');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchQuota();
  }, []);

  const handleRefresh = () => {
    fetchQuota(true);
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
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              <RefreshCw
                className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Refresh credits</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
