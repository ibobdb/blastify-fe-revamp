'use client';

import { useRedirectAuthenticated } from '@/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LandingNavbar } from '@/components/landing/landing-navbar';
import { toast } from 'sonner';
import { Footer } from '@/components/landing/footer';

import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';

import authService from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Loader2,
  MessageSquare,
  MailCheck,
  Lock,
  User,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Phone,
} from 'lucide-react';

// Form schema validation
const formSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    phoneNumber: z
      .string()
      .min(10, { message: 'Please enter a valid phone number' }),
    password: z.string().min(8, {
      message: 'Password must be at least 8 characters',
    }),
    confirmPassword: z.string(),
    terms: z.boolean().refine((value) => value === true, {
      message: 'You must agree to the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export default function SignUpPage() {
  // Redirect if already authenticated
  useRedirectAuthenticated();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nameValid, setNameValid] = useState<boolean | null>(null);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  // We need this state for UI rendering but don't need to update it directly
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<
    'weak' | 'medium' | 'strong' | null
  >(null);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
  // Validation functions
  const validateName = (name: string) => {
    return name.length > 0 ? name.length >= 2 : null;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email.length > 0 ? emailRegex.test(email) : null;
  };

  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneNumber.length > 0 ? phoneRegex.test(phoneNumber) : null;
  };

  const checkPasswordStrength = (
    password: string
  ): 'weak' | 'medium' | 'strong' | null => {
    if (password.length === 0) return null;

    // Basic strength check
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strength =
      (hasLowerCase ? 1 : 0) +
      (hasUpperCase ? 1 : 0) +
      (hasNumbers ? 1 : 0) +
      (hasSpecialChars ? 1 : 0);

    if (password.length < 8) return 'weak';
    if (strength === 1) return 'weak';
    if (strength === 2 || strength === 3) return 'medium';
    return 'strong';
  };
  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });
  // Form field change handlers with validation
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue('name', value);
    setNameValid(validateName(value));
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue('email', value);
    setEmailValid(validateEmail(value));
  };

  const [phoneNumberValid, setPhoneNumberValid] = useState<boolean | null>(
    null
  );

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue('phoneNumber', value);
    setPhoneNumberValid(validatePhoneNumber(value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue('password', value);

    const strength = checkPasswordStrength(value);
    setPasswordStrength(strength);
    setPasswordValid(strength !== 'weak' && strength !== null);

    // Check if passwords match whenever password changes
    const confirmPassword = form.getValues('confirmPassword');
    if (confirmPassword) {
      setPasswordsMatch(value === confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    form.setValue('confirmPassword', value);

    // Check if passwords match
    const password = form.getValues('password');
    setPasswordsMatch(value === password && value !== '');
  }; // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);
    try {
      const { confirmPassword, terms, ...userData } = values;
      const result = await authService.register(userData);

      if (result.success) {
        toast.success('Registration successful! Please verify your email.', {
          description:
            'A verification link has been sent to your email address.',
          action: {
            label: 'Verify Email',
            onClick: () => router.push('/verify-email'),
          },
        });

        // If API returns a user or tokens, we might want to automatically log them in
        // Otherwise, redirect to signin
        router.push('/signin');
      }
    } catch (error: unknown) {
      console.error('Registration error:', error);
      // Handle error with proper type checking
      let errorMessage = 'Registration failed. Please try again.';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object' && 'response' in error) {
        const response = error.response as
          | { data?: { message?: string } }
          | undefined;
        if (response?.data?.message) {
          errorMessage = response.data.message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {' '}
      <div className="min-h-screen flex flex-col bg-[#F5F8FA]">
        <LandingNavbar />{' '}
        <main className="flex-1 flex items-center justify-center py-12">
          <div className="container px-4 sm:px-6 lg:px-8 max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center mb-6"
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-[#2979FF] text-white">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="font-bold text-2xl md:text-3xl text-[#222831]">
                  Blastify
                </span>
              </div>
            </motion.div>

            <div className="flex flex-col space-y-2 text-center mb-8">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-2xl font-semibold tracking-tight text-[#222831]"
              >
                Join Blastify Today ✨
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="text-sm text-[#222831]/70"
              >
                Create your account and start reaching your customers
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="border border-[#E5E7EB] bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
                {/* Accent color border at the top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2979FF] to-[#1565C0]"></div>{' '}
                <CardContent className="pt-6">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-5"
                    >
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 flex items-start gap-2"
                        >
                          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{error}</span>
                        </motion.div>
                      )}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#222831] flex items-center gap-1.5">
                              <User className="h-4 w-4 text-[#2979FF]" />
                              Full Name
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="John Doe"
                                  value={field.value}
                                  onChange={handleNameChange}
                                  disabled={isLoading}
                                  className={`py-6 pl-4 pr-9 border-[#E5E7EB] focus:border-[#2979FF] focus:ring-[#2979FF]/20 ${
                                    nameValid === false
                                      ? 'border-red-500'
                                      : nameValid === true
                                      ? 'border-green-500'
                                      : ''
                                  }`}
                                  aria-label="Full name"
                                />
                                {nameValid !== null && (
                                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    {nameValid ? (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <AlertCircle className="h-4 w-4 text-red-500" />
                                    )}
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#222831] flex items-center gap-1.5">
                              <MailCheck className="h-4 w-4 text-[#2979FF]" />
                              Email Address
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
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <AlertCircle className="h-4 w-4 text-red-500" />
                                    )}
                                  </div>
                                )}
                              </div>
                            </FormControl>{' '}
                            <FormMessage className="text-red-500 text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#222831] flex items-center gap-1.5">
                              <Phone className="h-4 w-4 text-[#2979FF]" />
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="+1234567890"
                                  type="tel"
                                  value={field.value}
                                  onChange={handlePhoneNumberChange}
                                  disabled={isLoading}
                                  className={`py-6 pl-4 pr-9 border-[#E5E7EB] focus:border-[#2979FF] focus:ring-[#2979FF]/20 ${
                                    phoneNumberValid === false
                                      ? 'border-red-500'
                                      : phoneNumberValid === true
                                      ? 'border-green-500'
                                      : ''
                                  }`}
                                  aria-label="Phone number"
                                />
                                {phoneNumberValid !== null && (
                                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    {phoneNumberValid ? (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <AlertCircle className="h-4 w-4 text-red-500" />
                                    )}
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#222831] flex items-center gap-1.5">
                              <Lock className="h-4 w-4 text-[#2979FF]" />
                              Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="••••••••"
                                  type={showPassword ? 'text' : 'password'}
                                  value={field.value}
                                  onChange={handlePasswordChange}
                                  disabled={isLoading}
                                  className={`py-6 pl-4 pr-10 border-[#E5E7EB] focus:border-[#2979FF] focus:ring-[#2979FF]/20`}
                                  aria-label="Password"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                  tabIndex={-1}
                                  aria-label={
                                    showPassword
                                      ? 'Hide password'
                                      : 'Show password'
                                  }
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                  ) : (
                                    <Eye className="h-5 w-5" />
                                  )}
                                </button>
                              </div>
                            </FormControl>

                            {/* Password strength indicator */}
                            {passwordStrength && (
                              <div className="mt-2">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full ${
                                        passwordStrength === 'weak'
                                          ? 'bg-red-500 w-1/3'
                                          : passwordStrength === 'medium'
                                          ? 'bg-yellow-500 w-2/3'
                                          : 'bg-green-500 w-full'
                                      }`}
                                    />
                                  </div>
                                  <span className="text-xs font-medium capitalize text-gray-500">
                                    {passwordStrength}
                                  </span>
                                </div>
                                {passwordStrength === 'weak' && (
                                  <p className="text-xs text-red-500">
                                    Add uppercase letters, numbers, or symbols
                                    for a stronger password
                                  </p>
                                )}
                              </div>
                            )}
                            <FormMessage className="text-red-500 text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#222831] flex items-center gap-1.5">
                              <ShieldCheck className="h-4 w-4 text-[#2979FF]" />
                              Confirm Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="••••••••"
                                  type={
                                    showConfirmPassword ? 'text' : 'password'
                                  }
                                  value={field.value}
                                  onChange={handleConfirmPasswordChange}
                                  disabled={isLoading}
                                  className={`py-6 pl-4 pr-10 border-[#E5E7EB] focus:border-[#2979FF] focus:ring-[#2979FF]/20 ${
                                    passwordsMatch === false
                                      ? 'border-red-500'
                                      : passwordsMatch === true
                                      ? 'border-green-500'
                                      : ''
                                  }`}
                                  aria-label="Confirm password"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                  }
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                  tabIndex={-1}
                                  aria-label={
                                    showConfirmPassword
                                      ? 'Hide password'
                                      : 'Show password'
                                  }
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                  ) : (
                                    <Eye className="h-5 w-5" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs" />
                            {passwordsMatch === false && (
                              <p className="text-xs text-red-500 mt-1">
                                Passwords don&apos;t match
                              </p>
                            )}
                          </FormItem>
                        )}
                      />{' '}
                      <FormField
                        control={form.control}
                        name="terms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="terms"
                                className="data-[state=checked]:bg-[#2979FF] data-[state=checked]:border-[#2979FF] focus:ring-[#2979FF]/20"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel
                                htmlFor="terms"
                                className="text-sm font-normal text-[#222831]/80 cursor-pointer flex flex-wrap items-center"
                              >
                                I agree to the terms and conditions
                              </FormLabel>
                              <FormMessage className="text-red-500 text-xs mt-1" />
                            </div>
                          </FormItem>
                        )}
                      />
                      <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E5E7EB] mt-2 mb-3">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="text-green-500 h-5 w-5" />
                          <p className="text-xs text-gray-600">
                            Your personal data will be used to support your
                            experience throughout this website and to manage
                            your account.
                          </p>
                        </div>
                      </div>
                      <Button
                        className="w-full py-6 text-md font-medium bg-[#2979FF] hover:bg-[#1565C0] text-white shadow-md hover:shadow-lg focus:ring-2 focus:ring-[#2979FF]/50 transition-all duration-200"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Creating your account...
                          </span>
                        ) : (
                          'Create Account'
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 border-t border-[#E5E7EB] p-6">
                  <div className="text-sm text-center">
                    <span className="text-[#222831]/70">
                      Already have an account?{' '}
                    </span>
                    <Link
                      href="/signin"
                      className="text-[#2979FF] hover:underline underline-offset-4 font-medium focus:outline-none focus:ring-2 focus:ring-[#2979FF]/20 rounded"
                    >
                      Sign in
                    </Link>
                  </div>

                  <div className="flex justify-center items-center space-x-4 text-xs text-[#222831]/60">
                    <Link
                      href="/privacy-policy"
                      className="hover:text-[#222831] focus:outline-none focus:ring-2 focus:ring-[#2979FF]/20 rounded px-1"
                    >
                      Privacy Policy
                    </Link>
                    <span>•</span>
                    <Link
                      href="/terms"
                      className="hover:text-[#222831] focus:outline-none focus:ring-2 focus:ring-[#2979FF]/20 rounded px-1"
                    >
                      Terms of Service
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>

            <div className="mt-8 text-center">
              <p className="text-xs text-[#222831]/70">
                &copy; {new Date().getFullYear()} Blastify. All rights reserved.
              </p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="text-xs text-[#2979FF]/70 mt-1 flex items-center justify-center gap-1"
              >
                <ShieldCheck className="h-3 w-3" />
                Secure registration • Your data is protected
              </motion.p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
