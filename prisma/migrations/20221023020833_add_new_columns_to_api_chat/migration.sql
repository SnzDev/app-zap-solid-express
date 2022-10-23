-- AlterTable
ALTER TABLE `chat_history` ADD COLUMN `has_reaction` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `is_dynamic_reply_buttons_msg` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `location` VARCHAR(191) NULL,
    ADD COLUMN `quotedParticipant` VARCHAR(191) NULL,
    ADD COLUMN `quotedStanzaID` VARCHAR(191) NULL,
    MODIFY `device_type` VARCHAR(191) NULL;
