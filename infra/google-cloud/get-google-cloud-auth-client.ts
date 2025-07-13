import { getVercelOidcToken } from '@vercel/functions/oidc';
import { AuthClient, ExternalAccountClient } from 'google-auth-library';

export const getGoogleCloudAuthClient = (): AuthClient | undefined => {
  const projectNumber = process.env.GCP_PROJECT_NUMBER;
  const workloadIdentityPoolId = process.env.GCP_WORKLOAD_IDENTITY_POOL_ID;
  const workloadIdentityPoolProviderId = process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID;
  const serviceAccountEmail = process.env.GCP_SERVICE_ACCOUNT_EMAIL;

  if (
    !projectNumber ||
    !workloadIdentityPoolId ||
    !workloadIdentityPoolProviderId ||
    !serviceAccountEmail
  ) {
    return undefined;
  }

  const authClient = ExternalAccountClient.fromJSON({
    type: 'external_account',
    audience: `//iam.googleapis.com/projects/${projectNumber}/locations/global/workloadIdentityPools/${workloadIdentityPoolId}/providers/${workloadIdentityPoolProviderId}`,
    subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
    token_url: 'https://sts.googleapis.com/v1/token',
    service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${serviceAccountEmail}:generateAccessToken`,
    subject_token_supplier: {
      getSubjectToken: getVercelOidcToken,
    },
  });

  return authClient ?? undefined;
};
