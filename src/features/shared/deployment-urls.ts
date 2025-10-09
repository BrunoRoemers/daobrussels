const getDeploymentUrls = (): string[] => {
  const urls = [];

  // Vercel
  if (process.env.VERCEL) {
    if (process.env.VERCEL_ENV === 'production') {
      urls.push(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
    }

    if (process.env.VERCEL_BRANCH_URL) {
      urls.push(`https://${process.env.VERCEL_BRANCH_URL}`);
    }

    if (process.env.VERCEL_URL) {
      urls.push(`https://${process.env.VERCEL_URL}`);
    }
  }

  // Localhost
  if (process.env.PORT) {
    urls.push(`http://localhost:${process.env.PORT}`);
  }

  // Sanity check
  if (urls.length < 1) {
    throw new Error('Could not determine deployment URLs server-side');
  }

  return urls;
};

/**
 * Our pipeline assigns each deployment to one or multiple domain names.
 *
 * On the server, we need to know which urls are associated with the current deployment.
 *
 * On the client, we want to make requests to the url that matches the current page
 * and we don't care about the other values.
 */
export const deploymentUrls =
  typeof window !== 'undefined' ? [window.location.origin] : getDeploymentUrls();

export const primaryUrl = deploymentUrls[0];

console.log('urls: ', deploymentUrls);
