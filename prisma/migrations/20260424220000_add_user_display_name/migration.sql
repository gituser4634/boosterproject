ALTER TABLE "User"
ADD COLUMN "displayName" TEXT;

UPDATE "User"
SET "displayName" = "username"
WHERE "displayName" IS NULL OR btrim("displayName") = '';

ALTER TABLE "User"
ALTER COLUMN "displayName" SET NOT NULL;
