-- Rename "name" column to "fullName"
ALTER TABLE "Member" RENAME COLUMN "name" TO "fullName";

-- Add individual name columns
ALTER TABLE "Member" ADD COLUMN "firstName" TEXT;
ALTER TABLE "Member" ADD COLUMN "middleName" TEXT;
ALTER TABLE "Member" ADD COLUMN "lastName" TEXT;

-- Add "branch" column (positioned logically before where address was)
ALTER TABLE "Member" ADD COLUMN "branch" TEXT NOT NULL DEFAULT '';