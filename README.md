# DAO Brussels Website

## Roadmap

https://github.com/users/BrunoRoemers/projects/1

## Get started locally

1. run `npm install`
2. run Postgres locally (e.g. using Postgres.app on Mac)
   1. run this SQL query to create a database: `CREATE DATABASE daobxl_dev;`
3. make a copy of `.env.example` named `.env`
   1. set the database connection string
   2. set a random string for `PAYLOAD_SECRET`
4. run `npm run dev`
5. make code changes
6. make a pull request

## Useful commands

- `npm run dev` to start the development server
- `npm run build` to make a production build, followed by `npm run start` to run it
- `npx prettier . --write` to format the code
- `npx payload generate:types` to generate the types
- `npx payload migrate:create <name-of-migration>` to create a new migration

## Upgrade procedure for Payload CMS

1. `npm install payload@latest`
2. `npm install`
3. `npx payload generate:types` - might complain about version mismatch - follow instructions, rinse, repeat
4. `npx payload generate:importmap` - might complain about version mismatch - follow instructions, rinse, repeat
5. `npn run dev` - should have no issues :tada:

## Cron Jobs

- `nightly` queue runs at 11PM UTC, which is 12AM (winter time) or 1AM (summer time) in Brussels. This is perfect to update "today's events" on the home page.

## Tests

- `npm run test`
- `npm run test <pattern>`
- `npm run test <pattern> -- --watch`
