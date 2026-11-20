-- Make TrendSnapshot.shopId optional so global trends can exist without a Shop record
-- Drop the NOT NULL constraint and the foreign key, then re-add FK as nullable

-- Step 1: Drop existing FK constraint
ALTER TABLE "TrendSnapshot" DROP CONSTRAINT "TrendSnapshot_shopId_fkey";

-- Step 2: Change column to nullable
ALTER TABLE "TrendSnapshot" ALTER COLUMN "shopId" DROP NOT NULL;

-- Step 3: Re-add FK constraint (now nullable)
ALTER TABLE "TrendSnapshot" ADD CONSTRAINT "TrendSnapshot_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE;
