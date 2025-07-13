'use client';

import { useAuth } from '@/context';
import { useRedirectAuthenticated } from '@/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { Checkbox } from '@/components/ui/checkbox';
import { LandingNavbar } from '@/components/landing/safe-landing-navbar';
import { toast } from 'sonner';
import { Footer } from '@/components/landing/footer';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Eye,
  EyeOff,
  Loader2,
  MessageSquare,
  MailCheck,
  Lock,
} from 'lucide-react';

// Form schema validation
const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters',
  }),
  rememberMe: z.boolean().default(false).optional(),
});

// Component that safely uses useSearchParams within a Suspense boundary
function SignInForm() {
  const { login, error, clearError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  // Redirect if already authenticated
  useRedirectAuthenticated();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null);

  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const wasRemembered = localStorage.getItem('rememberMe') === 'true';

    if (rememberedEmail && wasRemembered) {
      form.setValue('email', rememberedEmail);
      form.setValue('rememberMe', true);
      setEmailValid(validateEmail(rememberedEmail));
    }
  }, [form]);

  // Real-time email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email.length > 0 ? emailRegex.test(email) : null;
  };

  // Real-time password validation function
  const validatePassword = (password: string) => {
    return password.length > 0 ? password.length >= 6 : null;
  };

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      // Handle remember me functionality
      if (values.rememberMe) {
        localStorage.setItem('rememberedEmail', values.email);
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberMe');
      }

      console.log('Remember Me:', values.rememberMe);

      await login(values.email, values.password, values.rememberMe);

      // Only redirect and show success if login was successful
      // The login function will throw an error if login fails
      toast.success('Login successful');
      router.push(decodeURI(callbackUrl));
    } catch (error) {
      console.error('Login error:', error);
      // Error is already handled by the auth context and displayed in the form
      // The user will stay on the signin page to see the error message
      // Do not redirect on error - just stay on the page and show the error
    } finally {
      setIsLoading(false);
    }
  };

  // Clear any authentication errors when form inputs change
  const handleInputChange = () => {
    if (error) {
      clearError();
    }
  };

  // Handle email input change with real-time validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue('email', value);
    setEmailValid(validateEmail(value));
    handleInputChange();
  };

  // Handle password input change with real-time validation
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue('password', value);
    setPasswordValid(validatePassword(value));
    handleInputChange();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100"
          >
            {error}
          </motion.div>
        )}

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
                        <div className="text-green-500 rounded-full">✓</div>
                      ) : (
                        <div className="text-red-500 rounded-full">✗</div>
                      )}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage className="text-red-500 text-xs" />
              {emailValid === false && (
                <p className="text-xs text-red-500 mt-1">
                  Please enter a valid email address
                </p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-[#222831] flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-[#2979FF]" />
                  Password
                </FormLabel>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#2979FF] hover:underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-[#2979FF]/20 rounded"
                  tabIndex={0}
                >
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    value={field.value}
                    onChange={handlePasswordChange}
                    disabled={isLoading}
                    className={`py-6 pl-4 pr-10 border-[#E5E7EB] focus:border-[#2979FF] focus:ring-[#2979FF]/20 ${
                      passwordValid === false
                        ? 'border-red-500'
                        : passwordValid === true
                        ? 'border-green-500'
                        : ''
                    }`}
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    tabIndex={-1}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
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
              <FormMessage className="text-red-500 text-xs" />
              {passwordValid === false && (
                <p className="text-xs text-red-500 mt-1">
                  Password must be at least 6 characters
                </p>
              )}
            </FormItem>
          )}
        />

        <div className="flex items-center space-x-2">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    id="remember-me"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-[#2979FF] data-[state=checked]:border-[#2979FF]"
                  />
                </FormControl>
                <label
                  htmlFor="remember-me"
                  className="text-sm font-medium text-[#222831]/80 leading-none cursor-pointer"
                >
                  Remember me for 30 days
                </label>
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-[#2979FF] hover:bg-[#1565C0] text-white transition-colors py-6 flex items-center justify-center"
          aria-label="Sign in"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>
    </Form>
  );
}

// Loading fallback for the Suspense boundary
function SignInFormLoading() {
  return (
    <div className="p-8 flex justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[#2979FF]" />
    </div>
  );
}

export default function SignInPage() {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-[#F5F8FA]">
        <LandingNavbar />
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
                Welcome back to Blastify 👋
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="text-sm text-[#222831]/70"
              >
                Nice to see you again! Please enter your details
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="border border-[#E5E7EB] bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
                {/* Accent color border at the top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2979FF] to-[#1565C0]"></div>

                <CardContent className="pt-6">
                  <Suspense fallback={<SignInFormLoading />}>
                    <SignInForm />
                  </Suspense>
                </CardContent>

                <div className="px-6 pb-2">
                  <div className="relative flex items-center justify-center mb-4">
                    <Separator className="absolute w-full bg-[#E5E7EB]" />
                    <span className="relative bg-white px-2 text-xs text-[#222831]/60">
                      OR
                    </span>
                  </div>
                </div>

                <CardFooter className="flex flex-col p-6 pt-2 gap-4">
                  <Button
                    variant="outline"
                    className="w-full border-[#E5E7EB] hover:bg-[#F5F8FA] hover:border-[#2979FF]/30 py-6 transition-all"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continue with Google
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-[#222831]/70">
                      Don&apos;t have an account?{' '}
                      <Link
                        href="/signup"
                        className="text-[#2979FF] font-medium hover:underline"
                      >
                        Sign up
                      </Link>
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
