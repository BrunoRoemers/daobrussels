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
    <header className="container relative z-20 py-8 flex justify-between">
      <Link href="/">
        <Logo />
      </Link>
      <HeaderNav header={header} />
    </header>
  );
};
