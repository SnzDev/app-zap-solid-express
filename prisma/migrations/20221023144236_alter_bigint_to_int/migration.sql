/*
  Warnings:

  - The primary key for the `clients` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `clients` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - The primary key for the `clients_group` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `clients_group` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - You are about to alter the column `group_id` on the `clients_group` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `client_id` on the `clients_group` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `company` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `company` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - The primary key for the `config` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `config` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - You are about to alter the column `line` on the `config` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `failed_jobs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `failed_jobs` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - The primary key for the `files` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `files` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - The primary key for the `group` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `group` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - The primary key for the `jobs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `jobs` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - The primary key for the `messages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `messages` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - The primary key for the `sections` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `sections` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - The primary key for the `send_history` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `send_history` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - The primary key for the `settings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `settings` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - The primary key for the `shipping_history` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `shipping_history` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - You are about to alter the column `phone_number` on the `shipping_history` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `survey` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `survey` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `users` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.

*/
-- AlterTable
ALTER TABLE `clients` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `clients_group` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `group_id` INTEGER NOT NULL,
    MODIFY `client_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `company` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `config` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `line` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `failed_jobs` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `files` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `group` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `jobs` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `messages` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `sections` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `send_history` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `settings` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `shipping_history` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `phone_number` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `survey` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);
