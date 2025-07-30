'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Settings, Crown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OrderSummary } from './order-summary';
import { SimulatePlanDialog } from './simulate-plan-dialog';
import { billingService } from '@/services/billing.service';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  messages: number;
  period?: string;
  isPopular?: boolean;
  features: PlanFeature[];
  buttonText: string;
  buttonVariant?: 'default' | 'outline';
  icon?: React.ElementType;
  description?: string;
  color?: string;
}

interface PlanPricing {
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
interface Order {
  onCheckout: (quota: number) => void;
  isCheckoutLoading?: boolean;
  isCheckoutDisabled?: boolean;
}

const pricingPlans: PricingPlan[] = [
  {
    name: 'Newbie',
    messages: 500,
    description: 'Perfect for getting started',
    icon: Sparkles,
    color: 'emerald',
    features: [
      { text: '500 messages/all of time', included: true },
      { text: 'Message Templates', included: true },
      { text: 'Import Contacts', included: true },
      { text: 'Strong Algorithm', included: true },
      { text: 'Schedule Messages', included: true },
      { text: 'Support 24/7', included: true },
      { text: 'Custom Templates', included: true },
    ],
    buttonText: 'Choose Plan',
    buttonVariant: 'outline',
  },
  {
    name: 'Intermediate',
    messages: 1000,
    description: 'Most popular choice for growing businesses',
    icon: Crown,
    color: 'blue',
    isPopular: true,
    features: [
      { text: '1000 messages/all of time', included: true },
      { text: 'Message Templates', included: true },
      { text: 'Import Contacts', included: true },
      { text: 'Strong Algorithm', included: true },
      { text: 'Schedule Messages', included: true },
      { text: 'Support 24/7', included: true },
      { text: 'Custom Templates', included: true },
    ],
    buttonText: 'Choose Plan',
    buttonVariant: 'default',
  },
  {
    name: 'Custom',
    messages: 0, // Will be set dynamically
    description: 'Tailored solutions for enterprise needs',
    icon: Settings,
    color: 'purple',
    features: [
      { text: 'Custom your own requirements', included: true },
      { text: 'Message Templates', included: true },
      { text: 'Import Contacts', included: true },
      { text: 'Strong Algorithm', included: true },
      { text: 'Schedule Messages', included: true },
      { text: 'Support 24/7', included: true },
      { text: 'Custom Templates', included: true },
    ],
    buttonText: 'Simulate Your Plan',
    buttonVariant: 'outline',
  },
];

export function BillingCards({
  onCheckout,
  isCheckoutLoading = false,
  isCheckoutDisabled = false,
}: Order) {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [selectedPlanPricing, setSelectedPlanPricing] =
    useState<PlanPricing | null>(null);
  const [customPlanPricing, setCustomPlanPricing] =
    useState<PlanPricing | null>(null);
  const [customMessages, setCustomMessages] = useState<number>(0);
  const [showSimulateDialog, setShowSimulateDialog] = useState(false);
  const [planPricings, setPlanPricings] = useState<Record<string, PlanPricing>>(
    {}
  );
  const [loading, setLoading] = useState(false);

  // Load pricing for predefined plans on component mount
  useEffect(() => {
    const loadPlanPricings = async () => {
      setLoading(true);
      try {
        const pricingPromises = pricingPlans
          .filter((plan) => plan.name !== 'Custom')
          .map(async (plan) => {
            const response = await billingService.calculatePrice({
              quotaAmount: plan.messages,
            });
            return { planName: plan.name, pricing: response.data };
          });

        const results = await Promise.all(pricingPromises);
        const pricingMap: Record<string, PlanPricing> = {};
        results.forEach(({ planName, pricing }) => {
          pricingMap[planName] = pricing;
        });
        setPlanPricings(pricingMap);
      } catch (error) {
        // Error handled silently
      } finally {
        setLoading(false);
      }
    };

    loadPlanPricings();
  }, []);

  const handlePlanSelect = async (plan: PricingPlan) => {
    if (plan.name === 'Custom') {
      setShowSimulateDialog(true);
    } else {
      setSelectedPlan(plan);
      setSelectedPlanPricing(planPricings[plan.name] || null);
      setCustomPlanPricing(null);
    }
  };

  const handleCustomPlanSelect = async (messages: number) => {
    try {
      setLoading(true);
      const response = await billingService.calculatePrice({
        quotaAmount: messages,
      });

      const customPlan: PricingPlan = {
        ...pricingPlans.find((p) => p.name === 'Custom')!,
        messages: messages,
      };

      setSelectedPlan(customPlan);
      setCustomPlanPricing(response.data);
      setCustomMessages(messages);
      setSelectedPlanPricing(null);
      setShowSimulateDialog(false);
    } catch (error) {
      // Close dialog even if there's an error
      setShowSimulateDialog(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateDialogChange = (open: boolean) => {
    setShowSimulateDialog(open);

    // Reset state when dialog closes
    if (!open) {
      // Reset custom plan related state
      setCustomPlanPricing(null);
      setCustomMessages(0);

      // If a custom plan was selected, clear the selection
      if (selectedPlan?.name === 'Custom') {
        setSelectedPlan(null);
        setSelectedPlanPricing(null);
      }
    }
  };

  const handleCheckout = () => {
    const quotaAmount =
      selectedPlanPricing?.quotaAmount || customPlanPricing?.quotaAmount;

    if (quotaAmount) {
      onCheckout(quotaAmount);
    }
  };

  const getDisplayPrice = (plan: PricingPlan): string => {
    if (plan.name === 'Custom') {
      return 'Set your own price';
    }
    const pricing = planPricings[plan.name];
    return pricing ? pricing.formattedFinalPrice : 'Loading...';
  };

  const getCurrentPricing = (): PlanPricing | null => {
    return selectedPlanPricing || customPlanPricing;
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="mx-auto">
        <div className="grid">
          {/* Plans Grid */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h1 className="text-lg font-bold text-gray-900 mb-3">
                Choose Your Plan
              </h1>
            </div>

            <div className="grid gap-2 md:grid-cols-4">
              {pricingPlans.map((plan, index) => {
                const IconComponent = plan.icon || Star;
                const isSelected = selectedPlan?.name === plan.name;

                return (
                  <Card
                    key={plan.name}
                    className={cn(
                      'relative overflow-hidden transition-all duration-200 cursor-pointer',
                      'border-2 rounded-xl shadow-sm hover:shadow-md',
                      'h-full flex flex-col',

                      isSelected &&
                        'ring-2 ring-blue-300 border-blue-600 shadow-md'
                    )}
                    onClick={() => handlePlanSelect(plan)}
                  >
                    {/* Popular Badge */}
                    {plan.isPopular && (
                      <div className="absolute top-3 right-3 z-10">
                        <Badge className="bg-blue-500 hover:bg-blue-500 text-white text-xs px-2 py-1">
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="pb-3 pt-4 px-4">
                      <div
                        className={cn(
                          'p-2 rounded-lg flex-shrink-0',
                          plan.color === 'blue' && 'bg-blue-100 text-blue-600',
                          plan.color === 'emerald' &&
                            'bg-emerald-100 text-emerald-600',
                          plan.color === 'purple' &&
                            'bg-purple-100 text-purple-600'
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-md font-semibold text-gray-700">
                            {plan.name}
                          </CardTitle>
                          <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-lg font-semibold text-gray-900">
                              {getDisplayPrice(plan)}
                            </span>
                          </div>
                          {plan.name !== 'Custom' && (
                            <p className="text-xs text-gray-500">
                              {plan.messages.toLocaleString()} messages/all of
                              time
                            </p>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="px-4 pb-4 flex-1 flex flex-col">
                      {/* Features List - Compact */}
                      <div className="space-y-1.5 mb-4 flex-1">
                        {plan.features
                          .slice(0, 6)
                          .map((feature, featureIndex) => (
                            <div
                              key={featureIndex}
                              className="flex items-center gap-2"
                            >
                              <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                              <span className="text-xs text-gray-600 leading-tight">
                                {feature.text}
                              </span>
                            </div>
                          ))}
                      </div>

                      {/* Action Button */}
                      <Button
                        className={cn(
                          'w-full text-sm h-9 font-medium rounded-lg transition-colors',
                          isSelected && 'bg-blue-600 hover:bg-blue-700',
                          plan.name === 'Custom' &&
                            !isSelected &&
                            'bg-purple-600 hover:bg-purple-700 text-white'
                        )}
                        variant={
                          isSelected
                            ? 'default'
                            : plan.name === 'Custom'
                            ? 'default'
                            : plan.buttonVariant
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlanSelect(plan);
                        }}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            Selected
                          </>
                        ) : (
                          plan.buttonText
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
              <OrderSummary
                plan={selectedPlan?.name || 'No Plan Selected'}
                messages={selectedPlan?.messages || 0}
                basePrice={getCurrentPricing()?.basePrice || 0}
                discount={getCurrentPricing()?.discountAmount || 0}
                discountPercentage={getCurrentPricing()?.discountPercent || 0}
                pricePerMessage={getCurrentPricing()?.pricePerQuota || 0}
                onCheckout={handleCheckout}
                isLoading={loading || isCheckoutLoading}
                isDisabled={isCheckoutDisabled}
              />
            </div>
          </div>

          {/* Order Summary - Sticky Sidebar */}
          <div className="lg:col-span-1"></div>

          {/* Simulate Dialog */}
          <SimulatePlanDialog
            open={showSimulateDialog}
            onOpenChange={handleSimulateDialogChange}
            onPlanSelect={handleCustomPlanSelect}
          />
        </div>
      </div>
    </div>
  );
}

export default BillingCards;
