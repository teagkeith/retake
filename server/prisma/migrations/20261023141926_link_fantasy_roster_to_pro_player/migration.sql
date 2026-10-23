-- AddForeignKey
ALTER TABLE `FantasyRosterPlayer` ADD CONSTRAINT `FantasyRosterPlayer_proPlayerId_fkey` FOREIGN KEY (`proPlayerId`) REFERENCES `ProPlayer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
