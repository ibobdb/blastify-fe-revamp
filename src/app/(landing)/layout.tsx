import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Blastify - WhatsApp Marketing Platform',
  description:
    'The most powerful WhatsApp bulk messaging platform for businesses',
};

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="bg-background text-foreground">{children}</div>;
}
