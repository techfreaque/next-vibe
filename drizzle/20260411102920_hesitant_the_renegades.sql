ALTER TABLE "custom_skills" ADD COLUMN "variants" jsonb;

-- Backfill: wrap existing modelSelection into a single-variant array
UPDATE "custom_skills"
SET "variants" = jsonb_build_array(
  jsonb_build_object(
    'id', 'default',
    'modelSelection', "model_selection",
    'isDefault', true
  )
)
WHERE "variants" IS NULL AND "model_selection" IS NOT NULL;