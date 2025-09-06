import { AdminBar } from '@/components/admin/admin-bar';
import { LivePreviewListener } from '@/components/admin/live-preview-listener';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/utils/cn';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { ThemeProvider } from 'next-themes';
import React from 'react';

import './globals.css';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AdminBar />
          <LivePreviewListener />
          {children}
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
