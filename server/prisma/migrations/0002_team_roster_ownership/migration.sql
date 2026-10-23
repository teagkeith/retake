-- CreateTable
CREATE TABLE `FantasyTeam` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FantasyRosterPlayer` (
    `id` VARCHAR(191) NOT NULL,
    `fantasyTeamId` VARCHAR(191) NOT NULL,
    `proPlayerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `FantasyRosterPlayer_fantasyTeamId_proPlayerId_key`(`fantasyTeamId`, `proPlayerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Preserve the existing test lineup by creating its parent team.
INSERT INTO `FantasyTeam` (`id`, `name`)
VALUES ('test-team-1', 'Test Fantasy Team');

-- AddForeignKey
ALTER TABLE `FantasyLineup` ADD CONSTRAINT `FantasyLineup_fantasyTeamId_fkey` FOREIGN KEY (`fantasyTeamId`) REFERENCES `FantasyTeam`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FantasyRosterPlayer` ADD CONSTRAINT `FantasyRosterPlayer_fantasyTeamId_fkey` FOREIGN KEY (`fantasyTeamId`) REFERENCES `FantasyTeam`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
