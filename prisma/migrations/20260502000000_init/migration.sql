-- CreateTable
CREATE TABLE "BukuTamu" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nama" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "education" TEXT NOT NULL,
    "unitLayanan" TEXT NOT NULL,
    "keperluan" TEXT,
    CONSTRAINT "BukuTamu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Response" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "education" TEXT NOT NULL,
    "unitLayanan" TEXT NOT NULL,
    "q1" INTEGER NOT NULL,
    "q2" INTEGER NOT NULL,
    "q3" INTEGER NOT NULL,
    "q4" INTEGER NOT NULL,
    "q5" INTEGER NOT NULL,
    "q6" INTEGER NOT NULL,
    "q7" INTEGER NOT NULL,
    "q8" INTEGER NOT NULL,
    "q9" INTEGER NOT NULL,
    "q10a" TEXT,
    "q10b" TEXT,
    "specificData" TEXT,
    "bukuTamuId" INTEGER,
    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Response_bukuTamuId_key" ON "Response"("bukuTamuId");

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_bukuTamuId_fkey"
    FOREIGN KEY ("bukuTamuId") REFERENCES "BukuTamu"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
