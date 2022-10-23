/*
  Warnings:

  - You are about to drop the column `created_at` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `company` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`;

-- AlterTable
ALTER TABLE `failed_jobs` MODIFY `failed_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `receive_messages_api` MODIFY `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `send_messages_api` MODIFY `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `shipping_history` ADD COLUMN `isStartMessage` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `id_message` INTEGER NULL,
    MODIFY `phone_number` VARCHAR(191) NOT NULL,
    MODIFY `hour` TIME(0) NULL,
    MODIFY `date` DATE NULL;

-- AlterTable
ALTER TABLE `survey` MODIFY `hour` TIME(0) NULL,
    MODIFY `date` DATE NULL;

-- AddForeignKey
ALTER TABLE `shipping_history` ADD CONSTRAINT `shipping_history_id_company_fkey` FOREIGN KEY (`id_company`) REFERENCES `company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shipping_history` ADD CONSTRAINT `shipping_history_id_group_fkey` FOREIGN KEY (`id_group`) REFERENCES `group`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shipping_history` ADD CONSTRAINT `shipping_history_id_survey_fkey` FOREIGN KEY (`id_survey`) REFERENCES `survey`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shipping_history` ADD CONSTRAINT `shipping_history_id_message_fkey` FOREIGN KEY (`id_message`) REFERENCES `messages`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shipping_history` ADD CONSTRAINT `shipping_history_id_section_fkey` FOREIGN KEY (`id_section`) REFERENCES `sections`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
