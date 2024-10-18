/*
  Warnings:

  - A unique constraint covering the columns `[employeId]` on the table `Ordinateur` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `employe` DROP FOREIGN KEY `Employe_ordinateurId_fkey`;

-- CreateIndex
CREATE UNIQUE INDEX `Ordinateur_employeId_key` ON `Ordinateur`(`employeId`);

-- AddForeignKey
ALTER TABLE `Ordinateur` ADD CONSTRAINT `Ordinateur_employeId_fkey` FOREIGN KEY (`employeId`) REFERENCES `Employe`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
