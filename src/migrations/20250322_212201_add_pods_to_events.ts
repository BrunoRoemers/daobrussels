import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pods_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pods_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE IF NOT EXISTS "pods" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"published_at" timestamp(3) with time zone,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pods_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "_pods_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pods_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "pods_at_events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"pod_id" integer NOT NULL,
  	"event_id" integer NOT NULL,
  	"host_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pods_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pods_at_events_id" integer;
  DO $$ BEGIN
   ALTER TABLE "_pods_v" ADD CONSTRAINT "_pods_v_parent_id_pods_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pods"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pods_at_events" ADD CONSTRAINT "pods_at_events_pod_id_pods_id_fk" FOREIGN KEY ("pod_id") REFERENCES "public"."pods"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pods_at_events" ADD CONSTRAINT "pods_at_events_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "pods_at_events" ADD CONSTRAINT "pods_at_events_host_id_users_id_fk" FOREIGN KEY ("host_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "pods_slug_idx" ON "pods" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "pods_updated_at_idx" ON "pods" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "pods_created_at_idx" ON "pods" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "pods__status_idx" ON "pods" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_pods_v_parent_idx" ON "_pods_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_pods_v_version_version_slug_idx" ON "_pods_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_pods_v_version_version_updated_at_idx" ON "_pods_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_pods_v_version_version_created_at_idx" ON "_pods_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_pods_v_version_version__status_idx" ON "_pods_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_pods_v_created_at_idx" ON "_pods_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_pods_v_updated_at_idx" ON "_pods_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_pods_v_latest_idx" ON "_pods_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_pods_v_autosave_idx" ON "_pods_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "pods_at_events_pod_idx" ON "pods_at_events" USING btree ("pod_id");
  CREATE INDEX IF NOT EXISTS "pods_at_events_event_idx" ON "pods_at_events" USING btree ("event_id");
  CREATE INDEX IF NOT EXISTS "pods_at_events_host_idx" ON "pods_at_events" USING btree ("host_id");
  CREATE INDEX IF NOT EXISTS "pods_at_events_updated_at_idx" ON "pods_at_events" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "pods_at_events_created_at_idx" ON "pods_at_events" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pods_fk" FOREIGN KEY ("pods_id") REFERENCES "public"."pods"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pods_at_events_fk" FOREIGN KEY ("pods_at_events_id") REFERENCES "public"."pods_at_events"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_pods_id_idx" ON "payload_locked_documents_rels" USING btree ("pods_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_pods_at_events_id_idx" ON "payload_locked_documents_rels" USING btree ("pods_at_events_id");`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pods" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pods_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pods_at_events" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pods" CASCADE;
  DROP TABLE "_pods_v" CASCADE;
  DROP TABLE "pods_at_events" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pods_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pods_at_events_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_pods_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_pods_at_events_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "pods_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "pods_at_events_id";
  DROP TYPE "public"."enum_pods_status";
  DROP TYPE "public"."enum__pods_v_version_status";`);
}
