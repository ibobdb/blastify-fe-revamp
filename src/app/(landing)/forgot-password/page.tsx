'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import { LandingNavbar } from '@/components/landing/safe-landing-navbar';
import { Footer } from '@/components/landing/footer';

export default function ForgotPasswordPage() {
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
                    Forgot Password
                  </h1>
                  <p className="text-[#222831]/70 text-sm">
                    Enter your email address and we'll send you a link to reset
                    your password
                  </p>
                </div>

                <ForgotPasswordForm />

                <div className="mt-6 text-center">
                  <Button
                    variant="link"
                    asChild
                    className="text-[#2979FF] hover:text-[#1565C0] p-0"
                  >
                    <Link
                      href="/signin"
                      className="flex items-center justify-center gap-1"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Back to Sign in</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
