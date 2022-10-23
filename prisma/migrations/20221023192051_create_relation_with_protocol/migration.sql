/*
  Warnings:

  - You are about to drop the column `isStartMessage` on the `shipping_history` table. All the data in the column will be lost.
  - Made the column `protocol` on table `shipping_history` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `shipping_history` DROP COLUMN `isStartMessage`,
    ADD COLUMN `is_startmessage` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `protocol` VARCHAR(200) NOT NULL;

-- AddForeignKey
ALTER TABLE `shipping_history` ADD CONSTRAINT `shipping_history_protocol_fkey` FOREIGN KEY (`protocol`) REFERENCES `chat_history`(`message_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
