/*
  Warnings:

  - You are about to alter the column `timestamp` on the `receive_messages_api` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `timestamp` on the `send_messages_api` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `receive_messages_api` MODIFY `timestamp` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `send_messages_api` MODIFY `timestamp` INTEGER NOT NULL;
