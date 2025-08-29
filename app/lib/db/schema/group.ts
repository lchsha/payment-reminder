import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./user";

export const group = sqliteTable("group", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  creatorId: int("creator_id").notNull().references(() => user.id),
});
