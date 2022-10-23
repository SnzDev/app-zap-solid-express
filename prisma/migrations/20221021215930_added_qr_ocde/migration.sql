/*
  Warnings:

  - Added the required column `updated_at` to the `company` table without a default value. This is not possible if the table is not empty.
  - Made the column `url_line` on table `company` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `company` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `qr` VARCHAR(191) NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    MODIFY `line` VARCHAR(191) NOT NULL,
    MODIFY `port` INTEGER NOT NULL DEFAULT 443,
    MODIFY `url_line` VARCHAR(255) NOT NULL DEFAULT 'zap.startmessage.com.br';

-- AlterTable
ALTER TABLE `send_messages_api` MODIFY `is_survey` BOOLEAN NULL DEFAULT false;
