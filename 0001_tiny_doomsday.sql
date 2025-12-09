CREATE TABLE `cart_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`addedAt` timestamp NOT NULL DEFAULT (now()),
	`wasQuestioned` boolean NOT NULL DEFAULT false,
	`questionResponse` text,
	CONSTRAINT `cart_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cognitive_trail` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`eventType` enum('item_added','item_removed','quantity_changed','cart_questioned','cart_approved','cart_cleared','consciousness_shift') NOT NULL,
	`narrative` text NOT NULL,
	`eventData` json,
	`emotionalIntensity` int NOT NULL DEFAULT 5,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cognitive_trail_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `idempotency_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` varchar(128) NOT NULL,
	`userId` int NOT NULL,
	`operationType` varchar(64) NOT NULL,
	`result` json,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `idempotency_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `idempotency_tokens_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `oracular_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`logType` enum('system_pulse','stock_fluctuation','transaction_ritual','security_checkpoint','paradox_detection','consciousness_event','dimensional_shift') NOT NULL,
	`severity` enum('info','warning','critical','transcendent') NOT NULL DEFAULT 'info',
	`narrative` text NOT NULL,
	`technicalData` json,
	`relatedEntityType` varchar(64),
	`relatedEntityId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `oracular_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`transactionCode` varchar(64) NOT NULL,
	`status` enum('initiating','energy_debited','essence_transfer','synchronizing','completed','failed','paradox_avoided') NOT NULL DEFAULT 'initiating',
	`totalEnergyCost` int NOT NULL,
	`totalPriceCents` int NOT NULL,
	`stripePaymentIntentId` varchar(256),
	`stripeStatus` varchar(64),
	`orderItems` json,
	`transactionNarrative` text,
	`initiatedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_transactionCode_unique` UNIQUE(`transactionCode`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dimensionalCode` varchar(32) NOT NULL,
	`name` varchar(256) NOT NULL,
	`description` text,
	`energyCost` int NOT NULL,
	`priceCents` int NOT NULL,
	`biologicalEnergy` int NOT NULL DEFAULT 100,
	`decayRate` int NOT NULL DEFAULT 1,
	`rarityLevel` enum('common','uncommon','rare','legendary','mythic') NOT NULL DEFAULT 'common',
	`baseStock` int NOT NULL DEFAULT 10,
	`currentStock` int NOT NULL DEFAULT 10,
	`stockMood` enum('stable','volatile','generous','scarce') NOT NULL DEFAULT 'stable',
	`category` varchar(64) NOT NULL,
	`imageUrl` text,
	`echoHistory` json,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_dimensionalCode_unique` UNIQUE(`dimensionalCode`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `energyBalance` int DEFAULT 1000 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `awarenessLevel` int DEFAULT 1 NOT NULL;