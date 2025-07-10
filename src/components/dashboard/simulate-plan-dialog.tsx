'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { billingService } from '@/services/billing.service';

interface SimulatePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPlanSelect: (messages: number) => void;
}

interface PricingData {
  quotaAmount: number;
  pricePerQuota: number;
  basePrice: number;
  discountPercent: number;
  discountAmount: number;
  finalPrice: number;
  currency: string;
  formattedBasePrice: string;
  formattedDiscountAmount: string;
  formattedFinalPrice: string;
}

const presetOptions = [100, 250, 750, 1500, 2500, 5000];

export function SimulatePlanDialog({
  open,
  onOpenChange,
  onPlanSelect,
}: SimulatePlanDialogProps) {
  const [activeTab, setActiveTab] = useState<'preset' | 'manual'>('preset');
  const [selectedMessages, setSelectedMessages] = useState(100);
  const [manualInput, setManualInput] = useState('');
  const [pricing, setPricing] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(false);

  const messages =
    activeTab === 'preset' ? selectedMessages : parseInt(manualInput) || 0;

  // Calculate pricing when messages change
  useEffect(() => {
    const calculatePricing = async () => {
      if (messages > 0) {
        setLoading(true);
        try {
          const response = await billingService.calculatePrice({
            quotaAmount: messages,
          });
          setPricing(response.data);
        } catch (error) {
          console.error('Error calculating pricing:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setPricing(null);
      }
    };

    const timeoutId = setTimeout(calculatePricing, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [messages]);

  const handleSelectPlan = () => {
    if (messages > 0) {
      onPlanSelect(messages);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0" showCloseButton={false}>
        {/* Custom Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-10 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>

        <div className="p-6">
          <DialogHeader className="text-left mb-6">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Simulate Your Plan
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-1">
              Calculate custom pricing based on your message volume
            </p>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Side - Message Selection */}
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-4">
                Select Message Quantity
              </h3>

              {/* Tab Buttons */}
              <div className="flex gap-2 mb-4">
                <Button
                  variant={activeTab === 'preset' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('preset')}
                  className="text-sm"
                >
                  Preset Options
                </Button>
                <Button
                  variant={activeTab === 'manual' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('manual')}
                  className="text-sm"
                >
                  Manual Input
                </Button>
              </div>

              {/* Preset Options */}
              {activeTab === 'preset' && (
                <div className="grid grid-cols-2 gap-2">
                  {presetOptions.map((option) => (
                    <Button
                      key={option}
                      variant={
                        selectedMessages === option ? 'default' : 'outline'
                      }
                      size="sm"
                      onClick={() => setSelectedMessages(option)}
                      className="text-sm justify-start"
                    >
                      {option.toLocaleString()} messages
                    </Button>
                  ))}
                </div>
              )}

              {/* Manual Input */}
              {activeTab === 'manual' && (
                <div>
                  <input
                    type="number"
                    placeholder="Enter number of messages"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                  />
                </div>
              )}

              {/* Features List */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  All messages never expire
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  No hidden fees or charges
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  One-time payment, not subscription
                </div>
              </div>
            </div>

            {/* Right Side - Price Calculation */}
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-4">
                Price Calculation
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Messages</span>
                  <span className="font-medium text-gray-900">
                    {messages.toLocaleString()}
                  </span>
                </div>

                {loading ? (
                  <div className="text-center py-4">
                    <span className="text-sm text-gray-500">
                      Calculating...
                    </span>
                  </div>
                ) : pricing ? (
                  <>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Base price</span>
                      <span className="font-medium text-gray-900">
                        {pricing.formattedBasePrice}
                      </span>
                    </div>

                    {pricing.discountAmount > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">
                          Discount ({pricing.discountPercent}%)
                        </span>
                        <span className="font-medium text-green-600">
                          -{pricing.formattedDiscountAmount}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Price per message</span>
                      <span className="font-medium text-gray-900">
                        Rp {pricing.pricePerQuota.toLocaleString('id-ID')}
                        /message
                      </span>
                    </div>

                    <hr className="border-gray-200" />

                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">
                        Total Price
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        {pricing.formattedFinalPrice}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <span className="text-sm text-gray-500">
                      Enter message quantity to see pricing
                    </span>
                  </div>
                )}
              </div>

              <Button
                onClick={handleSelectPlan}
                disabled={messages === 0 || loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                size="lg"
              >
                {loading ? 'Calculating...' : 'Select This Plan'}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-3">
                This will add the plan to your order summary for checkout.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
