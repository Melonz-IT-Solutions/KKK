-- AlterTable: add department, branch, cluster to User
ALTER TABLE "User" ADD COLUMN "department" TEXT;
ALTER TABLE "User" ADD COLUMN "branch" TEXT;
ALTER TABLE "User" ADD COLUMN "cluster" TEXT;

-- Migrate data from Staff to User before dropping Staff
UPDATE "User" u
SET
  "department" = s."department",
  "branch" = s."branch",
  "cluster" = s."cluster"
FROM "Staff" s
WHERE s."userId" = u."id";

-- AlterTable: drop staffId from ActivityLog
ALTER TABLE "ActivityLog" DROP COLUMN "staffId";

-- DropTable
DROP TABLE "Staff";
