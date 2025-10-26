import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres';
import z from 'zod';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // prettier-ignore
  const uploadedByDefaultId = z.coerce.number().parse(process.env.MIGRATION_MEDIA_UPLOADED_BY_DEFAULT_ID);
  console.log('ENV: default value for media.uploaded_by_id:', uploadedByDefaultId);

  await db.execute(sql`
   ALTER TYPE "public"."enum_users_roles" ADD VALUE 'anon';
  ALTER TABLE "media" ADD COLUMN "uploaded_by_id" integer;
  UPDATE "media" SET "uploaded_by_id" = ${sql.raw(uploadedByDefaultId.toString())} WHERE "uploaded_by_id" IS NULL;
  ALTER TABLE "media" ALTER COLUMN "uploaded_by_id" SET NOT NULL;
  ALTER TABLE "media" ADD COLUMN "approved_by_id" integer;
  ALTER TABLE "media" ADD CONSTRAINT "media_uploaded_by_id_users_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_approved_by_id_users_id_fk" FOREIGN KEY ("approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "media_uploaded_by_idx" ON "media" USING btree ("uploaded_by_id");
  CREATE INDEX "media_approved_by_idx" ON "media" USING btree ("approved_by_id");`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" DROP CONSTRAINT "media_uploaded_by_id_users_id_fk";
  
  ALTER TABLE "media" DROP CONSTRAINT "media_approved_by_id_users_id_fk";
  
  ALTER TABLE "users_roles" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_users_roles";
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'user');
  ALTER TABLE "users_roles" ALTER COLUMN "value" SET DATA TYPE "public"."enum_users_roles" USING "value"::"public"."enum_users_roles";
  DROP INDEX "media_uploaded_by_idx";
  DROP INDEX "media_approved_by_idx";
  ALTER TABLE "media" DROP COLUMN "uploaded_by_id";
  ALTER TABLE "media" DROP COLUMN "approved_by_id";`);
}
