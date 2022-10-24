-- AlterTable
ALTER TABLE `chat_history` MODIFY `v_cards` VARCHAR(191) NULL,
    MODIFY `mentioned_ids` VARCHAR(191) NULL,
    MODIFY `links` VARCHAR(191) NULL,
    MODIFY `location` VARCHAR(191) NULL;
