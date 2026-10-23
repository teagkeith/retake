/*
  Warnings:

  - A unique constraint covering the columns `[gameId,externalSource,externalPlayerId]` on the table `ProPlayer` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `ProPlayer` DROP FOREIGN KEY `ProPlayer_gameId_fkey`;

-- DropIndex
DROP INDEX `ProPlayer_gameId_externalPlayerId_key` ON `ProPlayer`;

-- AlterTable
ALTER TABLE `ProPlayer` ADD COLUMN `externalSource` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `ProPlayer_gameId_externalSource_externalPlayerId_key` ON `ProPlayer`(`gameId`, `externalSource`, `externalPlayerId`);

-- AddForeignKey
ALTER TABLE `ProPlayer` ADD CONSTRAINT `ProPlayer_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
