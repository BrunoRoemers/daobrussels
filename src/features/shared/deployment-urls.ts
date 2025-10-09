export const getDeploymentUrls = (): string[] => {
  const urls = [];

  // Vercel
  if (process.env.NEXT_PUBLIC_VERCEL_ENV) {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
      urls.push(`https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`);
    }

    if (process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL) {
      urls.push(`https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`);
    }

    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
      urls.push(`https://${process.env.NEXT_PUBLIC_VERCEL_URL}`);
    }
  }

  // Localhost
  if (process.env.NEXT_PUBLIC_PORT) {
    urls.push(`http://localhost:${process.env.NEXT_PUBLIC_PORT}`);
  }

  // Sanity check
  if (urls.length < 1) {
    throw new Error('Could not determine deployment URLs');
  }

  // TODO remove
  console.log('urls', urls);

  return urls;
};

export const getPrimaryUrl = (): string => {
  return getDeploymentUrls()[0];
};
