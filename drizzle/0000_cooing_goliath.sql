CREATE TABLE `resume_config` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`theme_id` integer NOT NULL,
	`uuid` text NOT NULL,
	`name` text NOT NULL,
	`created_at` text DEFAULT 'datetime(''now'')',
	`updated_at` text DEFAULT 'datetime(''now'')',
	FOREIGN KEY (`theme_id`) REFERENCES `themes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `resume_config_uuid_unique` ON `resume_config` (`uuid`);--> statement-breakpoint
CREATE TABLE `resume_data_item` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type_id` integer NOT NULL,
	`title` text,
	`description` text,
	`data` text,
	`created_at` text DEFAULT 'datetime(''now'')',
	`updated_at` text DEFAULT 'datetime(''now'')',
	FOREIGN KEY (`type_id`) REFERENCES `resume_data_item_type`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `resume_data_item_type` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `resume_data_item_type_name_unique` ON `resume_data_item_type` (`name`);--> statement-breakpoint
CREATE TABLE `resume_section_config` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`resume_id` integer NOT NULL,
	`section_type` text NOT NULL,
	`template_id` integer NOT NULL,
	`section_order` integer DEFAULT 0,
	FOREIGN KEY (`resume_id`) REFERENCES `resume_config`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`template_id`) REFERENCES `template`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `resume_section_data` (
	`section_id` integer NOT NULL,
	`data_item_id` integer NOT NULL,
	FOREIGN KEY (`section_id`) REFERENCES `resume_section_config`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`data_item_id`) REFERENCES `resume_data_item`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `template` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`theme_id` integer NOT NULL,
	`name` text NOT NULL,
	`section_type` text NOT NULL,
	`content` text NOT NULL,
	`description` text,
	`created_at` text DEFAULT 'datetime(''now'')',
	FOREIGN KEY (`theme_id`) REFERENCES `themes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `themes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`description` text,
	`sty_source` text,
	`is_system` integer,
	`owner_user_id` text,
	`created_at` text DEFAULT 'datetime(''now'')'
);
