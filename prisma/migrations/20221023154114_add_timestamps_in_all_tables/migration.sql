-- AlterTable
ALTER TABLE `clients` ADD COLUMN `created_at` TIMESTAMP(0) NULL,
    ADD COLUMN `updated_at` TIMESTAMP(0) NULL;

-- AlterTable
ALTER TABLE `clients_group` ADD COLUMN `created_at` TIMESTAMP(0) NULL,
    ADD COLUMN `updated_at` TIMESTAMP(0) NULL;

-- AlterTable
ALTER TABLE `files` ADD COLUMN `created_at` TIMESTAMP(0) NULL,
    ADD COLUMN `updated_at` TIMESTAMP(0) NULL;

-- AlterTable
ALTER TABLE `group` ADD COLUMN `created_at` TIMESTAMP(0) NULL,
    ADD COLUMN `updated_at` TIMESTAMP(0) NULL;

-- AlterTable
ALTER TABLE `messages` ADD COLUMN `created_at` TIMESTAMP(0) NULL,
    ADD COLUMN `updated_at` TIMESTAMP(0) NULL;

-- AlterTable
ALTER TABLE `sections` ADD COLUMN `created_at` TIMESTAMP(0) NULL,
    ADD COLUMN `updated_at` TIMESTAMP(0) NULL;

-- AlterTable
ALTER TABLE `settings` ADD COLUMN `created_at` TIMESTAMP(0) NULL,
    ADD COLUMN `updated_at` TIMESTAMP(0) NULL;

-- AlterTable
ALTER TABLE `shipping_history` ADD COLUMN `created_at` TIMESTAMP(0) NULL,
    ADD COLUMN `updated_at` TIMESTAMP(0) NULL,
    MODIFY `id_message` INTEGER NULL,
    MODIFY `phone_number` VARCHAR(191) NOT NULL,
    MODIFY `hour` TIME(0) NULL,
    MODIFY `date` DATE NULL;

-- AlterTable
ALTER TABLE `survey` ADD COLUMN `created_at` TIMESTAMP(0) NULL,
    ADD COLUMN `updated_at` TIMESTAMP(0) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `created_at` TIMESTAMP(0) NULL,
    ADD COLUMN `updated_at` TIMESTAMP(0) NULL;
