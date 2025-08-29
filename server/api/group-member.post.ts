import { and, eq, gt, gte, ne } from "drizzle-orm";

import db from "~/lib/db";
import { groupMember } from "~/lib/db/schema/group-member";
import { user } from "~/lib/db/schema/user";

export default defineEventHandler(async (e) => {
  const body = await readBody(e);
  const { groupId, id: userId } = body;

  const existing = await db.select()
    .from(groupMember)
    .where(and(eq(groupMember.groupId, groupId), eq(groupMember.userId, userId)));

  if (existing.length > 0) {
    return {
      status: false,
      message: "Пользователь уже состоит в группе",
    };
  }

  try {
    const inserted = await db.insert(groupMember).values({
      groupId,
      userId,
    }).returning();

    return {
      status: true,
      message: "Член группы успешно добавлен!",
    };
  }
  catch (error) {
    return {
      status: false,
      message: "Не удалось добавить члена группы",
    };
  }
});
