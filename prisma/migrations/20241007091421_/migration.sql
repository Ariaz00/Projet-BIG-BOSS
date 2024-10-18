/*
  Warnings:

  - Added the required column `mail` to the `Employe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `employe` ADD COLUMN `mail` VARCHAR(191) NOT NULL;
