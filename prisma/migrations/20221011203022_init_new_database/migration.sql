-- CreateTable
CREATE TABLE `send_messages_api` (
    `id` VARCHAR(191) NOT NULL,
    `access_key` VARCHAR(191) NOT NULL,
    `file_url` VARCHAR(191) NULL,
    `ack` INTEGER NOT NULL,
    `message_id` VARCHAR(191) NOT NULL,
    `message_body` VARCHAR(191) NOT NULL,
    `sender` VARCHAR(191) NOT NULL,
    `destiny` VARCHAR(191) NOT NULL,
    `is_survey` BOOLEAN NULL,
    `first_option` VARCHAR(191) NULL,
    `first_answer` VARCHAR(191) NULL,
    `second_option` VARCHAR(191) NULL,
    `second_answer` VARCHAR(191) NULL,
    `response` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL,
    `active` BOOLEAN NOT NULL,
    `line` BIGINT NOT NULL,
    `app` VARCHAR(200) NOT NULL,
    `access_key` VARCHAR(200) NOT NULL,
    `port` INTEGER NOT NULL,
    `webhook_url` VARCHAR(250) NULL,
    `webhook_method` ENUM('get', 'post') NULL,
    `id_external` VARCHAR(255) NULL,
    `url_line` VARCHAR(255) NULL,

    UNIQUE INDEX `company_access_key_key`(`access_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clients` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_company` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `phone_number` VARCHAR(19) NOT NULL,
    `cpf` VARCHAR(100) NULL,
    `email` VARCHAR(100) NULL,
    `birthday` VARCHAR(100) NULL,
    `receive_messages` BOOLEAN NOT NULL,
    `id_external` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clients_group` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `group_id` BIGINT NOT NULL,
    `client_id` BIGINT NOT NULL,
    `extra_field_1` VARCHAR(200) NULL,
    `extra_field_2` VARCHAR(200) NULL,
    `extra_field_3` VARCHAR(200) NULL,
    `extra_field_4` VARCHAR(200) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `config` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_company` INTEGER NOT NULL,
    `line` BIGINT NOT NULL,
    `app` VARCHAR(200) NOT NULL,
    `access_key` VARCHAR(200) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `failed_jobs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(255) NOT NULL,
    `connection` TEXT NOT NULL,
    `queue` TEXT NOT NULL,
    `payload` LONGTEXT NOT NULL,
    `exception` LONGTEXT NOT NULL,
    `failed_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `files` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_company` INTEGER NOT NULL,
    `url` VARCHAR(250) NULL,
    `type` ENUM('photo', 'pdf', 'video', 'doc') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `group` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_company` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `interne_shift` ENUM('MORNING', 'AFTERNOON', 'NIGHT') NULL,
    `interne_shift_number` ENUM('1', '2') NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jobs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `queue` VARCHAR(255) NOT NULL,
    `payload` LONGTEXT NOT NULL,
    `attempts` TINYINT UNSIGNED NOT NULL,
    `reserved_at` INTEGER UNSIGNED NULL,
    `available_at` INTEGER UNSIGNED NOT NULL,
    `created_at` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `messages` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_company` INTEGER NOT NULL,
    `name` VARCHAR(100) NULL,
    `message` TEXT NOT NULL,
    `is_survey` BOOLEAN NOT NULL,
    `first_option` VARCHAR(50) NULL,
    `first_answer` VARCHAR(250) NULL,
    `second_option` VARCHAR(50) NULL,
    `second_answer` VARCHAR(250) NULL,
    `id_file` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `migrations` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `migration` VARCHAR(255) NOT NULL,
    `batch` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sections` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_company` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `send_history` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_company` INTEGER NOT NULL,
    `id_user` INTEGER NOT NULL,
    `id_group` INTEGER NOT NULL,
    `id_message` INTEGER NOT NULL,
    `is_scheduled` BOOLEAN NOT NULL DEFAULT false,
    `when` TIMESTAMP(0) NULL,
    `interval_start` INTEGER NULL,
    `interval_end` INTEGER NULL,
    `repeat` ENUM('DAY_DAY', 'ONE_ON_WEEK', 'ONE_ON_MONTH', 'EVERYDAY') NULL,
    `deleted_at` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settings` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_company` INTEGER NOT NULL,
    `fixed_ddd` BOOLEAN NOT NULL,
    `ddd` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shipping_history` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_company` INTEGER NOT NULL,
    `id_group` INTEGER NULL,
    `id_survey` INTEGER NULL,
    `id_message` INTEGER NOT NULL,
    `id_section` INTEGER NULL,
    `id_user` INTEGER NULL,
    `message` TEXT NOT NULL,
    `phone_number` BIGINT NOT NULL,
    `hour` TIME(0) NOT NULL,
    `date` DATE NOT NULL,
    `protocol` VARCHAR(200) NULL,
    `question_answer_correct` BOOLEAN NULL,
    `question_response` TEXT NULL,
    `question_response_date` TIMESTAMP(0) NULL,
    `status` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `survey` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_company` INTEGER NOT NULL,
    `id_group` INTEGER NOT NULL DEFAULT 0,
    `id_message` INTEGER NOT NULL DEFAULT 0,
    `id_section` INTEGER NULL,
    `hour` TIME(0) NOT NULL,
    `date` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(250) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `company` INTEGER NULL,
    `section` INTEGER NULL,
    `profile` ENUM('ADMIN', 'MANAGER', 'USER') NOT NULL,

    UNIQUE INDEX `users_email_unique`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `send_messages_api` ADD CONSTRAINT `send_messages_api_access_key_fkey` FOREIGN KEY (`access_key`) REFERENCES `company`(`access_key`) ON DELETE RESTRICT ON UPDATE CASCADE;
