'use client';

import { BillingCards } from '@/components/dashboard/billing-card';
import { billingService } from '@/services/billing.service';
import { midtransService } from '@/services/midtrans.service';
import { useEffect, useState } from 'react';
import { useGlobalAlert } from '@/context';

export default function BillingPage() {
  const [isPaymentReady, setIsPaymentReady] = useState(false);
  const { showSuccess, showError } = useGlobalAlert();
  const handleCheckout = async (quota: number) => {
    try {
      console.log('Proceeding to checkout with quota:', quota);

      // Create transaction using billing service
      const transactionResponse = await billingService.createTransaction({
        quotaAmount: quota,
      });
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
            alert('Failed to initialize payment system. Please try again.');
            return;
          }
        }
        // Open Midtrans Snap popup
        await midtransService.pay(
          transactionResponse.data.transaction.snapToken,
          {
            onSuccess: (result: any) => {
              showSuccess('Payment Successful');
              // You can add additional success handling here:
              // - Refresh user quota
              // - Navigate to success page
              // - Update UI state
            },
            onPending: (result: any) => {
              console.log('Payment pending:', result);
              alert(
                'Payment is being processed. Please complete your payment.'
              );
            },
            onError: (result: any) => {
              console.log('Payment error:', result);
              alert('Payment failed. Please try again or contact support.');
            },
            onClose: () => {
              console.log('Payment popup closed by user');
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
      console.error('Error during checkout:', error);
      alert('Failed to process checkout. Please try again.');
    }
  };

  return (
    <div className="container mx-auto pt-8 px-4 md:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
          <p className="text-muted-foreground mt-1">
            Manage your billing information, view invoices, and update payment
            methods. Ensure your account remains active and uninterrupted.
          </p>
        </div>
      </div>

      {/* Billing Pricing Section */}
      <div className="">
        <BillingCards onCheckout={handleCheckout} />
      </div>
    </div>
  );
}
