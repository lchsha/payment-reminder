PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_event_participant` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`event_id` integer NOT NULL,
	`is_paid` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_event_participant`("user_id", "event_id", "is_paid") SELECT "user_id", "event_id", "is_paid" FROM `event_participant`;--> statement-breakpoint
DROP TABLE `event_participant`;--> statement-breakpoint
ALTER TABLE `__new_event_participant` RENAME TO `event_participant`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_group_member` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`group_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_group_member`("group_id", "user_id") SELECT "group_id", "user_id" FROM `group_member`;--> statement-breakpoint
DROP TABLE `group_member`;--> statement-breakpoint
ALTER TABLE `__new_group_member` RENAME TO `group_member`;