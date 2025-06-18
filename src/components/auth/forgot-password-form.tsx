'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '@/context';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MailCheck } from 'lucide-react';
import { motion } from 'framer-motion';

// Schema for form validation
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const { requestPasswordReset } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  // Email validation
  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle email input change with real-time validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue('email', value);
    setEmailValid(validateEmail(value));
  };

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true);

    try {
      await requestPasswordReset(values.email);
      setIsRequestSent(true);
      toast.success('Password reset link sent to your email', {
        description: 'Please check your inbox and follow the instructions',
      });
    } catch (error) {
      let errorMessage = 'Failed to send password reset email';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error('Password reset request failed', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isRequestSent) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="p-6 bg-green-50 border border-green-100 rounded-lg text-center"
      >
        <h3 className="text-lg font-medium text-green-800 mb-2">
          Check Your Email
        </h3>
        <p className="text-green-700 mb-4">
          We've sent a password reset link to your email address. Please check
          your inbox and follow the instructions.
        </p>
        <p className="text-sm text-green-600">
          Didn't receive an email? Check your spam folder or request another
          reset link.
        </p>
        <Button
          variant="outline"
          className="mt-4 border-green-300 text-green-700 hover:bg-green-100"
          onClick={() => setIsRequestSent(false)}
        >
          Try again
        </Button>
      </motion.div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#222831] flex items-center gap-1.5">
                <MailCheck className="h-4 w-4 text-[#2979FF]" />
                Email
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="you@example.com"
                    type="email"
                    value={field.value}
                    onChange={handleEmailChange}
                    disabled={isLoading}
                    className={`py-6 pl-4 pr-9 border-[#E5E7EB] focus:border-[#2979FF] focus:ring-[#2979FF]/20 ${
                      emailValid === false
                        ? 'border-red-500'
                        : emailValid === true
                        ? 'border-green-500'
                        : ''
                    }`}
                    aria-label="Email address"
                  />
                  {emailValid !== null && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {emailValid ? (
                        <div className="text-green-500 rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5"
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        </div>
                      ) : (
                        <div className="text-red-500 rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5"
                          >
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <div className="pt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-6 bg-[#2979FF] hover:bg-[#1565C0] transition-all"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
