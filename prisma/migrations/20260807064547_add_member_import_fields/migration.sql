-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "clientId" INTEGER,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "loanCycle" INTEGER,
ADD COLUMN     "transactionDate" TIMESTAMP(3);
