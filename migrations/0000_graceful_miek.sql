CREATE TABLE "admin_users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"email" varchar NOT NULL,
	"role" varchar DEFAULT 'admin' NOT NULL,
	"permissions" jsonb DEFAULT '{"manage_images": true, "review_reports": true, "manage_users": false}',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "articles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(200) NOT NULL,
	"slug" varchar(220) NOT NULL,
	"html" text NOT NULL,
	"excerpt" varchar(300),
	"status" varchar DEFAULT 'draft' NOT NULL,
	"tags" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"published_at" timestamp,
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "growth_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"plant_id" integer NOT NULL,
	"date" date NOT NULL,
	"height_inches" numeric(5, 2),
	"width_inches" numeric(5, 2),
	"weight_oz" numeric(6, 2),
	"circumference_inches" numeric(5, 2),
	"offset_count" integer DEFAULT 0,
	"health_score" integer,
	"flowering_status" varchar,
	"environmental_notes" text,
	"observations" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "photo_reports" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image_id" varchar NOT NULL,
	"reporter_user_id" varchar,
	"reporter_email" varchar,
	"report_type" varchar NOT NULL,
	"description" varchar(1000),
	"status" varchar DEFAULT 'pending' NOT NULL,
	"admin_notes" varchar(1000),
	"reviewed_by" varchar,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "plant_likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"plant_id" integer NOT NULL,
	"user_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "plant_photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"plant_id" integer NOT NULL,
	"filename" varchar NOT NULL,
	"original_name" varchar,
	"mime_type" varchar,
	"size" integer,
	"file_path" varchar,
	"image_data" text,
	"uploaded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "plants" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"custom_id" varchar,
	"family" varchar NOT NULL,
	"genus" varchar NOT NULL,
	"species" varchar,
	"cultivar" varchar,
	"mutation" varchar,
	"common_name" varchar,
	"supplier" varchar,
	"acquisition_date" date,
	"initial_type" varchar,
	"is_public" varchar DEFAULT 'public' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "seeds" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"custom_id" varchar,
	"family" varchar NOT NULL,
	"genus" varchar NOT NULL,
	"species" varchar,
	"cultivar" varchar,
	"mutation" varchar,
	"common_name" varchar,
	"supplier" varchar,
	"sow_date" date,
	"quantity" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "species_images" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"genus" varchar NOT NULL,
	"species" varchar NOT NULL,
	"image_url" varchar NOT NULL,
	"image_source" varchar NOT NULL,
	"source_attribution" varchar,
	"source_url" varchar,
	"image_type" varchar DEFAULT 'photograph' NOT NULL,
	"is_primary" boolean DEFAULT false,
	"uploaded_by" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"auth_provider" varchar,
	"collection_public" varchar DEFAULT 'public',
	"contribute_photos_to_knowledge_base" boolean DEFAULT true,
	"display_name" varchar(20),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"website" varchar,
	"location" varchar,
	"specialties" text[],
	"categories" text[],
	"reputation" varchar DEFAULT 'reliable',
	"shipping_info" text,
	"price_range" varchar DEFAULT 'moderate',
	"is_active" boolean DEFAULT true,
	"verified_date" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "admin_users" ADD CONSTRAINT "admin_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photo_reports" ADD CONSTRAINT "photo_reports_image_id_species_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."species_images"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photo_reports" ADD CONSTRAINT "photo_reports_reporter_user_id_users_id_fk" FOREIGN KEY ("reporter_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photo_reports" ADD CONSTRAINT "photo_reports_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "species_images" ADD CONSTRAINT "species_images_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "articles_status_published_at_idx" ON "articles" USING btree ("status","published_at");--> statement-breakpoint
CREATE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "unique_user_plant_like" ON "plant_likes" USING btree ("user_id","plant_id");--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");