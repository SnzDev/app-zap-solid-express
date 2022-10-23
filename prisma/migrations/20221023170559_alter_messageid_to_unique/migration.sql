/*
  Warnings:

  - A unique constraint covering the columns `[message_id]` on the table `chat_history` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `chat_history_message_id_key` ON `chat_history`(`message_id`);
