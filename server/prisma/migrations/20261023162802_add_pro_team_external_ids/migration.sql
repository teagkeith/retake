/*
  Warnings:

  - A unique constraint covering the columns `[gameId,externalSource,externalId]` on the table `ProTeam` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `ProTeam` ADD COLUMN `externalId` VARCHAR(191) NULL,
    ADD COLUMN `externalSource` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `ProTeam_gameId_externalSource_externalId_key` ON `ProTeam`(`gameId`, `externalSource`, `externalId`);
