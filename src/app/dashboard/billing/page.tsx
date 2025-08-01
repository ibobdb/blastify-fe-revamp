'use client';

import { BillingCards } from '@/components/dashboard/billing-card';
import { billingService } from '@/services/billing.service';
import { midtransService } from '@/services/midtrans.service';
import { useEffect, useState } from 'react';
import { useGlobalAlert, useQuota } from '@/context';
import { toast } from 'sonner';
import { MainPageLayout } from '@/components/dashboard/main-page-layout';
export default function BillingPage() {
  const [isPaymentReady, setIsPaymentReady] = useState(false);
  const [isCreatingTransaction, setIsCreatingTransaction] = useState(false);
  const [isSnapOpen, setIsSnapOpen] = useState(false);
  const { showSuccess, showError, showInfo, showWarning } = useGlobalAlert();
  const { refreshQuota, refreshing: isRefreshingQuota } = useQuota();

  const handleRefreshQuota = async () => {
    try {
      await refreshQuota();
      toast.success('Quota updated successfully!');
    } catch (error) {
      console.error('Error refreshing quota:', error);
      showError('Failed to refresh quota. Please refresh the page.');
    }
  };

  const handleCheckout = async (quota: number) => {
    try {
      setIsCreatingTransaction(true);
      // Create transaction using billing service
      const transactionResponse = await billingService.createTransaction({
        quotaAmount: quota,
      });
      setIsCreatingTransaction(false);
      if (
        transactionResponse.status &&
        transactionResponse.data?.transaction.snapToken
      ) {
        // Initialize Midtrans after successful transaction creation
        if (!isPaymentReady) {
          try {
            await midtransService.loadSnapScript();
            setIsPaymentReady(true);
          } catch (error) {
            console.error('Failed to initialize payment system:', error);
            showError('Failed to initialize payment system. Please try again.');
            return;
          }
        }

        // Set snap as open and disable button
        setIsSnapOpen(true);

        // Open Midtrans Snap popup
        await midtransService.pay(
          transactionResponse.data.transaction.snapToken,
          {
            onSuccess: async (result: any) => {
              setIsSnapOpen(false);
              setIsCreatingTransaction(false); // Reset checkout state
              showSuccess('Payment Successful');

              // Refresh quota after successful payment
              showInfo('Updating your quota...');
              await handleRefreshQuota();
            },
            onPending: (result: any) => {
              setIsSnapOpen(false);
              showWarning(
                'Payment is being processed. Please complete your payment.'
              );
            },
            onError: (result: any) => {
              setIsSnapOpen(false);
              showError('Payment failed. Please try again or contact support.');
            },
            onClose: () => {
              setIsSnapOpen(false);
              console.log('Payment popup closed by user');
              showInfo(
                'Payment popup was closed. You can retry payment anytime.'
              );
              // Optional: Track user abandonment for analytics
            },
          }
        );
      } else {
        console.error('Invalid transaction response structure:', {
          status: transactionResponse.status,
          hasData: 'data' in transactionResponse,
          data: transactionResponse.data,
          hasSnapToken: transactionResponse.data?.transaction.snapToken,
        });

        if (!transactionResponse.status) {
          throw new Error(
            `Transaction failed: ${
              transactionResponse.message || 'Unknown error'
            }`
          );
        } else if (!transactionResponse.data?.transaction.snapToken) {
          throw new Error(
            'Failed to get payment token from transaction response'
          );
        } else {
          throw new Error('Invalid transaction response structure');
        }
      }
    } catch (error) {
      setIsCreatingTransaction(false);
      setIsSnapOpen(false);
      console.error('Error during checkout:', error);
      showError('Failed to process checkout. Please try again.');
    }
  };

  return (
    <MainPageLayout
      title="Billing History"
      description="View your payment transactions and quota purchases. Track payment status and transaction details."
    >
      <BillingCards
        onCheckout={handleCheckout}
        isCheckoutLoading={isCreatingTransaction}
        isCheckoutDisabled={isSnapOpen}
      />
    </MainPageLayout>
  );
}
