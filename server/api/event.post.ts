import { z } from "zod";

import db from "~/lib/db";
import { event } from "~/lib/db/schema";
import { EventSchema } from "~/shared/schemas/event";

export default defineEventHandler(async (e) => {
  const body = await readBody(e);
  const result = EventSchema.safeParse(body);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Невалидные данные",
    });
  }

  try {
    const creatorId = getCookie(e, "user_id");

    const inserted = await db.insert(event).values({
      name: result.data.name,
      groupId: Number(result.data.group),
      paidByUserId: Number(creatorId),
    }).returning();

    return {
      status: result.success,
      message: "Событие успешно создано",
    };
  }
  catch (error) {
    return {
      status: false,
      message: "Ошибка сохранения в базу данных",
    };
  }
});
