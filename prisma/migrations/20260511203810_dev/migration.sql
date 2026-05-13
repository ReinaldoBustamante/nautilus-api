/*
  Warnings:

  - Added the required column `lastname` to the `doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthday` to the `patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "doctor" ADD COLUMN     "lastname" VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE "patient" ADD COLUMN     "birthday" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "lastname" VARCHAR(100) NOT NULL;
