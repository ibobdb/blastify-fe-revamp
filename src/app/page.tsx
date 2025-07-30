import { HeroSection } from '@/components/landing/hero-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { StatsSection } from '@/components/landing/stats-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { PricingSection } from '@/components/landing/pricing-section';
import { FaqSection } from '@/components/landing/faq-section';
import { CtaSection } from '@/components/landing/cta-section';
import { Footer } from '@/components/landing/footer';
import { LandingNavbar } from '@/components/landing/landing-navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blastify | Powerful WhatsApp Marketing Platform for Business Growth',
  description:
    'Send personalized WhatsApp campaigns to thousands of contacts with easy scheduling, templates, and analytics. No technical skills required.',
  keywords:
    'WhatsApp marketing, bulk messaging, business messaging, WhatsApp campaigns, message templates',
  openGraph: {
    title: 'Blastify | WhatsApp Marketing Platform',
    description: 'Connect with customers through powerful WhatsApp campaigns.',
    type: 'website',
    url: 'https://blastify.tech',
    images: [
      {
        url: '/images/illustration/lp.svg',
        width: 1200,
        height: 630,
        alt: 'Blastify WhatsApp Marketing Platform',
      },
    ],
    siteName: 'Blastify',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blastify | WhatsApp Marketing Platform',
    description:
      'Send personalized WhatsApp campaigns to thousands of contacts with easy scheduling, templates, and analytics.',
    images: ['/images/illustration/lp.svg'],
    site: '@blastify',
    creator: '@blastify',
  },
  applicationName: 'Blastify',
  authors: [{ name: 'Blastify Team', url: 'https://blastify.tech/about' }],
  creator: 'Blastify Team',
  publisher: 'Blastify',
  metadataBase: new URL('https://blastify.tech'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'id-ID': '/id-ID',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  icons: {
    icon: ['/favicon.ico'],
    apple: ['/apple-touch-icon.png'],
  },
};

export default function Home() {
  return (
    <>
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <HowItWorksSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
