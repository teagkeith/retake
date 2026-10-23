-- CreateTable
CREATE TABLE `ProTeamMembership` (
    `id` VARCHAR(191) NOT NULL,
    `playerId` VARCHAR(191) NOT NULL,
    `teamId` VARCHAR(191) NOT NULL,
    `joinedAt` DATETIME(3) NOT NULL,
    `leftAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ProTeamMembership_playerId_idx`(`playerId`),
    INDEX `ProTeamMembership_teamId_idx`(`teamId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProTeamMembership` ADD CONSTRAINT `ProTeamMembership_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `ProPlayer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProTeamMembership` ADD CONSTRAINT `ProTeamMembership_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `ProTeam`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
