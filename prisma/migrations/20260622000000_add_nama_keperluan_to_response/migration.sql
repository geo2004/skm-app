-- AlterTable: add nama and keperluan to Response
-- Required per Permenpan-RB No. 14/2017 for complete SKM reporting
ALTER TABLE "Response" ADD COLUMN "nama" TEXT;
ALTER TABLE "Response" ADD COLUMN "keperluan" TEXT;
