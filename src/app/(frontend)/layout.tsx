import { AdminBar } from '@/components/admin/admin-bar';
import { LivePreviewListener } from '@/components/admin/live-preview-listener';
import { cn } from '@/utils/cn';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
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
        <AdminBar />
        <LivePreviewListener />
        {children}
      </body>
    </html>
  );
}
