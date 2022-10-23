/*
  Warnings:

  - A unique constraint covering the columns `[message_id]` on the table `receive_messages_api` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[message_id]` on the table `send_messages_api` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `clients` ADD COLUMN `exists` BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX `receive_messages_api_message_id_key` ON `receive_messages_api`(`message_id`);

-- CreateIndex
CREATE UNIQUE INDEX `send_messages_api_message_id_key` ON `send_messages_api`(`message_id`);
