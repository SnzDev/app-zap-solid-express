/*
  Warnings:

  - Added the required column `message_id` to the `chat_history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `chat_history` ADD COLUMN `message_id` VARCHAR(191) NOT NULL;
