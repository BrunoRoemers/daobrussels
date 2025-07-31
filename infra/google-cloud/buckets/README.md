# Google Cloud Storage Buckets

## CORS Config

When `clientUploads` is set to `true` for `@payloadcms/storage-gcs`, the bucket needs to have CORS config set for at least the PUT method. ([see docs](https://payloadcms.com/docs/upload/storage-adapters#gcs-usage))

To apply the CORS config, you need to run:

1. `gcloud auth login`
2. `gsutil cors set infra/google-cloud/buckets/cors-config--dao-brussels-website--dev.json gs://dao-brussels-website--dev`
