/*
  Warnings:

  - A unique constraint covering the columns `[protocol]` on the table `shipping_history` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `timestamp` to the `send_messages_api` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `send_messages_api` ADD COLUMN `timestamp` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `receive_messages_api` (
    `id` VARCHAR(191) NOT NULL,
    `access_key` VARCHAR(191) NOT NULL,
    `from` VARCHAR(191) NOT NULL,
    `to` VARCHAR(191) NOT NULL,
    `message_id` VARCHAR(191) NOT NULL,
    `message_body` VARCHAR(191) NOT NULL,
    `device_type` VARCHAR(191) NOT NULL,
    `has_media` BOOLEAN NOT NULL,
    `file_url` VARCHAR(191) NULL,
    `timestamp` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `shipping_history_protocol_key` ON `shipping_history`(`protocol`);

-- AddForeignKey
ALTER TABLE `receive_messages_api` ADD CONSTRAINT `receive_messages_api_access_key_fkey` FOREIGN KEY (`access_key`) REFERENCES `company`(`access_key`) ON DELETE RESTRICT ON UPDATE CASCADE;
