ALTER TABLE "chat_favorites" ADD COLUMN "slug" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "custom_skills" ADD COLUMN "slug" text DEFAULT '' NOT NULL;--> statement-breakpoint

-- Backfill custom_skills slugs from name: lowercase, replace non-alphanumeric with dash, collapse dashes, trim
UPDATE "custom_skills" SET "slug" = TRIM(BOTH '-' FROM
  regexp_replace(
    regexp_replace(
      lower("name"),
      '[^a-z0-9-]', '-', 'g'
    ),
    '-{2,}', '-', 'g'
  )
) WHERE "slug" = '';--> statement-breakpoint

-- Handle slug collisions in custom_skills by appending row_number
WITH dupes AS (
  SELECT id, slug, ROW_NUMBER() OVER (PARTITION BY slug ORDER BY "created_at") AS rn
  FROM custom_skills
  WHERE slug != ''
)
UPDATE custom_skills SET slug = dupes.slug || '-' || dupes.rn
FROM dupes WHERE custom_skills.id = dupes.id AND dupes.rn > 1;--> statement-breakpoint

-- Backfill chat_favorites slugs from skill + variant info
-- For now, use the skill's character_id + variant_id as base slug
UPDATE "chat_favorites" SET "slug" = TRIM(BOTH '-' FROM
  regexp_replace(
    regexp_replace(
      lower(COALESCE("custom_variant_name", COALESCE("character_id", 'favorite') || COALESCE('-' || "variant_id", ''))),
      '[^a-z0-9-]', '-', 'g'
    ),
    '-{2,}', '-', 'g'
  )
) WHERE "slug" = '';--> statement-breakpoint

-- Handle slug collisions in chat_favorites (per user) by appending row_number
WITH dupes AS (
  SELECT id, user_id, slug, ROW_NUMBER() OVER (PARTITION BY user_id, slug ORDER BY "created_at") AS rn
  FROM chat_favorites
  WHERE slug != ''
)
UPDATE chat_favorites SET slug = dupes.slug || '-' || dupes.rn
FROM dupes WHERE chat_favorites.id = dupes.id AND dupes.rn > 1;--> statement-breakpoint

ALTER TABLE "chat_favorites" ADD CONSTRAINT "chat_favorites_user_slug_idx" UNIQUE("user_id","slug");--> statement-breakpoint
ALTER TABLE "custom_skills" ADD CONSTRAINT "custom_skills_slug_idx" UNIQUE("slug");
