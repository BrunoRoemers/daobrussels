import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pods_at_events" ADD COLUMN "description" varchar DEFAULT '' NOT NULL;`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pods_at_events" DROP COLUMN IF EXISTS "description";`);
}
