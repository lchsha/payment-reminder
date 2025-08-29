import { int, sqliteTable } from "drizzle-orm/sqlite-core";

import { group } from "./group";
import { user } from "./user";

export const groupMember = sqliteTable("group_member", {
  id: int().primaryKey({ autoIncrement: true }),
  groupId: int("group_id").notNull().references(() => group.id),
  userId: int("user_id").notNull().references(() => user.id),
});
