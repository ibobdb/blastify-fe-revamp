'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#2979FF] to-[#1565C0]">
      <div className="container px-4 mx-auto">
        {' '}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Start With 100 Free Credits, No Commitment
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-10">
            All features. No subscriptions. Just buy credits when you need more.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-[#2979FF] hover:bg-white/90 text-lg px-8"
              asChild
            >
              <Link href="/signup">Get 100 Free Credits</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white/10 text-lg px-8"
              asChild
            >
              <Link href="/contact">See How It Works</Link>
            </Button>{' '}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
              <CheckCircle className="h-4 w-4 text-white" />
              <p className="text-sm text-white">No hidden fees</p>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
              <CheckCircle className="h-4 w-4 text-white" />
              <p className="text-sm text-white">No credit card required</p>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
              <CheckCircle className="h-4 w-4 text-white" />
              <p className="text-sm text-white">Full features for everyone</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
