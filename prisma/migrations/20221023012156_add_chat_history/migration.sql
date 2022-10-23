-- CreateTable
CREATE TABLE `chat_history` (
    `id` VARCHAR(191) NOT NULL,
    `access_key` VARCHAR(191) NOT NULL,
    `ack` INTEGER NOT NULL,
    `has_media` BOOLEAN NOT NULL DEFAULT false,
    `body` LONGTEXT NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `timestamp` INTEGER NOT NULL,
    `from` VARCHAR(191) NOT NULL,
    `to` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `device_type` VARCHAR(191) NOT NULL,
    `is_forwarded` BOOLEAN NOT NULL,
    `from_me` BOOLEAN NOT NULL DEFAULT false,
    `has_quoted_msg` BOOLEAN NOT NULL DEFAULT false,
    `v_cards` JSON NULL,
    `mentioned_ids` JSON NULL,
    `is_gif` BOOLEAN NOT NULL DEFAULT false,
    `is_ephemeral` BOOLEAN NOT NULL DEFAULT false,
    `links` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `chat_history` ADD CONSTRAINT `chat_history_access_key_fkey` FOREIGN KEY (`access_key`) REFERENCES `company`(`access_key`) ON DELETE RESTRICT ON UPDATE CASCADE;
