-- Migration: new_questions
-- Adds new demographics (ageGroup, pekerjaan, disabilitas) and 19 hybrid questions
-- Makes legacy q1-q9 nullable so new-format responses can omit them

-- Make legacy question columns nullable
ALTER TABLE "Response" ALTER COLUMN "q1" DROP NOT NULL;
ALTER TABLE "Response" ALTER COLUMN "q2" DROP NOT NULL;
ALTER TABLE "Response" ALTER COLUMN "q3" DROP NOT NULL;
ALTER TABLE "Response" ALTER COLUMN "q4" DROP NOT NULL;
ALTER TABLE "Response" ALTER COLUMN "q5" DROP NOT NULL;
ALTER TABLE "Response" ALTER COLUMN "q6" DROP NOT NULL;
ALTER TABLE "Response" ALTER COLUMN "q7" DROP NOT NULL;
ALTER TABLE "Response" ALTER COLUMN "q8" DROP NOT NULL;
ALTER TABLE "Response" ALTER COLUMN "q9" DROP NOT NULL;

-- Make age nullable (new responses store age group string instead of integer)
ALTER TABLE "Response" ALTER COLUMN "age" DROP NOT NULL;

-- New demographic columns
ALTER TABLE "Response" ADD COLUMN "ageGroup"         TEXT;
ALTER TABLE "Response" ADD COLUMN "pekerjaan"        TEXT;
ALTER TABLE "Response" ADD COLUMN "isDisabilitas"    BOOLEAN;
ALTER TABLE "Response" ADD COLUMN "jenisDisabilitas" TEXT;

-- New question columns — Kuesioner Hybrid
ALTER TABLE "Response" ADD COLUMN "nq1"   INTEGER;
ALTER TABLE "Response" ADD COLUMN "nq2"   INTEGER;
ALTER TABLE "Response" ADD COLUMN "nq3"   INTEGER;
ALTER TABLE "Response" ADD COLUMN "nq4"   INTEGER;
ALTER TABLE "Response" ADD COLUMN "nq5"   INTEGER;
ALTER TABLE "Response" ADD COLUMN "nq6"   INTEGER;
ALTER TABLE "Response" ADD COLUMN "nq7"   INTEGER;
ALTER TABLE "Response" ADD COLUMN "nq8"   INTEGER;
ALTER TABLE "Response" ADD COLUMN "nq9"   INTEGER;
ALTER TABLE "Response" ADD COLUMN "nq10"  INTEGER;
ALTER TABLE "Response" ADD COLUMN "nq11a" INTEGER;
ALTER TABLE "Response" ADD COLUMN "nq11b" INTEGER;
ALTER TABLE "Response" ADD COLUMN "nq12a" INTEGER;
ALTER TABLE "Response" ADD COLUMN "nq12b" INTEGER;
ALTER TABLE "Response" ADD COLUMN "nq13"  INTEGER;
ALTER TABLE "Response" ADD COLUMN "nq14"  INTEGER;
ALTER TABLE "Response" ADD COLUMN "nq15"  INTEGER;
ALTER TABLE "Response" ADD COLUMN "nq16a" INTEGER;
ALTER TABLE "Response" ADD COLUMN "nq16b" INTEGER;
