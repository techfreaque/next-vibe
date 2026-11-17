-- Email change: the requested new address waits here until the link mailed
-- to it is clicked; only then does it replace users.email.
ALTER TABLE "users" ADD COLUMN "pending_email" text;
