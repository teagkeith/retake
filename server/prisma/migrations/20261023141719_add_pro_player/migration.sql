-- AlterTable
ALTER TABLE `PlayerMatchStats` ADD COLUMN `proPlayerId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `ProPlayer` (
    `id` VARCHAR(191) NOT NULL,
    `gameId` VARCHAR(191) NOT NULL,
    `displayName` VARCHAR(191) NOT NULL,
    `externalPlayerId` VARCHAR(191) NULL,
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ProPlayer_gameId_externalPlayerId_key`(`gameId`, `externalPlayerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PlayerMatchStats` ADD CONSTRAINT `PlayerMatchStats_proPlayerId_fkey` FOREIGN KEY (`proPlayerId`) REFERENCES `ProPlayer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProPlayer` ADD CONSTRAINT `ProPlayer_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
