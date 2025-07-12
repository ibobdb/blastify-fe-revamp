'use client';

import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { Card, CardContent } from '@/components/ui/card';
import {
  MessageSquare,
  Clock,
  Users,
  Star,
  Award,
  TrendingUp,
  ThumbsUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function StatsSection() {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 right-60 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-40 left-20 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">
            Trusted by{' '}
            <span className="text-primary">Businesses Worldwide</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-4">
            Our platform delivers impressive results that help businesses grow
            and connect with their audience
          </p>

          <div className="inline-flex items-center justify-center px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mt-2">
            <TrendingUp className="w-4 h-4 mr-2" /> Our Impact in Numbers
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <StatCard
            icon={<MessageSquare className="h-8 w-8" />}
            iconBgColor="from-primary/90 to-primary"
            iconTextColor="text-primary-foreground"
            value={5}
            suffix="M+"
            description="Messages Sent Monthly"
            delay={0}
          />
          <StatCard
            icon={<Users className="h-8 w-8" />}
            iconBgColor="from-purple-500/90 to-purple-600"
            iconTextColor="text-white"
            value={12000}
            suffix="+"
            description="Active Business Users"
            delay={0.1}
          />
          <StatCard
            icon={<Clock className="h-8 w-8" />}
            iconBgColor="from-orange-500/90 to-orange-600"
            iconTextColor="text-white"
            value={98}
            suffix="%"
            description="Delivery Rate"
            delay={0.2}
          />
          <StatCard
            icon={<Star className="h-8 w-8" />}
            iconBgColor="from-green-500/90 to-green-600"
            iconTextColor="text-white"
            value={4.8}
            decimals={1}
            suffix="/5"
            description="Customer Satisfaction"
            delay={0.3}
            badge={
              <span className="absolute top-1 right-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-foreground text-xs font-bold px-2 py-0.5 rounded-md shadow-md flex items-center gap-1 z-20">
                <Award className="w-3 h-3" /> Top Rated
              </span>
            }
          />
        </div>

        {/* Testimonial quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center max-w-4xl mx-auto"
        >
          <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
          </div>{' '}
          <blockquote className="text-lg italic text-muted-foreground mb-4">
            &ldquo;Blastify has revolutionized how we communicate with our
            customers. The platform is intuitive, efficient, and the results
            speak for themselves. Our engagement has never been higher!&rdquo;
          </blockquote>{' '}
          <cite className="text-sm font-medium text-foreground">
            &mdash; Maria Rodriguez, Marketing VP at Global Retail Inc.
          </cite>
        </motion.div>

        <div className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                Why Choose Blastify?
              </h3>
              <ul className="space-y-4">
                <BenefitItem
                  title="Cost-Effective Marketing"
                  description="Reach thousands of customers at a fraction of the cost of traditional marketing channels."
                  delay={0}
                  color="hsl(var(--primary))"
                />
                <BenefitItem
                  title="High Engagement Rates"
                  description="WhatsApp messages have an average open rate of 98%, significantly higher than email."
                  delay={0.1}
                  color="hsl(var(--chart-2))"
                />
                <BenefitItem
                  title="Easy to Use"
                  description="Our intuitive interface makes it simple to create and send campaigns, even for non-technical users."
                  delay={0.2}
                  color="hsl(var(--chart-4))"
                />
                <BenefitItem
                  title="Dedicated Support"
                  description="Our customer success team is available to help you optimize your messaging strategy."
                  delay={0.3}
                  color="hsl(var(--chart-5))"
                />
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center"
            >
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary to-primary/80 p-1 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="bg-card rounded-xl p-8 h-full">
                  <div className="absolute top-4 right-4 flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-card-foreground">
                    Customer Success Story
                  </h3>{' '}
                  <p className="text-lg mb-6 text-muted-foreground">
                    &ldquo;Blastify transformed our customer communication
                    strategy. We&apos;ve seen a{' '}
                    <span className="font-medium text-primary">
                      35% increase in engagement
                    </span>{' '}
                    and a{' '}
                    <span className="font-medium text-primary">
                      22% boost in sales
                    </span>{' '}
                    since implementing their WhatsApp marketing solution.&rdquo;
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mr-4 text-primary-foreground shadow-md">
                      <span className="font-bold">JD</span>
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">
                        John Doe
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Marketing Director, TechCorp
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  decimals?: number;
  description: string;
  delay: number;
  iconBgColor?: string;
  iconTextColor?: string;
  badge?: React.ReactNode;
}

function StatCard({
  icon,
  value,
  suffix = '',
  decimals = 0,
  description,
  delay,
  iconBgColor = 'from-primary/90 to-primary',
  iconTextColor = 'text-primary-foreground',
  badge,
}: StatCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Card
        className={cn(
          'text-center h-full border border-border transition-all duration-300 bg-card relative overflow-hidden',
          hovered
            ? 'border-transparent shadow-lg transform -translate-y-1'
            : 'shadow-sm'
        )}
      >
        {badge && badge}
        <CardContent className="pt-8 relative z-10">
          <div
            className={cn(
              'w-20 h-20 rounded-2xl bg-gradient-to-br',
              iconBgColor,
              'flex items-center justify-center mx-auto mb-6 shadow-md',
              hovered ? 'scale-110' : 'scale-100',
              'transition-transform duration-300'
            )}
          >
            <div className={iconTextColor}>{icon}</div>
          </div>
          <h3 className="text-4xl md:text-5xl font-bold flex items-center justify-center mb-2 text-card-foreground">
            <CountUp
              end={value}
              duration={2.5}
              decimals={decimals}
              enableScrollSpy
              scrollSpyOnce
            />
            <span>{suffix}</span>
          </h3>
          <p className="text-muted-foreground font-medium">{description}</p>
        </CardContent>

        {/* Decorative background element that shows on hover */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br opacity-0',
            iconBgColor,
            'opacity-5',
            hovered ? 'opacity-5' : 'opacity-0',
            'transition-opacity duration-300'
          )}
        />
      </Card>
    </motion.div>
  );
}

interface BenefitItemProps {
  title: string;
  description: string;
  delay: number;
  color?: string;
}

function BenefitItem({
  title,
  description,
  delay,
  color = 'hsl(var(--primary))',
}: BenefitItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="flex items-start gap-3"
    >
      <div className="mt-1">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{
            background: `${color}20`,
            color: color,
          }}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
        </div>
      </div>
      <div>
        <h4 className="font-medium text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}
