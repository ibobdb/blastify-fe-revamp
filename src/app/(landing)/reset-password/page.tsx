'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { MessageSquare, Loader2 } from 'lucide-react';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { LandingNavbar } from '@/components/landing/safe-landing-navbar';
import { Footer } from '@/components/landing/footer';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// Component that safely uses useSearchParams within a Suspense boundary
function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  return (
    <>
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div className="p-6 bg-amber-50 border border-amber-100 rounded-lg text-center">
          <h3 className="text-lg font-medium text-amber-800 mb-2">
            Invalid or Missing Reset Token
          </h3>
          <p className="text-amber-700 mb-4">
            The password reset link you followed appears to be invalid or
            expired.
          </p>
          <Button
            className="mt-2 bg-[#2979FF] hover:bg-[#1565C0] transition-all"
            asChild
          >
            <Link href="/forgot-password">Request New Reset Link</Link>
          </Button>
        </div>
      )}

      <div className="mt-6 text-center">
        <Button
          variant="link"
          asChild
          className="text-[#2979FF] hover:text-[#1565C0] p-0"
        >
          <Link href="/signin">Back to Sign in</Link>
        </Button>
      </div>
    </>
  );
}

// Loading fallback for the Suspense boundary
function ResetPasswordLoading() {
  return (
    <div className="p-8 flex flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[#2979FF] mb-3" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
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

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="border-[#E5E7EB] shadow-sm">
              <div className="p-6">
                <div className="space-y-2 text-center mb-6">
                  <h1 className="text-2xl font-bold tracking-tight text-[#222831]">
                    Reset Your Password
                  </h1>
                  <p className="text-[#222831]/70 text-sm">
                    Create a new password for your account
                  </p>
                </div>

                <Suspense fallback={<ResetPasswordLoading />}>
                  <ResetPasswordContent />
                </Suspense>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
