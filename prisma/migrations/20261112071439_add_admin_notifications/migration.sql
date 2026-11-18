-- CreateTable
CREATE TABLE `admin_notifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `report_id` INTEGER NULL,
    `jenis` VARCHAR(191) NOT NULL,
    `pesan` TEXT NOT NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `admin_notifications_is_read_created_at_idx`(`is_read`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `admin_notifications` ADD CONSTRAINT `admin_notifications_report_id_fkey` FOREIGN KEY (`report_id`) REFERENCES `reports`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
