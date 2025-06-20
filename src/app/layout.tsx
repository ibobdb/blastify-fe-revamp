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

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Blastify - Modern Web App',
  description: 'A modern web application with a beautiful UI',
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
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <LoadingProvider>
              <ConfirmProvider>
                <LoadingContainer>{children}</LoadingContainer>
                <Toaster />
              </ConfirmProvider>
            </LoadingProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
