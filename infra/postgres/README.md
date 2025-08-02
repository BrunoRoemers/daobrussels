# PostgreSQL Database

Currently hosted at https://neon.tech

## Access via CLI

`psql -h pg.neon.tech`

## Export subset of tables

```bash
pg_dump -h pg.neon.tech --column-inserts -t public._events_v -t public._events_v_rels -t public._pods_v -t public.events -t public.events_rels -t public.media -t public.pods -t public.pods_at_events -t public.users -t public.users_roles -f export_subset.sql
```

## Import subset of tables

```bash
psql -h pg.neon.tech -f export_subset.sql
```
