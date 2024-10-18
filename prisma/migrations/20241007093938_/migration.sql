/*
  Warnings:

  - You are about to drop the column `civilite` on the `employe` table. All the data in the column will be lost.
  - You are about to drop the column `firstname` on the `employe` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `employe` table. All the data in the column will be lost.
  - You are about to drop the column `reference` on the `ordinateur` table. All the data in the column will be lost.
  - You are about to drop the `_employetoordinateur` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[mail]` on the table `Employe` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ordinateurId]` on the table `Employe` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mac]` on the table `Ordinateur` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstName` to the `Employe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Employe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Employe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mac` to the `Ordinateur` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_employetoordinateur` DROP FOREIGN KEY `_EmployeToOrdinateur_A_fkey`;

-- DropForeignKey
ALTER TABLE `_employetoordinateur` DROP FOREIGN KEY `_EmployeToOrdinateur_B_fkey`;

-- AlterTable
ALTER TABLE `employe` DROP COLUMN `civilite`,
    DROP COLUMN `firstname`,
    DROP COLUMN `lastname`,
    ADD COLUMN `firstName` VARCHAR(255) NOT NULL,
    ADD COLUMN `gender` ENUM('MR', 'MME') NOT NULL,
    ADD COLUMN `lastName` VARCHAR(255) NOT NULL,
    ADD COLUMN `ordinateurId` INTEGER NULL,
    MODIFY `password` VARCHAR(255) NOT NULL,
    MODIFY `mail` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `entreprise` ADD COLUMN `ceo` VARCHAR(255) NULL,
    MODIFY `siret` VARCHAR(255) NOT NULL,
    MODIFY `raisonSociale` VARCHAR(255) NOT NULL,
    MODIFY `password` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `ordinateur` DROP COLUMN `reference`,
    ADD COLUMN `mac` VARCHAR(255) NOT NULL;

-- DropTable
DROP TABLE `_employetoordinateur`;

-- CreateIndex
CREATE UNIQUE INDEX `Employe_mail_key` ON `Employe`(`mail`);

-- CreateIndex
CREATE UNIQUE INDEX `Employe_ordinateurId_key` ON `Employe`(`ordinateurId`);

-- CreateIndex
CREATE UNIQUE INDEX `Ordinateur_mac_key` ON `Ordinateur`(`mac`);

-- AddForeignKey
ALTER TABLE `Employe` ADD CONSTRAINT `Employe_ordinateurId_fkey` FOREIGN KEY (`ordinateurId`) REFERENCES `Ordinateur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
