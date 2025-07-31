'use client';
import Link from 'next/link';
import React from 'react';

import type { Header } from '@/payload-types';

import { Logo } from '@/components/Logo/Logo';
import { HeaderNav } from './Nav';

interface HeaderClientProps {
  header: Header;
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ header }) => {
  return (
    <header className="relative z-20 container flex justify-between py-8">
      <Link href="/">
        <Logo />
      </Link>
      <HeaderNav header={header} />
    </header>
  );
};
