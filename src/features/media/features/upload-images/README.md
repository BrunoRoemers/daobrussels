# Implementation of client-side file uploads

## How the Payload backend does it

### 1. `POST` request to `/api/storage-gcs-generate-signed-url`

input:

```json
{ "collectionSlug": "media", "filename": "img1.jpg", "mimeType": "image/jpeg" }
```

output:

```json
{
  "url": "<signed-url>"
}
```

### 2. `PUT` request to `<signed-url>`

input: `content-type: image/jpeg`

output: `HTTP 200`

### 3. `POST` request to `/api/media`

input:

```json
// content-type: multipart/form-data

// `_payload` key:
{
  "alt":"asdf"
  // i.e. the properties of the media collection
}

// `file` key:
{
  "clientUploadContext": { "prefix": "collections/media" },
  "collectionSlug": "media",
  "filename": "img1.jpg",
  "mimeType": "image/jpeg",
  "size": 379740
}
```

output:

```json
{
  "doc": {
    "id": 20,
    "alt": "asdf",
    "prefix": "collections/media",
    "updatedAt": "2025-10-12T11:14:31.030Z",
    "createdAt": "2025-10-12T11:14:31.028Z",
    "url": "/api/media/file/img1.jpg",
    "thumbnailURL": null,
    "filename": "img1.jpg",
    "mimeType": "image/jpeg",
    "filesize": 379740,
    "width": 1600,
    "height": 1200,
    "focalX": 50,
    "focalY": 50
  },
  "message": "Media successfully created."
}
```

## Appendix: file uploads via our server
```tsx
<form
  action="/api/media"
  method="POST"
  encType="multipart/form-data"
>
  <input name="file" type="file" />
  <input
    type="hidden"
    name="_payload"
    value={JSON.stringify({ alt: 'asdf' })}
  />
  <button>upload</button>
</form>
```