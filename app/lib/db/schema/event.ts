import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { group } from "./group";
import { user } from "./user";

export const event = sqliteTable("event", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  groupId: int("group_id").notNull().references(() => group.id),
  date: int().notNull().$default(() => Date.now()),
  paidByUserId: int("paid_by_user_id").notNull().references(() => user.id),
});
