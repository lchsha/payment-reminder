import { and, eq, gt, gte, ne } from "drizzle-orm";

import db from "~/lib/db";
import { eventParticipant } from "~/lib/db/schema/event-participant";

export default defineEventHandler(async (e) => {
  const body = await readBody(e);
  const { id: userId, eventId } = body;

  const existing = await db.select()
    .from(eventParticipant)
    .where(and(eq(eventParticipant.userId, userId), eq(eventParticipant.eventId, eventId)));

  if (existing.length > 0) {
    return {
      status: false,
      message: "Пользователь уже является участником события",
    };
  }

  try {
    const inserted = await db.insert(eventParticipant).values({
      userId,
      eventId,
      isPaid: 0,
    }).returning();

    return {
      status: true,
      message: "Участник события успешно добавлен!",
    };
  }
  catch (error) {
    return {
      status: false,
      message: "Не удалось добавить участника",
    };
  }
});
