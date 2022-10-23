/*
  Warnings:

  - Made the column `created_at` on table `clients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `clients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `clients_group` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `clients_group` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `files` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `files` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `group` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `group` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `messages` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `messages` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `sections` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `sections` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `send_history` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `send_history` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `settings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `settings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `shipping_history` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `shipping_history` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `survey` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `survey` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `clients` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `clients_group` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `files` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `group` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `messages` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `sections` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `send_history` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `settings` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `shipping_history` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `survey` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;
