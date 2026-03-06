CREATE TABLE `resume_section_instance` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`template_id` integer NOT NULL,
	`section_type` text NOT NULL,
	`created_at` text DEFAULT 'datetime(''now'')',
	`updated_at` text DEFAULT 'datetime(''now'')',
	FOREIGN KEY (`template_id`) REFERENCES `template`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `resume_section_instance_data` (
	`instance_id` integer NOT NULL,
	`data_item_id` integer NOT NULL,
	FOREIGN KEY (`instance_id`) REFERENCES `resume_section_instance`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`data_item_id`) REFERENCES `resume_data_item`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `resume_section_config` ADD `instance_id` integer REFERENCES resume_section_instance(id);