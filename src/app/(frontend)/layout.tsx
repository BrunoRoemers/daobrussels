import { AdminBar } from '@/components/admin/admin-bar';
import { LivePreviewListener } from '@/components/admin/live-preview-listener';
import { ThemeToggle } from '@/components/theme-toggle';
import { BetterAuthProvider } from '@/features/auth/better-auth-provider';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider } from 'next-themes';
import React from 'react';

import './frontend.css';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className="flex h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <BetterAuthProvider>
            <AdminBar />
            <LivePreviewListener />
            {children}
            <div className="flex justify-center">
              <ThemeToggle />
            </div>
          </BetterAuthProvider>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
