'use client';

import type { PayloadAdminBarProps } from 'payload-admin-bar';

import { cn } from '@/utilities/cn';
import { useRouter, useSelectedLayoutSegments } from 'next/navigation';
import { PayloadAdminBar } from 'payload-admin-bar';
import React, { useState } from 'react';

import './index.scss';

const baseClass = 'admin-bar';

const collectionLabels = {
  pages: {
    plural: 'Pages',
    singular: 'Page',
  },
  posts: {
    plural: 'Posts',
    singular: 'Post',
  },
  projects: {
    plural: 'Projects',
    singular: 'Project',
  },
} as const;

type CollectionKey = keyof typeof collectionLabels;

const Title: React.FC = () => <span>Dashboard</span>;

export const AdminBar: React.FC<{
  adminBarProps?: PayloadAdminBarProps;
}> = (props) => {
  const { adminBarProps } = props || {};
  const segments = useSelectedLayoutSegments();
  const [show, setShow] = useState(false);
  const collection = (
    collectionLabels[segments?.[1] as CollectionKey] ? segments?.[1] : 'pages'
  ) as CollectionKey;
  const router = useRouter();

  const onAuthChange = React.useCallback((user: any) => {
    setShow(user?.id);
  }, []);

  return (
    <div
      className={cn(baseClass, 'bg-black py-2 text-white', {
        block: show,
        hidden: !show,
      })}
    >
      <div className="container">
        <PayloadAdminBar
          {...adminBarProps}
          className="py-2 text-white"
          classNames={{
            controls: 'font-medium text-white',
            logo: 'text-white',
            user: 'text-white',
          }}
          cmsURL={process.env.NEXT_PUBLIC_SERVER_URL}
          collection={collection}
          collectionLabels={{
            plural: collectionLabels[collection]?.plural || 'Pages',
            singular: collectionLabels[collection]?.singular || 'Page',
          }}
          logo={<Title />}
          onAuthChange={onAuthChange}
          onPreviewExit={() => {
            fetch('/next/exit-preview').then(() => {
              router.push('/');
              router.refresh();
            });
          }}
          style={{
            backgroundColor: 'transparent',
            padding: 0,
            position: 'relative',
            zIndex: 'unset',
          }}
        />
      </div>
    </div>
  );
};
