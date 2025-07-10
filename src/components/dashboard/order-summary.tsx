import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard } from 'lucide-react';

interface OrderSummaryProps {
  plan?: string;
  messages?: number;
  basePrice?: number;
  discount?: number;
  discountPercentage?: number;
  pricePerMessage?: number;
  onCheckout?: () => void;
  isLoading?: boolean;
}

export function OrderSummary({
  plan = 'No Plan Selected',
  messages = 0,
  basePrice = 0,
  discount = 0,
  discountPercentage = 0,
  pricePerMessage = 0,
  onCheckout,
  isLoading = false,
}: OrderSummaryProps) {
  const total = basePrice - discount;
  const formattedTotal = total.toLocaleString('id-ID');
  const formattedBasePrice = basePrice.toLocaleString('id-ID');
  const formattedDiscount = discount.toLocaleString('id-ID');

  const isPlanSelected = plan !== 'No Plan Selected' && messages > 0;

  return (
    <Card className="w-full border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 h-full flex flex-col">
      <CardHeader className=" px-4">
        <CardTitle className="text-md font-semibold text-gray-900">
          Order Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 pb-4 flex-1 flex flex-col">
        {!isPlanSelected && (
          <div className="text-center py-2 flex-1 flex flex-col justify-center">
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              Select a Plan
            </h3>
            <p className="text-xs text-gray-500">
              Choose a plan to see your order summary and pricing details.
            </p>
          </div>
        )}

        {isPlanSelected && (
          <div className="flex-1 flex flex-col">
            {/* Plan Details */}
            <div className="space-y-2 flex-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Plan</span>
                <span className="text-sm font-medium text-gray-900">
                  {plan}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Messages</span>
                <span className="text-sm font-medium text-gray-900">
                  {messages.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Base price</span>
                <span className="text-sm font-medium text-gray-900">
                  Rp {formattedBasePrice}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">
                    Discount ({discountPercentage}%)
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    -Rp {formattedDiscount}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Price per message</span>
                <span className="text-sm font-medium text-gray-900">
                  Rp {pricePerMessage}/message
                </span>
              </div>
            </div>
            {/* Divider */}
            <div className="border-t border-gray-200 my-2"></div>
            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-900">Total</span>
              <span className="text-lg font-bold text-blue-600">
                Rp {formattedTotal}
              </span>
            </div>
            {/* Savings Badge
            {discount > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-2 ">
                <div className="flex items-center justify-center">
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 text-xs"
                  >
                    You're saving Rp {formattedDiscount} with this purchase!
                  </Badge>
                </div>
              </div>
            )} */}
          </div>
        )}

        {/* Checkout Button */}
        <Button
          onClick={onCheckout}
          disabled={isLoading || !isPlanSelected}
          className="w-full text-sm h-9 font-medium rounded-lg transition-colors bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white flex items-center justify-center gap-2 mt-4"
        >
          {isLoading ? (
            'Processing...'
          ) : isPlanSelected ? (
            <>
              Proceed to Checkout{' '}
              <CreditCard className="inline-block w-4 h-4 ml-1 align-text-bottom" />
            </>
          ) : (
            'Select a Plan First'
          )}
        </Button>

        {/* Security Message */}
        {isPlanSelected && (
          <p className="text-xs text-gray-500 text-center mt-2">
            Secure payment processing with Midtrans. You'll review your order
            before finalizing.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default OrderSummary;
