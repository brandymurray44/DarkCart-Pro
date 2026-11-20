-- Add blackAccessActive field to Shop model
-- Replaces the refreshToken hack where "BLACK_ACCESS_ACTIVE" was stored in refreshToken
ALTER TABLE "Shop" ADD COLUMN "blackAccessActive" Boolean NOT NULL DEFAULT false;

-- Migrate existing shops that used the refreshToken hack
UPDATE "Shop" SET "blackAccessActive" = true, "refreshToken" = NULL
WHERE "refreshToken" = 'BLACK_ACCESS_ACTIVE';
