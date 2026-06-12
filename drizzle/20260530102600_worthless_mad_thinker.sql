ALTER TABLE "remote_connections" ALTER COLUMN "loop_location" SET DEFAULT 'server';
UPDATE "remote_connections" SET "loop_location" = 'server' WHERE "loop_location" = 'client';