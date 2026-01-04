# Integrate Better Auth with Payload CMS

The Better Auth Drizzle schema was generated with:

```bash
# run in the `features/auth` folder
POSTGRES_URL=<db> npx @better-auth/cli@latest generate --config better-auth-config.ts --output better-auth-drizzle-schema.ts
```

The generated schema was manually modified to use the `auth` namespace ("Postgres Schema").
