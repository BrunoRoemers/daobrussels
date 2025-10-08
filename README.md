# DAO Brussels Website

## Roadmap

https://github.com/users/BrunoRoemers/projects/1

## Install

`npm install`

## Database

Mac: use Postgres.app and set something like `POSTGRES_URL=postgresql://user@localhost/database-name` in your `.env` file.

To create a new migration: `npx payload migrate:create <name-of-migration>`

## Useful commands

- `npm run dev` to start the development server
- `npm run build` to make a production build, followed by `npm run start` to run it
- `npx prettier . --write` to format the code
- `npx payload generate:types` to generate the types

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