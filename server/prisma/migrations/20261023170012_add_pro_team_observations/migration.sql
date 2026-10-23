-- CreateTable
CREATE TABLE `ProTeamObservation` (
    `id` VARCHAR(191) NOT NULL,
    `playerId` VARCHAR(191) NOT NULL,
    `teamId` VARCHAR(191) NOT NULL,
    `source` VARCHAR(191) NOT NULL,
    `observedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ProTeamObservation_playerId_observedAt_idx`(`playerId`, `observedAt`),
    INDEX `ProTeamObservation_teamId_idx`(`teamId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProTeamObservation` ADD CONSTRAINT `ProTeamObservation_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `ProPlayer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProTeamObservation` ADD CONSTRAINT `ProTeamObservation_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `ProTeam`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
