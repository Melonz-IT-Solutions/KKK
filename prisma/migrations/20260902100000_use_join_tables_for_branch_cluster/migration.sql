-- Migrate existing User.branch strings → BranchManager records
INSERT INTO "BranchManager" ("userId", "branchId")
SELECT u."id", b."id"
FROM "User" u
JOIN "Branch" b ON b."name" = u."branch"
WHERE u."role" = 'BRANCH_MANAGER'
  AND u."branch" IS NOT NULL
  AND u."branch" <> ''
ON CONFLICT DO NOTHING;

-- Migrate existing User.cluster strings → ClusterManager records
INSERT INTO "ClusterManager" ("userId", "clusterId")
SELECT u."id", c."id"
FROM "User" u
JOIN "Cluster" c ON c."name" = u."cluster"
WHERE u."role" = 'CLUSTER_MANAGER'
  AND u."cluster" IS NOT NULL
  AND u."cluster" <> ''
ON CONFLICT DO NOTHING;

-- Drop the now-redundant columns
ALTER TABLE "User" DROP COLUMN "branch";
ALTER TABLE "User" DROP COLUMN "cluster";
