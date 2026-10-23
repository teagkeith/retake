-- DropForeignKey
ALTER TABLE `ProTeam` DROP FOREIGN KEY `ProTeam_gameId_fkey`;

-- DropIndex
DROP INDEX `ProTeam_gameId_name_key` ON `ProTeam`;

-- AddForeignKey
ALTER TABLE `ProTeam` ADD CONSTRAINT `ProTeam_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
