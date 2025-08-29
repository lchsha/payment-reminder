import db from "~/lib/db";
import { group } from "~/lib/db/schema/group";

export default defineEventHandler(async () => {
  const result = await db.select().from(group);
  return result;
});
