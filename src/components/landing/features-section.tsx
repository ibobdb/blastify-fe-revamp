'use client';

import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageCircle,
  Users,
  Zap,
  BarChart3,
  CheckCircle2,
  Clock,
  Image as ImageIcon,
  FileSpreadsheet,
  Tags,
  UserPlus,
  TrendingUp,
  Download,
  ArrowRight,
  Filter,
  UserCheck,
  Settings,
  BadgeCheck,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function FeaturesSection() {
  const tabContentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
      },
    },
    exit: { opacity: 0 },
  };
  // Feature card icon styles with different colors - removing as currently unused
  // Will be used in future feature expansion
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const iconStyles = [
    { bg: 'bg-[#2979FF]/10', color: 'text-[#2979FF]' }, // Blue
    { bg: 'bg-[#9C27B0]/10', color: 'text-[#9C27B0]' }, // Purple
    { bg: 'bg-[#FF9800]/10', color: 'text-[#FF9800]' }, // Orange
    { bg: 'bg-[#00BCD4]/10', color: 'text-[#00BCD4]' }, // Cyan
    { bg: 'bg-[#F06292]/10', color: 'text-[#F06292]' }, // Pink
    { bg: 'bg-[#43A047]/10', color: 'text-[#43A047]' }, // Green
    { bg: 'bg-[#FFD54F]/10', color: 'text-[#FFD54F]' }, // Yellow
    { bg: 'bg-[#5E35B1]/10', color: 'text-[#5E35B1]' }, // Deep Purple
    { bg: 'bg-[#26A69A]/10', color: 'text-[#26A69A]' }, // Teal
  ];

  return (
    <section
      id="features"
      className="py-24 bg-gradient-to-b from-[#F5F8FA] to-white relative overflow-hidden"
    >
      {/* Subtle background patterns */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-[#2979FF]" />
        <div className="absolute bottom-40 right-10 w-60 h-60 rounded-full bg-[#9C27B0]" />
        <div className="absolute top-1/3 right-1/4 w-20 h-20 rounded-full bg-[#FFD54F]" />
      </div>

      <div className="container px-4 mx-auto relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          {' '}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight mb-4 text-[#222831]"
          >
            <span className="text-[#2979FF]">Full Features</span> For Everyone —
            No Exceptions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-[#222831]/80 leading-relaxed"
          >
            API access, advanced scheduling, message paraphrasing, and 24/7
            support— all included for every user, regardless of spend level.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center items-center gap-3 mt-4 mb-8"
          >
            <Badge className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5">
              Equal Access
            </Badge>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5">
              No Locked Features
            </Badge>
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1.5">
              No Subscriptions
            </Badge>
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 px-3 py-1.5">
              Pay-As-You-Go
            </Badge>
          </motion.div>
        </div>

        <Tabs defaultValue="bulk" className="w-full">
          <motion.div
            className="flex justify-center mb-10"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            {' '}
            <TabsList className="flex w-full max-w-xl bg-white p-1.5 rounded-full border border-[#E5E7EB] shadow-sm gap-1">
              <TabsTrigger
                value="bulk"
                className="flex-1 data-[state=active]:bg-[#2979FF] data-[state=active]:text-white text-[#222831] hover:text-[#2979FF] data-[state=active]:shadow-md transition-all duration-200 rounded-full py-2.5 font-medium"
              >
                Bulk Messaging
              </TabsTrigger>
              <TabsTrigger
                value="targeting"
                className="flex-1 data-[state=active]:bg-[#2979FF] data-[state=active]:text-white text-[#222831] hover:text-[#2979FF] data-[state=active]:shadow-md transition-all duration-200 rounded-full py-2.5 font-medium"
              >
                Advanced Targeting
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex-1 data-[state=active]:bg-[#2979FF] data-[state=active]:text-white text-[#222831] hover:text-[#2979FF] data-[state=active]:shadow-md transition-all duration-200 rounded-full py-2.5 font-medium"
              >
                Analytics & Reports
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="bulk" className="w-full" asChild>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={tabContentVariants}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0 }}
                  className="group"
                >
                  <Card className="h-full border-2 border-[#E5E7EB] bg-white relative overflow-hidden hover:shadow-xl hover:border-[#2979FF] transition-all duration-300 group-hover:-translate-y-1">
                    <div className="absolute top-0 right-0 mt-4 mr-4">
                      <Badge
                        variant="default"
                        className="bg-[#2979FF] hover:bg-[#1565C0]"
                      >
                        Popular
                      </Badge>
                    </div>
                    <CardHeader>
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#2979FF]/90 to-[#1565C0] flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <MessageCircle className="w-7 h-7 text-white" />
                      </div>
                      <CardTitle className="text-[#222831] text-xl">
                        Mass Messaging
                      </CardTitle>
                      <CardDescription className="text-[#222831]/70 font-medium mt-1">
                        Reach thousands in seconds
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                          <CheckCircle2 className="text-[#2979FF] w-5 h-5 flex-shrink-0" />
                          <span className="text-[#222831]">
                            <strong>Unlimited contacts</strong>
                          </span>
                        </li>
                        <li className="flex items-center gap-3">
                          <Clock className="text-[#2979FF] w-5 h-5 flex-shrink-0" />
                          <span className="text-[#222831]">
                            Scheduled delivery
                          </span>
                        </li>
                        <li className="flex items-center gap-3">
                          <ImageIcon className="text-[#2979FF] w-5 h-5 flex-shrink-0" />
                          <span className="text-[#222831]">
                            Rich media support
                          </span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter className="pt-2 pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mt-2">
                      <a
                        href="#"
                        className="text-[#2979FF] text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        Learn more <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    </CardFooter>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="group"
                >
                  <Card className="h-full border-2 border-[#E5E7EB] bg-white relative overflow-hidden hover:shadow-xl hover:border-[#9C27B0] transition-all duration-300 group-hover:-translate-y-1">
                    <div className="absolute top-0 right-0 mt-4 mr-4">
                      <Badge
                        variant="outline"
                        className="border-[#9C27B0] text-[#9C27B0] bg-[#9C27B0]/5"
                      >
                        New
                      </Badge>
                    </div>
                    <CardHeader>
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#9C27B0]/90 to-[#7B1FA2] flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <Users className="w-7 h-7 text-white" />
                      </div>
                      <CardTitle className="text-[#222831] text-xl">
                        Contact Management
                      </CardTitle>
                      <CardDescription className="text-[#222831]/70 font-medium mt-1">
                        Smart audience organization
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                          <FileSpreadsheet className="text-[#9C27B0] w-5 h-5 flex-shrink-0" />
                          <span className="text-[#222831]">
                            CSV/Excel import
                          </span>
                        </li>
                        <li className="flex items-center gap-3">
                          <Tags className="text-[#9C27B0] w-5 h-5 flex-shrink-0" />
                          <span className="text-[#222831]">
                            Custom contact groups
                          </span>
                        </li>
                        <li className="flex items-center gap-3">
                          <UserPlus className="text-[#9C27B0] w-5 h-5 flex-shrink-0" />
                          <span className="text-[#222831]">
                            Duplicate management
                          </span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter className="pt-2 pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mt-2">
                      <a
                        href="#"
                        className="text-[#9C27B0] text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        Learn more <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    </CardFooter>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="group"
                >
                  <Card className="h-full border-2 border-[#E5E7EB] bg-white relative overflow-hidden hover:shadow-xl hover:border-[#FF9800] transition-all duration-300 group-hover:-translate-y-1">
                    <CardHeader>
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FF9800]/90 to-[#F57C00] flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <Zap className="w-7 h-7 text-white" />
                      </div>
                      <CardTitle className="text-[#222831] text-xl">
                        Message Templates
                      </CardTitle>
                      <CardDescription className="text-[#222831]/70 font-medium mt-1">
                        Pre-approved messaging
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                          <Sparkles className="text-[#FF9800] w-5 h-5 flex-shrink-0" />
                          <span className="text-[#222831]">
                            <strong>Personalization tags</strong>
                          </span>
                        </li>
                        <li className="flex items-center gap-3">
                          <BadgeCheck className="text-[#FF9800] w-5 h-5 flex-shrink-0" />
                          <span className="text-[#222831]">
                            WhatsApp-approved templates
                          </span>
                        </li>
                        <li className="flex items-center gap-3">
                          <Settings className="text-[#FF9800] w-5 h-5 flex-shrink-0" />
                          <span className="text-[#222831]">
                            Reusable campaign designs
                          </span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter className="pt-2 pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mt-2">
                      <a
                        href="#"
                        className="text-[#FF9800] text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        Learn more <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    </CardFooter>
                  </Card>
                </motion.div>
              </div>

              <div className="mt-10 text-center">
                <Badge className="bg-[#2979FF]/10 text-[#2979FF] hover:bg-[#2979FF]/15">
                  Trusted by 5,000+ businesses
                </Badge>
              </div>
            </motion.div>
          </TabsContent>

          {/* Additional tabs with similar enhancements */}
          <TabsContent value="targeting" className="w-full" asChild>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={tabContentVariants}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Similar cards with different content for targeting features */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0 }}
                  className="group"
                >
                  <Card className="h-full border-2 border-[#E5E7EB] bg-white relative overflow-hidden hover:shadow-xl hover:border-[#00BCD4] transition-all duration-300 group-hover:-translate-y-1">
                    <div className="absolute top-0 right-0 mt-4 mr-4">
                      <Badge
                        variant="default"
                        className="bg-[#00BCD4] hover:bg-[#0097A7]"
                      >
                        Featured
                      </Badge>
                    </div>
                    <CardHeader>
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00BCD4]/90 to-[#0097A7] flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <Filter className="w-7 h-7 text-white" />
                      </div>
                      <CardTitle className="text-[#222831] text-xl">
                        Audience Segmentation
                      </CardTitle>
                      <CardDescription className="text-[#222831]/70 font-medium mt-1">
                        Precise targeting tools
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                          <CheckCircle2 className="text-[#00BCD4] w-5 h-5 flex-shrink-0" />
                          <span className="text-[#222831]">
                            <strong>Custom audience filters</strong>
                          </span>
                        </li>
                        <li className="flex items-center gap-3">
                          <UserCheck className="text-[#00BCD4] w-5 h-5 flex-shrink-0" />
                          <span className="text-[#222831]">
                            Behavior-based targeting
                          </span>
                        </li>
                        <li className="flex items-center gap-3">
                          <Tags className="text-[#00BCD4] w-5 h-5 flex-shrink-0" />
                          <span className="text-[#222831]">
                            Dynamic demographic filtering
                          </span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter className="pt-2 pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mt-2">
                      <a
                        href="#"
                        className="text-[#00BCD4] text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        Learn more <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    </CardFooter>
                  </Card>
                </motion.div>

                {/* Additional targeting cards would go here */}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="analytics" className="w-full" asChild>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={tabContentVariants}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Similar cards with different content for analytics features */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0 }}
                  className="group"
                >
                  <Card className="h-full border-2 border-[#E5E7EB] bg-white relative overflow-hidden hover:shadow-xl hover:border-[#5E35B1] transition-all duration-300 group-hover:-translate-y-1">
                    <div className="absolute top-0 right-0 mt-4 mr-4">
                      <Badge
                        variant="outline"
                        className="border-[#5E35B1] text-[#5E35B1] bg-[#5E35B1]/5"
                      >
                        Advanced
                      </Badge>
                    </div>
                    <CardHeader>
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#5E35B1]/90 to-[#4527A0] flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <BarChart3 className="w-7 h-7 text-white" />
                      </div>
                      <CardTitle className="text-[#222831] text-xl">
                        Performance Analytics
                      </CardTitle>
                      <CardDescription className="text-[#222831]/70 font-medium mt-1">
                        Data-driven optimization
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                          <CheckCircle2 className="text-[#5E35B1] w-5 h-5 flex-shrink-0" />
                          <span className="text-[#222831]">
                            <strong>Real-time campaign stats</strong>
                          </span>
                        </li>
                        <li className="flex items-center gap-3">
                          <TrendingUp className="text-[#5E35B1] w-5 h-5 flex-shrink-0" />
                          <span className="text-[#222831]">
                            Conversion tracking
                          </span>
                        </li>
                        <li className="flex items-center gap-3">
                          <Download className="text-[#5E35B1] w-5 h-5 flex-shrink-0" />
                          <span className="text-[#222831]">
                            Custom report export
                          </span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter className="pt-2 pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mt-2">
                      <a
                        href="#"
                        className="text-[#5E35B1] text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        Learn more <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    </CardFooter>
                  </Card>
                </motion.div>

                {/* Additional analytics cards would go here */}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
