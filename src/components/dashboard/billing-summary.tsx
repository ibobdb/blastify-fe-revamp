'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { billingService } from '@/services/billing.service';
import {
  Loader2,
  DollarSign,
  CreditCard,
  TrendingUp,
  Calendar,
} from 'lucide-react';

type BillingSummary = {
  totalSpent: number;
  totalTransactions: number;
  totalQuotaPurchased: number;
  paidTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
  thisMonthSpent: number;
  thisMonthTransactions: number;
};

export function BillingSummary() {
  const [summary, setSummary] = useState<BillingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateSummary = (transactions: any[]): BillingSummary => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const summary: BillingSummary = {
      totalSpent: 0,
      totalTransactions: transactions.length,
      totalQuotaPurchased: 0,
      paidTransactions: 0,
      pendingTransactions: 0,
      failedTransactions: 0,
      thisMonthSpent: 0,
      thisMonthTransactions: 0,
    };

    transactions.forEach((transaction) => {
      const createdAt = new Date(transaction.createdAt);

      // Count by status
      if (
        transaction.status === 'PAID' ||
        transaction.status === 'SETTLEMENT'
      ) {
        summary.paidTransactions++;
        summary.totalSpent += transaction.amount;
        summary.totalQuotaPurchased += transaction.quotaAmount;

        // This month calculations
        if (createdAt >= thisMonth) {
          summary.thisMonthSpent += transaction.amount;
        }
      } else if (transaction.status === 'PENDING') {
        summary.pendingTransactions++;
      } else if (
        transaction.status === 'FAILED' ||
        transaction.status === 'EXPIRED' ||
        transaction.status === 'CANCELLED'
      ) {
        summary.failedTransactions++;
      }

      // This month transactions count
      if (createdAt >= thisMonth) {
        summary.thisMonthTransactions++;
      }
    });

    return summary;
  };

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await billingService.getTransactions({});

      if (response.status) {
        const calculatedSummary = calculateSummary(response.data);
        setSummary(calculatedSummary);
      } else {
        setError(response.message || 'Failed to fetch billing summary');
      }
    } catch (error) {
      console.error('Error fetching billing summary:', error);
      setError('Error fetching billing summary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
              <Loader2 className="h-4 w-4 animate-spin" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Loading data...</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-full">
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <p>Error loading billing summary: {error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!summary) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summary.totalSpent)}
          </div>
          <p className="text-xs text-muted-foreground">
            From {summary.paidTransactions} paid transactions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Quota Purchased
          </CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {summary.totalQuotaPurchased.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Message quota purchased
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summary.thisMonthSpent)}
          </div>
          <p className="text-xs text-muted-foreground">
            {summary.thisMonthTransactions} transactions this month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Transaction Status
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {summary.paidTransactions}
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="text-yellow-600">
              {summary.pendingTransactions} pending
            </span>
            {summary.failedTransactions > 0 && (
              <span className="text-red-600">
                {' '}
                • {summary.failedTransactions} failed
              </span>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
