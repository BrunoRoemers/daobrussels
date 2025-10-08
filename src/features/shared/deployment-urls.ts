export const getDeploymentUrls = (): string[] => {
  const urls = [];

  if (process.env.VERCEL) {
    if (process.env.VERCEL_ENV === 'production') {
      urls.push(process.env.VERCEL_PROJECT_PRODUCTION_URL!);
    }

    if (process.env.VERCEL_BRANCH_URL) {
      urls.push(process.env.VERCEL_BRANCH_URL);
    }

    if (process.env.VERCEL_URL) {
      urls.push(process.env.VERCEL_URL);
    }
  } else {
    urls.push(`localhost:${process.env.PORT ?? 3000}`);
  }

  if (urls.length < 1) {
    throw new Error('Could not determine deployment URLs');
  }

  return urls;
};

export const getPrimaryUrl = (): string => {
  return getDeploymentUrls()[0];
};
