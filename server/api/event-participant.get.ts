import { and, eq, gt, gte, ne } from "drizzle-orm";

import db from "~/lib/db";
import { eventParticipant } from "~/lib/db/schema/event-participant";
import { user } from "~/lib/db/schema/user";

export default defineEventHandler(async (e) => {
  const { eventId } = getQuery(e);

  const participans = await db.select({
    name: user.name,
    username: user.username,
    userId: user.id,
    isPaid: eventParticipant.isPaid,
    telegramId: user.telegramId,
    photoUrl: user.photoUrl,
  })
    .from(eventParticipant)
    .innerJoin(user, eq(eventParticipant.userId, user.id))
    .where(eq(eventParticipant.eventId, Number(eventId)));
  return participans;
});
