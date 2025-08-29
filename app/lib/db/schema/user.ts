import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  username: text().notNull(),
  telegramId: int("telegram_id").notNull(),
  photoUrl: text("photo_url"),
});
