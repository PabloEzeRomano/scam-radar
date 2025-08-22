import { LocaleDetector } from '@/components/LocaleDetector';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jet-brains-mono',
  subsets: ['latin'],
  weight: ['400'],
});

export const metadata: Metadata = {
  title: 'Scam Radar - Community-driven scam reports',
  description:
    'Stay safe online with community-submitted reports of suspicious activity, projects, and profiles.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Scam Radar - Community-driven scam reports',
    description: 'Stay safe online with community-submitted reports of suspicious activity, projects, and profiles.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Scam Radar',
  },
  twitter: {
    card: 'summary',
    title: 'Scam Radar - Community-driven scam reports',
    description: 'Stay safe online with community-submitted reports of suspicious activity, projects, and profiles.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetBrainsMono.variable} antialiased`}>
        <LocaleDetector>
          <Navigation />
          {children}
          <Footer />
        </LocaleDetector>
      </body>
    </html>
  );
}
