'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { quotaService } from '@/services/quota.service';

interface QuotaData {
  userId: string;
  balance: number;
  lockedAmount: number;
  availableBalance: number;
}

interface QuotaContextType {
  quotaData: QuotaData | null;
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  refreshQuota: () => Promise<void>;
  setQuotaData: (data: QuotaData | null) => void;
}

const QuotaContext = createContext<QuotaContextType | undefined>(undefined);

interface QuotaProviderProps {
  children: ReactNode;
}

export function QuotaProvider({ children }: QuotaProviderProps) {
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
      setError('Failed to load quota information');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshQuota = async () => {
    await fetchQuota(true);
  };

  useEffect(() => {
    fetchQuota();
  }, []);

  const value: QuotaContextType = {
    quotaData,
    loading,
    error,
    refreshing,
    refreshQuota,
    setQuotaData,
  };

  return (
    <QuotaContext.Provider value={value}>{children}</QuotaContext.Provider>
  );
}

export function useQuota() {
  const context = useContext(QuotaContext);
  if (context === undefined) {
    throw new Error('useQuota must be used within a QuotaProvider');
  }
  return context;
}
