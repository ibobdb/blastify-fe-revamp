'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, MessageSquare, Zap } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#FFFFFF] to-[#F5F8FA]">
      {/* Decorative elements */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#2979FF]/20 rounded-full filter blur-3xl" />
        <div className="absolute top-40 right-20 w-80 h-80 bg-[#1565C0]/20 rounded-full filter blur-3xl" />
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-[#FFD54F]/20 rounded-full filter blur-3xl" />
      </div>

      <div className="container relative z-10 px-4 py-24 md:py-32 mx-auto flex flex-col lg:flex-row items-center gap-12">
        <motion.div
          className="flex-1 text-center lg:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {' '}
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-[#222831]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.span
              className="inline-block text-[#2979FF] mb-2 relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              Only Pay
            </motion.span>
            <br />
            For What You <span className="text-[#2979FF]">Use</span> —{' '}
            <span className="relative">No Subscriptions</span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-[#222831]/80 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className="text-[#2979FF] font-medium">100 Free Credits</span>{' '}
            on signup. Send powerful WhatsApp campaigns with{' '}
            <span className="text-[#2979FF] font-medium">
              full features for everyone
            </span>
            . No subscriptions, no locked features — just{' '}
            <span className="text-[#2979FF] font-medium">
              simple, transparent pricing
            </span>
            .
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                asChild
                size="lg"
                className="text-lg px-8 py-6 bg-[#2979FF] hover:bg-[#1565C0] text-white font-medium shadow-lg shadow-[#2979FF]/25 group relative overflow-hidden"
              >
                <Link href="/signup" className="flex items-center gap-2">
                  {' '}
                  <span>Get 100 Free Credits</span>
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{
                      x: [0, 5, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      repeatType: 'loop',
                    }}
                  >
                    <Zap className="h-5 w-5" />
                  </motion.div>
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                </Link>
              </Button>
            </motion.div>

            <Link
              href="#features"
              className="text-[#2979FF] hover:text-[#1565C0] text-lg font-medium flex items-center gap-2 transition-colors"
            >
              See Features
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex-1"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="relative w-full max-w-md mx-auto lg:max-w-full">
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-[#2979FF]/30 rounded-full filter blur-xl" />
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[#FFD54F]/30 rounded-full filter blur-xl" />

            {/* Message blasting animation illustration */}
            <motion.div
              className="relative p-6"
              whileHover={{
                y: -5,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {/* Phone device frame with messages */}
              <div className="relative mx-auto" style={{ maxWidth: '320px' }}>
                {/* Phone frame */}
                <div className="relative bg-[#222831] rounded-[32px] p-3 shadow-xl border-4 border-[#222831]">
                  {/* Phone screen */}
                  <div className="bg-[#F5F8FA] rounded-[24px] overflow-hidden h-[500px] relative">
                    {/* WhatsApp-like header */}
                    <div className="bg-[#2979FF] text-white p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Blastify</div>
                        <div className="text-xs opacity-80">
                          WhatsApp Marketing
                        </div>
                      </div>
                    </div>

                    {/* Message bubbles */}
                    <div className="p-4 space-y-4 relative h-[calc(100%-60px)]">
                      {/* Outgoing messages */}
                      {[...Array(4)].map((_, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20, scale: 0.8 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          transition={{
                            duration: 0.5,
                            delay: 0.5 + index * 0.15,
                            type: 'spring',
                          }}
                          className="flex justify-end"
                        >
                          <div className="bg-[#DCF8C6] rounded-lg rounded-tr-none p-3 max-w-[80%] shadow-sm">
                            <p className="text-xs">
                              {
                                {
                                  0: 'Hi there! Check out our new summer collection! 🌞',
                                  1: 'Get 25% off your first purchase with code WELCOME25',
                                  2: 'Limited time offer! Sale ends this Sunday',
                                  3: 'Reply YES to get notified about future deals!',
                                }[index]
                              }
                            </p>
                            <div className="flex justify-end items-center gap-1 mt-1">
                              <span className="text-[10px] text-gray-500">
                                {['09:15', '09:16', '09:16', '09:17'][index]}
                              </span>
                              <svg
                                className="w-3 h-3 text-[#2979FF]"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                              </svg>
                              <svg
                                className="w-3 h-3 text-[#2979FF] -ml-2"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                              </svg>
                            </div>
                          </div>
                        </motion.div>
                      ))}

                      {/* Multiple recipients illustration */}
                      <motion.div
                        className="absolute bottom-4 left-0 right-0 flex justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                      >
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-md border border-[#E5E7EB] text-center">
                          <div className="text-sm font-medium text-[#2979FF]">
                            Message sent to 1,254 recipients
                          </div>
                          <div className="text-xs text-[#222831]/70 mt-1">
                            Delivered rate: 98%
                          </div>
                          <div className="flex justify-center mt-2 -space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-6 h-6 rounded-full border-2 border-white bg-[${
                                  [
                                    '#FF6B6B',
                                    '#4ECDC4',
                                    '#45B7D1',
                                    '#F9C846',
                                    '#9055A2',
                                  ][i]
                                }]`}
                              />
                            ))}
                            <div className="w-6 h-6 rounded-full border-2 border-white bg-[#2979FF] flex items-center justify-center text-white text-[10px]">
                              <span>+1k</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Floating notification bubbles */}
                <motion.div
                  className="absolute -right-16 top-12 bg-white rounded-lg p-2 shadow-lg border border-[#E5E7EB] w-32"
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                >
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                      ✓
                    </div>
                    <div>
                      <p className="text-xs font-medium">Campaign sent</p>
                      <p className="text-[10px] text-gray-500">
                        1,254 messages
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -left-16 top-32 bg-white rounded-lg p-2 shadow-lg border border-[#E5E7EB] w-32"
                  initial={{ opacity: 0, scale: 0.8, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.7 }}
                >
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#2979FF] flex items-center justify-center text-white text-xs">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium">98.2% open rate</p>
                      <p className="text-[10px] text-gray-500">New record!</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -right-12 bottom-32 bg-white rounded-lg p-2 shadow-lg border border-[#E5E7EB] w-28"
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.9 }}
                >
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#FFD54F] flex items-center justify-center text-[#222831] text-xs">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium">+27% CTR</p>
                      <p className="text-[10px] text-gray-500">vs email</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
