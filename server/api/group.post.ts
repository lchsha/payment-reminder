import { z } from "zod";

import db from "~/lib/db";
import { group } from "~/lib/db/schema/group";
import { groupMember } from "~/lib/db/schema/group-member";
import { GroupSchema } from "~/shared/schemas/group";

export default defineEventHandler(async (e) => {
  const body = await readBody(e);
  const result = GroupSchema.safeParse(body);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Невалидные данные",
    });
  }

  try {
    const creatorId = getCookie(e, "user_id");

    const inserted = await db.insert(group).values({
      name: result.data.name,
      creatorId,
    }).returning();

    const newGroup = inserted[0];

    await db.insert(groupMember).values({
      groupId: Number(newGroup.id),
      userId: Number(creatorId),
    });

    return {
      status: result.success,
      message: "Группа успешно создана",
      groupId: newGroup.id,
    };
  }
  catch (error) {
    return {
      status: false,
      message: "Ошибка сохранения в базу данных",
    };
  }
});
