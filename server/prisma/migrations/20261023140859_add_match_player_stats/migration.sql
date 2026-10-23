-- CreateTable
CREATE TABLE `GameMatch` (
    `id` VARCHAR(191) NOT NULL,
    `gameId` VARCHAR(191) NOT NULL,
    `externalMatchId` VARCHAR(191) NOT NULL,
    `durationSeconds` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `GameMatch_gameId_externalMatchId_key`(`gameId`, `externalMatchId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlayerMatchStats` (
    `id` VARCHAR(191) NOT NULL,
    `gameMatchId` VARCHAR(191) NOT NULL,
    `externalPlayerId` VARCHAR(191) NOT NULL,
    `kills` INTEGER NOT NULL,
    `deaths` INTEGER NOT NULL,
    `assists` INTEGER NOT NULL,
    `stats` JSON NULL,

    UNIQUE INDEX `PlayerMatchStats_gameMatchId_externalPlayerId_key`(`gameMatchId`, `externalPlayerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GameMatch` ADD CONSTRAINT `GameMatch_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlayerMatchStats` ADD CONSTRAINT `PlayerMatchStats_gameMatchId_fkey` FOREIGN KEY (`gameMatchId`) REFERENCES `GameMatch`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
