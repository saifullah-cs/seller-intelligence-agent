-- CreateTable
CREATE TABLE `EtsyListing` (
    `listingId` VARCHAR(191) NOT NULL,
    `shopId` VARCHAR(191) NULL,
    `title` TEXT NOT NULL,
    `description` LONGTEXT NULL,
    `url` TEXT NULL,
    `priceValue` DECIMAL(12, 2) NULL,
    `priceCurrency` VARCHAR(10) NULL,
    `tags` JSON NULL,
    `materials` JSON NULL,
    `views` INTEGER NULL,
    `favorites` INTEGER NULL,
    `quantity` INTEGER NULL,
    `language` VARCHAR(20) NULL,
    `listingCreatedAt` VARCHAR(50) NULL,
    `fetchedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `EtsyListing_shopId_idx`(`shopId`),
    PRIMARY KEY (`listingId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
