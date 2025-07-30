'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CheckCircle,
  X,
  Zap,
  ArrowRight,
  HelpCircle,
  Medal,
  Rocket,
  Building,
  Calculator,
  Check,
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useState, useEffect } from 'react';
import { billingService } from '@/services/billing.service';

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

interface FeatureItem {
  name: string;
  tooltip?: string;
  badge?: string;
}

type Feature = string | FeatureItem;
type CTAAnimation = 'slide-right' | 'zoom-in' | 'pulse' | 'none';

interface PricingCardProps {
  name: string;
  price?: number;
  customPrice?: string;
  currency?: string;
  billingPeriod: 'monthly' | 'yearly';
  targetAudience: string;
  valueProposition: string;
  description: string;
  messageQuota: number | string;
  features: Feature[];
  notIncluded: Feature[];
  buttonText: string;
  buttonIcon?: React.ReactNode;
  buttonVariant: 'default' | 'outline' | 'enterprise' | 'custom';
  popular?: boolean;
  highlight?: boolean;
  delay: number;
  testimonial?: {
    text: string;
    author: string;
  };
  ctaAnimation?: CTAAnimation;
  checkColor?: string;
  onCustomPriceClick?: () => void;
  redirectTo?: string;
}

export function PricingSection() {
  // Using state for UI interactions - these will be used in future price toggle functionality
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>(
    'monthly'
  );
  const [isCustomPricingOpen, setIsCustomPricingOpen] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(100);
  const [customQuantity, setCustomQuantity] = useState<number | ''>('');
  const [inputMethod, setInputMethod] = useState<'preset' | 'manual'>('preset');
  const [pricing, setPricing] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(false);

  // Pricing calculation constants - will be used in future discount calculations
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const yearlyDiscount = 0.8;

  const presetOptions = [100, 250, 750, 1500, 2500, 5000];

  // Calculate pricing when selected quantity changes
  useEffect(() => {
    const calculatePricing = async () => {
      if (selectedQuantity > 0) {
        setLoading(true);
        try {
          const response = await billingService.calculatePrice({
            quotaAmount: selectedQuantity,
          });
          setPricing(response.data);
        } catch (error) {
          // Error handled by UI state
        } finally {
          setLoading(false);
        }
      } else {
        setPricing(null);
      }
    };

    if (isCustomPricingOpen) {
      const timeoutId = setTimeout(calculatePricing, 300); // Debounce
      return () => clearTimeout(timeoutId);
    }
  }, [selectedQuantity, isCustomPricingOpen]);

  return (
    <section id="pricing" className="py-20 bg-white relative">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          {' '}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#E3F2FD] text-[#2979FF] text-sm font-medium rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-[#2979FF]"></span>
            Pay-As-You-Go Credits
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-[#222831]">
            Simple, <span className="text-[#2979FF]">Transparent</span> Credit
            Packages
          </h2>
          <p className="text-xl text-[#222831]/70 mb-8">
            All users enjoy the same features, support, and tools. No
            subscriptions or recurring fees—just buy credits as needed.
          </p>
          <div className="bg-[#F8FAFC] p-4 rounded-lg mb-8 inline-flex items-center gap-3 border border-[#E5E7EB]">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <p className="text-sm text-[#222831]">
              <span className="font-semibold">Get 100 free credits</span> when
              you sign up — no payment required
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 max-w-6xl mx-auto pt-8">
          <PricingCard
            name="Basic"
            price={25000}
            currency="Rp"
            billingPeriod={billingPeriod}
            targetAudience="Best for small businesses"
            valueProposition="Simple and efficient WhatsApp marketing"
            description="Perfect for small businesses just getting started with WhatsApp marketing"
            messageQuota={500}
            features={[
              'AI-generated message templates',
              'Import Contacts',
              {
                name: 'Strong algorithm for managing broadcasts',
                tooltip:
                  'Our intelligent system ensures optimal delivery timing and engagement',
              },
              'Schedule Messages',
              'Full support 24/7',
              'Custom Templates',
              'Advanced targeting',
              'API access',
            ]}
            notIncluded={[]}
            buttonText="Get Started"
            buttonIcon={
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            }
            buttonVariant="outline"
            delay={0}
            testimonial={{
              text: "Perfect for our small team's needs!",
              author: 'Jane S., Retail Shop Owner',
            }}
            ctaAnimation="slide-right"
            checkColor="#4CAF50"
            redirectTo="/dashboard/billing"
          />

          <PricingCard
            name="Intermediate"
            price={50000}
            currency="Rp"
            billingPeriod={billingPeriod}
            targetAudience="For growing businesses"
            valueProposition="Scale your WhatsApp marketing"
            description="Ideal for growing businesses that need more advanced features and higher message volume"
            messageQuota={1000}
            features={[
              {
                name: '1000 messages without expiration',
                badge: 'More Value',
                tooltip:
                  'Send up to 1000 messages per month with no message expiration',
              },
              'AI-generated message templates',
              'Import Contacts',
              {
                name: 'Strong algorithm for managing broadcasts',
                tooltip:
                  'Our intelligent system ensures optimal delivery timing and engagement',
              },
              'Schedule Messages',
              'Full support 24/7',
              'Custom Templates',
            ]}
            notIncluded={[]}
            buttonText="Get Started"
            buttonIcon={
              <Rocket className="ml-1 h-4 w-4 transition-transform group-hover:translate-y-[-2px]" />
            }
            buttonVariant="default"
            popular
            highlight={true}
            delay={0.1}
            testimonial={{
              text: 'We saw a 30% increase in engagement!',
              author: 'Mark T., Marketing Director',
            }}
            ctaAnimation="zoom-in"
            checkColor="#2979FF"
            redirectTo="/dashboard/billing"
          />

          <PricingCard
            name="Custom plan"
            customPrice="Set your price"
            currency="Rp"
            billingPeriod={billingPeriod}
            targetAudience="Best for agencies & enterprises"
            valueProposition="Completely customizable solution"
            description="For businesses with high volume messaging needs and advanced requirements"
            messageQuota="Custom"
            features={[
              'Custom your requirement',
              'AI-generated message templates',
              'Import Contacts',
              {
                name: 'Strong algorithm for managing broadcasts',
                tooltip:
                  'Our intelligent system ensures optimal delivery timing and engagement',
                badge: 'Enterprise Grade',
              },
              'Schedule Messages',
              'Full support 24/7',
              {
                name: 'Custom Templates',
                badge: 'Unlimited',
                tooltip:
                  'Create unlimited custom templates for different campaigns and audiences',
              },
            ]}
            notIncluded={[]}
            buttonText="Get Started"
            buttonIcon={<Calculator className="ml-1 h-4 w-4" />}
            buttonVariant="custom"
            delay={0.2}
            testimonial={{
              text: 'Enterprise features that truly scale!',
              author: 'Sarah L., Enterprise Solutions',
            }}
            ctaAnimation="pulse"
            checkColor="#FF9800"
            onCustomPriceClick={() => setIsCustomPricingOpen(true)}
          />
        </div>

        {/* Custom Price Simulation Popup */}
        {isCustomPricingOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
              onClick={() => setIsCustomPricingOpen(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="bg-white w-full max-w-3xl max-h-[90vh] overflow-auto shadow-xl rounded-xl">
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-[#222831]">
                        Simulate Your Plan
                      </h3>
                      <p className="text-[#222831]/70">
                        Calculate custom pricing based on your message volume
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={() => setIsCustomPricingOpen(false)}
                    >
                      <span className="sr-only">Close</span>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column - Selection */}
                    <div>
                      <div className="bg-[#F8FAFC] p-6 rounded-xl mb-6">
                        <h4 className="text-lg font-medium text-[#222831] mb-4">
                          Select Message Quantity
                        </h4>

                        <div className="flex mb-5 gap-2">
                          <button
                            className={cn(
                              'flex-1 py-2 px-3 text-sm font-medium rounded transition-all',
                              inputMethod === 'preset'
                                ? 'bg-[#2979FF] text-white'
                                : 'bg-white border border-[#E5E7EB] text-[#222831]'
                            )}
                            onClick={() => setInputMethod('preset')}
                          >
                            Preset Options
                          </button>
                          <button
                            className={cn(
                              'flex-1 py-2 px-3 text-sm font-medium rounded transition-all',
                              inputMethod === 'manual'
                                ? 'bg-[#2979FF] text-white'
                                : 'bg-white border border-[#E5E7EB] text-[#222831]'
                            )}
                            onClick={() => setInputMethod('manual')}
                          >
                            Manual Input
                          </button>
                        </div>

                        {inputMethod === 'preset' ? (
                          <div className="grid grid-cols-2 gap-3">
                            {presetOptions.map((qty) => (
                              <button
                                key={qty}
                                className={cn(
                                  'py-3 px-2 border rounded-lg text-center transition-all hover:border-[#2979FF] hover:text-[#2979FF]',
                                  selectedQuantity === qty
                                    ? 'bg-[#E3F2FD] border-[#2979FF] text-[#2979FF] font-medium'
                                    : 'bg-white border-[#E5E7EB] text-[#222831]'
                                )}
                                onClick={() => setSelectedQuantity(qty)}
                              >
                                {qty.toLocaleString()} messages
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <input
                              type="number"
                              className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:border-[#2979FF] focus:ring-1 focus:ring-[#2979FF] outline-none"
                              placeholder="Enter custom quantity"
                              min={1}
                              value={customQuantity}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCustomQuantity(
                                  val === '' ? '' : Number(val)
                                );
                                if (val !== '' && Number(val) > 0) {
                                  setSelectedQuantity(Number(val));
                                }
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="text-sm text-[#222831]/70 mb-4 flex flex-col gap-2">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>All messages never expire</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>No hidden fees or charges</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>One-time payment, not subscription</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-2">
                          <HelpCircle className="h-4 w-4 text-[#2979FF]" />
                          <span className="text-[#2979FF] hover:underline cursor-pointer">
                            Need help choosing?
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Price Calculation */}
                    <div className="relative">
                      <Card className="border border-[#E5E7EB] shadow-md">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">
                            Price Calculation
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {loading ? (
                            <div className="flex items-center justify-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2979FF]"></div>
                            </div>
                          ) : pricing && selectedQuantity > 0 ? (
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-[#222831]/70">
                                  Messages
                                </span>
                                <motion.span
                                  key={selectedQuantity}
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="font-medium"
                                >
                                  {selectedQuantity.toLocaleString()}
                                </motion.span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-[#222831]/70">
                                  Base price
                                </span>
                                <span className="font-medium">
                                  {pricing.formattedBasePrice}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-[#222831]/70">
                                  Price per message
                                </span>
                                <span className="font-medium">
                                  Rp {pricing.pricePerQuota.toLocaleString()}
                                  /message
                                </span>
                              </div>

                              {pricing.discountPercent > 0 && (
                                <div className="flex justify-between items-center text-green-500">
                                  <span>
                                    Volume discount ({pricing.discountPercent}%)
                                  </span>
                                  <span>
                                    - {pricing.formattedDiscountAmount}
                                  </span>
                                </div>
                              )}

                              <div className="pt-3 mt-3 border-t border-[#E5E7EB]">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium text-lg text-[#222831]">
                                    Total Price
                                  </span>
                                  <motion.div
                                    key={`total-${pricing.finalPrice}`}
                                    initial={{ scale: 0.9, color: '#2979FF' }}
                                    animate={{ scale: 1, color: '#1565C0' }}
                                    transition={{ duration: 0.5 }}
                                    className="text-xl font-bold text-[#2979FF]"
                                  >
                                    {pricing.formattedFinalPrice}
                                  </motion.div>
                                </div>
                              </div>

                              {pricing.discountPercent > 0 && (
                                <div className="mt-2 bg-[#FFF8E1] text-[#FF9800] text-xs font-medium px-2 py-1.5 rounded-md flex items-center gap-1">
                                  <Medal className="h-3.5 w-3.5" />
                                  Best value! Save more with higher volume
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-3 text-[#222831]/50">
                              <div className="flex justify-between items-center">
                                <span>Messages</span>
                                <span>-</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>Base price</span>
                                <span>-</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>Price per message</span>
                                <span>-</span>
                              </div>
                              <div className="pt-3 mt-3 border-t border-[#E5E7EB]">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium text-lg">
                                    Total Price
                                  </span>
                                  <span className="text-xl font-bold">
                                    Select quantity
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="flex-col gap-3">
                          <Button
                            className="w-full bg-[#2979FF] hover:bg-[#1565C0] text-white font-medium"
                            disabled={!pricing || selectedQuantity <= 0}
                            asChild
                          >
                            <Link href="/dashboard/billing">
                              Go to Billing Page
                            </Link>
                          </Button>

                          <div className="text-xs text-center text-[#222831]/60">
                            Ready to purchase? Visit our billing page to
                            complete your order.
                          </div>
                        </CardFooter>
                      </Card>

                      <div className="absolute -bottom-10 left-0 right-0 flex items-center justify-center">
                        <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-full border border-[#E5E7EB]">
                          <div className="flex">
                            <svg
                              viewBox="0 0 24 24"
                              height="14"
                              width="14"
                              aria-hidden="true"
                              fill="#4CAF50"
                            >
                              <path d="M20.995 6.9a.998.998 0 0 0-.548-.795l-8-4a1 1 0 0 0-.895 0l-8 4a1.002 1.002 0 0 0-.547.795c-.011.107-.961 10.767 8.589 15.014a.987.987 0 0 0 .812 0c9.55-4.247 8.6-14.906 8.589-15.014zM12 19.897C5.231 16.625 4.911 9.642 4.966 7.635L12 4.118l7.029 3.515c.037 1.989-.328 9.018-7.029 12.264z" />
                              <path d="m11 12.586-2.293-2.293-1.414 1.414L11 15.414l5.707-5.707-1.414-1.414z" />
                            </svg>
                            <svg
                              viewBox="0 0 24 24"
                              height="14"
                              width="14"
                              aria-hidden="true"
                              fill="#4CAF50"
                            >
                              <path d="M20.995 6.9a.998.998 0 0 0-.548-.795l-8-4a1 1 0 0 0-.895 0l-8 4a1.002 1.002 0 0 0-.547.795c-.011.107-.961 10.767 8.589 15.014a.987.987 0 0 0 .812 0c9.55-4.247 8.6-14.906 8.589-15.014zM12 19.897C5.231 16.625 4.911 9.642 4.966 7.635L12 4.118l7.029 3.515c.037 1.989-.328 9.018-7.029 12.264z" />
                              <path d="m11 12.586-2.293-2.293-1.414 1.414L11 15.414l5.707-5.707-1.414-1.414z" />
                            </svg>
                          </div>
                          <span className="text-xs text-[#222831]/70">
                            Secure payment
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}

function PricingCard({
  name,
  price,
  customPrice,
  currency = '$',
  targetAudience,
  description,
  messageQuota,
  features,
  notIncluded,
  buttonText,
  buttonIcon,
  buttonVariant,
  popular,
  highlight,
  delay,
  ctaAnimation = 'none',
  checkColor = '#4CAF50',
  onCustomPriceClick,
  redirectTo,
}: PricingCardProps) {
  const getFeatureName = (feature: Feature): string => {
    return typeof feature === 'string' ? feature : feature.name;
  };

  const getFeatureTooltip = (feature: Feature): string | undefined => {
    return typeof feature === 'string' ? undefined : feature.tooltip;
  };

  const getFeatureBadge = (feature: Feature): string | undefined => {
    return typeof feature === 'string' ? undefined : feature.badge;
  };

  const ctaAnimationClasses = {
    'slide-right': 'group-hover:translate-x-1',
    'zoom-in': 'group-hover:scale-125',
    pulse: 'group-hover:animate-pulse',
    none: '',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={cn('flex', highlight ? 'md:-mt-6 md:-mb-6' : '')}
    >
      <TooltipProvider>
        <Card
          className={cn(
            `h-full relative border-2 transition-all duration-300`,
            highlight ? 'md:scale-[1.08] z-10' : '',
            popular
              ? 'border-[#2979FF] bg-gradient-to-b from-[#2979FF]/[0.03] to-white shadow-lg'
              : 'border-[#E5E7EB] bg-white'
          )}
        >
          {popular && (
            <div className="absolute top-0 right-6 transform -translate-y-1/2">
              <div className="bg-gradient-to-r from-[#2979FF] to-[#1565C0] text-white font-bold text-xs py-1.5 px-4 rounded-full flex items-center gap-1.5 shadow-md">
                <Zap className="h-3.5 w-3.5" />
                Most Popular
              </div>
            </div>
          )}

          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 mb-2">
              {name === 'Basic' && (
                <Building className="h-5 w-5 text-[#4CAF50]" />
              )}
              {name === 'Intermediate' && (
                <Rocket className="h-5 w-5 text-[#2979FF]" />
              )}
              {name === 'Custom plan' && (
                <Building className="h-5 w-5 text-[#FF9800]" />
              )}
              <CardTitle className="text-[#222831]">{name}</CardTitle>
            </div>

            <div className="text-sm font-medium text-[#222831]/70 mb-3">
              {targetAudience}
            </div>

            {/* Price section with visual distinction */}
            <div className="bg-[#F8FAFC] rounded-xl p-4 mb-4">
              {customPrice ? (
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-extrabold tracking-tight text-[#222831] mb-1">
                    {customPrice}
                  </span>
                  <div className="text-sm text-[#FF9800] font-medium">
                    Starting from {currency}50/message
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-0.5">
                    <span className="text-sm font-medium text-[#222831]/70">
                      {currency}
                    </span>
                    <span className="text-3xl font-extrabold tracking-tight text-[#222831]">
                      {price?.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-[#222831]/70 font-medium">
                    {typeof messageQuota === 'number' && (
                      <span className="inline-flex items-center bg-[#E8F5E9] text-[#4CAF50] px-2 py-0.5 rounded-full text-xs font-medium">
                        {messageQuota.toLocaleString()} messages without
                        expiration
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <CardDescription className="mt-2 text-[#222831]/70">
              {description}
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-0">
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={`feature-${index}`} className="flex items-start gap-2">
                  <CheckCircle
                    className="h-5 w-5 flex-shrink-0 mt-0.5"
                    style={{ color: checkColor }}
                  />
                  <span className="text-[#222831] flex-1 flex items-center gap-2 flex-wrap">
                    {getFeatureName(feature)}

                    {getFeatureBadge(feature) && (
                      <Badge className="text-[10px] py-0 px-1.5 bg-[#FF9800]/20 text-[#FF9800] hover:bg-[#FF9800]/20">
                        {getFeatureBadge(feature)}
                      </Badge>
                    )}

                    {getFeatureTooltip(feature) && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3.5 w-3.5 text-[#222831]/50 cursor-help flex-shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[200px] text-xs">
                          {getFeatureTooltip(feature)}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </span>
                </li>
              ))}

              {notIncluded.map((feature, index) => (
                <li
                  key={`not-included-${index}`}
                  className="flex items-start gap-2"
                >
                  <X className="h-5 w-5 text-[#E57373] flex-shrink-0 mt-0.5" />
                  <span className="text-[#222831]/50 flex-1 flex items-center gap-2">
                    {getFeatureName(feature)}

                    {getFeatureTooltip(feature) && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3.5 w-3.5 text-[#222831]/30 cursor-help flex-shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[200px] text-xs">
                          {getFeatureTooltip(feature)}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter className="pt-6 pb-6">
            <Button
              variant={buttonVariant === 'default' ? 'default' : 'outline'}
              className={cn(
                'w-full font-medium gap-2 transition-all duration-300 group',
                buttonVariant === 'default'
                  ? 'bg-[#2979FF] hover:bg-[#1565C0] text-white shadow-md hover:shadow-lg'
                  : buttonVariant === 'custom'
                  ? 'border-[#FF9800] text-[#FF9800] hover:bg-[#FF9800]/10 hover:border-[#FF9800]'
                  : buttonVariant === 'enterprise'
                  ? 'border-[#FF9800] text-[#FF9800] hover:bg-[#FF9800]/10 hover:border-[#FF9800]'
                  : 'border-[#2979FF] text-[#2979FF] hover:bg-[#2979FF]/10 hover:border-[#2979FF]'
              )}
              onClick={
                buttonVariant === 'custom' && onCustomPriceClick
                  ? onCustomPriceClick
                  : undefined
              }
              asChild={buttonVariant !== 'custom' || !onCustomPriceClick}
            >
              {buttonVariant === 'custom' && onCustomPriceClick ? (
                <div className="flex items-center justify-center">
                  {buttonText}
                  <span
                    className={cn(
                      'transition-all duration-300',
                      ctaAnimationClasses[ctaAnimation]
                    )}
                  >
                    {buttonIcon}
                  </span>
                </div>
              ) : (
                <Link
                  href={
                    redirectTo ||
                    (buttonVariant === 'enterprise' ? '/contact' : '/signup')
                  }
                >
                  {buttonText}
                  <span
                    className={cn(
                      'transition-all duration-300',
                      ctaAnimationClasses[ctaAnimation]
                    )}
                  >
                    {buttonIcon}
                  </span>
                </Link>
              )}
            </Button>
          </CardFooter>
        </Card>
      </TooltipProvider>
    </motion.div>
  );
}
