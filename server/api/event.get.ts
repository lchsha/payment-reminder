import db from "~/lib/db";
import { event } from "~/lib/db/schema/event";

export default defineEventHandler(async () => {
  const result = await db.select().from(event);
  return result;
});
