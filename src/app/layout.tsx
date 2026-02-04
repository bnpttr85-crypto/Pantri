import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { BottomNav } from '@/components/BottomNav';

export const metadata: Metadata = {
  title: 'Pantry Pal',
  description: 'Your personal kitchen inventory and recipe assistant',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Pantry Pal',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#FFFDF7',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-cream-50 min-h-screen pb-20">
        <AppProvider>
          <main className="max-w-lg mx-auto">{children}</main>
          <BottomNav />
        </AppProvider>
      </body>
    </html>
  );
}
