# Google Cloud Docs

Two Google Cloud projects managed by Bruno
- development environment
- production environment

## Connect Vercel to Google Cloud

Docs: https://vercel.com/docs/oidc/gcp

1. Set up Workflow Identity Federation for Vercel.
2. Create a service account for Vercel.
3. Give the role `Storage Object User` to the service account, to allow CRUD on a bucket.
4. Add a principal with role `Workload Identity User` to the service account. Example principal: `principal://iam.googleapis.com/projects/245666385886/locations/global/workloadIdentityPools/vercel/subject/owner:[vercel-team]:project:[vercel-project]:environment:[production|preview|development]`
5. Add the service account as a principal of itself, with role `Service Account Token Creator`. This grants the permission `iam.serviceAccounts.signBlob` needed for client-side media uploads.

Connector: [get-google-cloud-auth-client.ts](get-google-cloud-auth-client.ts)

The following environment variables are required for authentication:

| Variable | Dev | Prod |
|----------|-------------|---------|
| `GCP_PROJECT_NUMBER` | `245666385886` | `TODO` |
| `GCP_WORKLOAD_IDENTITY_POOL_ID` | `vercel` | `vercel` |
| `GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID` | `vercel` | `vercel` |
| `GCP_SERVICE_ACCOUNT_EMAIL` | `vercel@dao-brussels.iam.gserviceaccount.com` | `vercel@dao-brussels-prod.iam.gserviceaccount.com` |

## Additional env vars

| Variable | Dev | Prod |
|----------|-------------|---------|
| `GCP_PROJECT_ID` | `dao-brussels` | `TODO` |
| `GCP_BUCKET_NAME` | `dao-brussels-website--dev` | `TODO` |
