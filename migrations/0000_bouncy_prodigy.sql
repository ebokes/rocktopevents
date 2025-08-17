CREATE TABLE "blog_posts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"category" varchar NOT NULL,
	"tags" text[],
	"featured_image" varchar,
	"published" boolean DEFAULT false,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone" varchar,
	"subject" varchar NOT NULL,
	"message" text NOT NULL,
	"status" varchar DEFAULT 'unread',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "gallery_items" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"image_url" varchar NOT NULL,
	"category" varchar NOT NULL,
	"event_type" varchar,
	"featured" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "quote_requests" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"event_type" varchar NOT NULL,
	"guest_count" varchar NOT NULL,
	"event_date" timestamp NOT NULL,
	"budget" varchar NOT NULL,
	"venue" text,
	"services" jsonb NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"contact_method" varchar DEFAULT 'email',
	"details" text,
	"status" varchar DEFAULT 'pending',
	"estimated_cost" numeric(10, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"features" text[] DEFAULT '{}' NOT NULL,
	"color" varchar DEFAULT 'primary' NOT NULL,
	"icon" varchar DEFAULT 'Calendar' NOT NULL,
	"image_url" varchar,
	"active" boolean DEFAULT true NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
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
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "venues" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"address" text NOT NULL,
	"city" varchar NOT NULL,
	"state" varchar NOT NULL,
	"zip_code" varchar NOT NULL,
	"capacity" integer NOT NULL,
	"price_per_day" numeric(10, 2) NOT NULL,
	"suitable_for" text[],
	"amenities" text[],
	"images" text[],
	"rating" numeric(2, 1) DEFAULT '0.0',
	"review_count" integer DEFAULT 0,
	"available" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "quote_requests" ADD CONSTRAINT "quote_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");