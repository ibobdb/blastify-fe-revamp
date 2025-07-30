import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

// Providers
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/context/auth.context';
import { LoadingProvider } from '@/context/loading.context';
import { ConfirmProvider } from '@/context/confirm.context';
import { LoadingContainer } from '@/components/loading-container';
import { Toaster } from '@/components/ui/sonner';
import { AlertProvider } from '@/context/alert.context';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Blastify | WhatsApp Marketing Platform',
    template: '%s | Blastify',
  },
  description:
    'Send personalized WhatsApp campaigns to thousands of contacts with easy scheduling, templates, and analytics. No technical skills required.',
  keywords: [
    'WhatsApp marketing',
    'bulk messaging',
    'business messaging',
    'WhatsApp campaigns',
    'message templates',
    'blastify',
  ],
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Blastify | WhatsApp Marketing Platform',
    description:
      'Send personalized WhatsApp campaigns to thousands of contacts with easy scheduling, templates, and analytics. No technical skills required.',
    siteName: 'Blastify',
    images: [
      {
        url: '/images/illustration/lp.svg',
        width: 1200,
        height: 630,
        alt: 'Blastify WhatsApp Marketing Platform',
      },
    ],
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  applicationName: 'Blastify',
  icons: {
    icon: ['/favicon.ico'],
    apple: ['/apple-touch-icon.png'],
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <LoadingProvider>
              <AlertProvider>
                <ConfirmProvider>
                  <LoadingContainer>{children}</LoadingContainer>
                  <Toaster />
                </ConfirmProvider>
              </AlertProvider>
            </LoadingProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
