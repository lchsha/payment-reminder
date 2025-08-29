import { int, sqliteTable } from "drizzle-orm/sqlite-core";

import { event } from "./event";
import { user } from "./user";

export const eventParticipant = sqliteTable("event_participant", {
  id: int().primaryKey({ autoIncrement: true }),
  userId: int("user_id").notNull().references(() => user.id),
  eventId: int("event_id").notNull().references(() => event.id),
  isPaid: int("is_paid").notNull().$default(() => 0),
});
