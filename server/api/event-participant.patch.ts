import { and, eq, gt, gte, ne } from "drizzle-orm";

import db from "~/lib/db";
import { eventParticipant } from "~/lib/db/schema/event-participant";

export default defineEventHandler(async (e) => {
  const body = await readBody(e);
  const { userId, eventId } = body;

  if (!userId || !eventId) {
    return {
      status: false,
      message: "Пользователь или событие не указаны",
    };
  }

  try {
    await db.update(eventParticipant)
      .set({ isPaid: 1 })
      .where(and(eq(eventParticipant.userId, userId), eq(eventParticipant.eventId, eventId)));
    return {
      status: true,
      message: "Статус участника события успешно обновлён!",
    };
  }
  catch (error) {
    return {
      status: false,
      message: "Не удалось обновить статус участника события",
      error,
    };
  }
});
