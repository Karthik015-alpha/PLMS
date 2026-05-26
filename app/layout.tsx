import type { Metadata } from 'next';
import './globals.css';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  metadataBase: new URL('https://plms.example.com'),
  title: {
    default: 'PLMS - Personal Learning Management System',
    template: '%s | PLMS',
  },
  description: 'A developer-focused learning management system for tracking subjects, topics, markdown notes, progress, and study planning. Organize your learning journey with PLMS.',
  keywords: ['learning management', 'study planner', 'note taking', 'progress tracking', 'developer tools', 'education'],
  authors: [{ name: 'PLMS' }],
  creator: 'PLMS',
  publisher: 'PLMS',
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://plms.example.com',
    siteName: 'PLMS - Personal Learning Management System',
    title: 'PLMS - Personal Learning Management System',
    description: 'A developer-focused learning management system for tracking subjects, topics, markdown notes, progress, and study planning.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PLMS - Personal Learning Management System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PLMS - Personal Learning Management System',
    description: 'A developer-focused learning management system for tracking subjects, topics, markdown notes, progress, and study planning.',
    images: ['/og-image.png'],
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans dark", geist.variable)} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#030303" />
        <link rel="canonical" href="https://plms.example.com" />
        <script dangerouslySetInnerHTML={{__html: `
          try {
            document.documentElement.classList.add('dark');
          } catch (_) {}
        `}} />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
