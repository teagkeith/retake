-- CreateTable
CREATE TABLE `FantasyLineup` (
    `id` VARCHAR(191) NOT NULL,
    `fantasyTeamId` VARCHAR(191) NOT NULL,
    `scoringWeekId` VARCHAR(191) NOT NULL,
    `status` ENUM('draft', 'submitted', 'locked') NOT NULL DEFAULT 'draft',
    `starterPlayerIds` JSON NOT NULL,
    `lockedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `FantasyLineup_fantasyTeamId_scoringWeekId_key`(`fantasyTeamId`, `scoringWeekId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
