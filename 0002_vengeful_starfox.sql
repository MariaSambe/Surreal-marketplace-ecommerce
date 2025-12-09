CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	`orderId` int,
	`rating` int NOT NULL,
	`title` varchar(256),
	`content` text,
	`isVerifiedPurchase` boolean NOT NULL DEFAULT false,
	`isApproved` boolean NOT NULL DEFAULT true,
	`helpfulVotes` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_badges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`badgeType` enum('first_purchase','energy_master','collector','mythic_hunter','reviewer','early_adopter','dimension_walker','loyal_customer') NOT NULL,
	`earnedAt` timestamp NOT NULL DEFAULT (now()),
	`metadata` json,
	CONSTRAINT `user_badges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wishlist` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	`addedAt` timestamp NOT NULL DEFAULT (now()),
	`notifyOnLowStock` boolean NOT NULL DEFAULT true,
	`personalNote` text,
	CONSTRAINT `wishlist_id` PRIMARY KEY(`id`)
);
