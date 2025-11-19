import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  redirects: async () => {
    return [
      {
        source: '/admin/login',
        destination: '/auth/sign-in',
        permanent: true,
      },
    ];
  },
};

export default withPayload(nextConfig);
