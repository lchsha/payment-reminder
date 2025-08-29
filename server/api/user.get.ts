import db from "~/lib/db";
import { user } from "~/lib/db/schema/user";

export default defineEventHandler(async () => {
  const result = await db.select().from(user);
  return result;
});
