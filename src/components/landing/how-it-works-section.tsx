'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  MessageSquare,
  Send,
  FileSpreadsheet,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section id="how-it-works" className="py-16 bg-[#F5F8FA] relative">
      {/* Minimalist background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-10 top-40 rounded-full w-32 h-32 bg-[#2979FF]/3"></div>
        <div className="absolute right-10 bottom-40 rounded-full w-40 h-40 bg-[#9C27B0]/3"></div>
      </div>{' '}
      <div className="container px-4 mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-start justify-between mb-10 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            {' '}
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-[#222831]">
              Simple Credit-Based{' '}
              <span className="text-[#2979FF]">Messaging</span> — No Complicated
              Plans
            </h2>
            <p className="text-lg text-[#222831]/70">
              Sign up, get 100 free credits, send messages, and top up whenever
              you need
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              size="default"
              className="bg-[#2979FF] hover:bg-[#1565C0] text-white shadow-sm hover:shadow transition-all group"
              asChild
            >
              <Link href="/signup" className="flex items-center gap-1.5">
                Get Started Now
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>{' '}
        {/* Progress line connecting steps - slimmer version */}
        <div className="hidden md:flex justify-center items-center gap-1 mb-6 max-w-4xl mx-auto">
          <div
            className={cn(
              'h-0.5 flex-1 transition-colors duration-500',
              activeStep >= 1 ? 'bg-[#2979FF]' : 'bg-[#E5E7EB]'
            )}
          />
          <div
            className={cn(
              'h-0.5 flex-1 transition-colors duration-500',
              activeStep >= 2 ? 'bg-[#9C27B0]' : 'bg-[#E5E7EB]'
            )}
          />
          <div
            className={cn(
              'h-0.5 flex-1 transition-colors duration-500',
              activeStep >= 3 ? 'bg-[#FF9800]' : 'bg-[#E5E7EB]'
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 max-w-5xl mx-auto">
          {' '}
          <StepCard
            number={1}
            icon={<MessageSquare className="h-5 w-5" />}
            secondaryIcon={<FileSpreadsheet className="h-4 w-4" />}
            title="Sign Up & Get Free Credits"
            description="Create an account and instantly receive 100 free credits—no payment required"
            delay={0}
            color="#2979FF"
            isActive={activeStep === 1}
            onMouseEnter={() => setActiveStep(1)}
          />
          <StepCard
            number={2}
            icon={<Send className="h-5 w-5" />}
            secondaryIcon={<CalendarDays className="h-5 w-5" />}
            title="Send Messages Anytime"
            description="Use your credits to send messages instantly or schedule them for later—all features included"
            delay={0.1}
            color="#9C27B0"
            isActive={activeStep === 2}
            onMouseEnter={() => setActiveStep(2)}
          />
          <StepCard
            number={3}
            icon={<Zap className="h-6 w-6" />}
            secondaryIcon={<CheckCircle2 className="h-5 w-5" />}
            title="Top Up When Needed"
            description="Purchase more credits only when you need them—no subscriptions, no recurring fees"
            delay={0.2}
            color="#FF9800"
            isActive={activeStep === 3}
            onMouseEnter={() => setActiveStep(3)}
          />
        </div>{' '}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 bg-gradient-to-r from-[#2979FF]/5 to-[#9C27B0]/5 rounded-xl overflow-hidden shadow-md"
        ></motion.div>
      </div>
    </section>
  );
}

interface StepCardProps {
  number: number;
  icon: React.ReactNode;
  secondaryIcon?: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  color: string;
  isActive: boolean;
  onMouseEnter: () => void;
}

function StepCard({
  number,
  icon,
  title,
  description,
  delay,
  color,
  isActive,
  onMouseEnter,
}: StepCardProps) {
  const activeBg = `${color}10`;
  const borderColor = isActive ? color : '#E5E7EB';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      onMouseEnter={onMouseEnter}
      className="h-full"
    >
      <Card
        className={cn(
          'relative h-full border transition-all duration-300 overflow-hidden bg-white hover:shadow-lg',
          isActive ? 'shadow-md border-[1.5px]' : 'shadow-sm'
        )}
        style={{ borderColor }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ backgroundColor: color }}
        />

        <div className="p-4 sm:p-5 flex flex-col h-full">
          <div className="flex items-start gap-3 mb-3">
            {/* Number indicator */}
            <motion.div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ backgroundColor: color }}
              animate={{ scale: isActive ? 1.05 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {number}
            </motion.div>

            <div>
              <h3 className="text-lg font-bold mb-1 text-[#222831] flex items-center gap-2">
                {title}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                )}
              </h3>
              <p className="text-[#222831]/70 text-sm">{description}</p>
            </div>
          </div>{' '}
          <div className="mt-auto pt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Main icon */}
              <div
                className={cn(
                  'w-10 h-10 rounded-lg inline-flex items-center justify-center relative',
                  isActive ? 'shadow-sm' : ''
                )}
                style={{
                  backgroundColor: activeBg,
                  color: color,
                }}
              >
                <motion.div
                  animate={{
                    rotateY: isActive ? [0, 180] : 0,
                  }}
                  transition={{
                    duration: 0.7,
                    ease: 'easeInOut',
                    times: [0, 1],
                    delay: 0.1,
                  }}
                  className="flex items-center justify-center w-full h-full"
                >
                  {icon}
                </motion.div>

                {/* Secondary icon */}
              </div>
            </div>

            {/* Action indicator */}
            <div
              className={cn(
                'flex items-center text-xs font-medium gap-1 transition-opacity',
                isActive ? 'opacity-100' : 'opacity-0'
              )}
              style={{ color }}
            >
              <span>Learn more</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>

        {/* Background decorative element - minimized */}
        {isActive && (
          <div
            className="absolute bottom-0 right-0 w-12 h-12 rounded-tl-[50px] opacity-3"
            style={{ backgroundColor: color }}
          />
        )}
      </Card>
    </motion.div>
  );
}
