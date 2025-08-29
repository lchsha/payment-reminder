import { and, eq, gt, gte, ne } from "drizzle-orm";

import db from "~/lib/db";
import { event } from "~/lib/db/schema/event";
import { group } from "~/lib/db/schema/group";
import { user } from "~/lib/db/schema/user";
import env from "~/lib/env";

export default defineEventHandler(async (e) => {
  const { telegramId, eventId } = await readBody(e);

  //   const currentUser = await db.select().from(user).where(eq(user.id, userId));
  //   const telegramId = currentUser[0]?.telegramId;

  const currentEvent = await db.select().from(event).where(eq(event.id, Number(eventId)));
  const currentEventText = `${currentEvent[0]?.name} - ${new Date(currentEvent[0]?.date).toLocaleDateString("Ru-ru", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}`;

  const res = await $fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    body: {
      chat_id: telegramId, // временно для теста
      text: `Ты не оплатил мероприятие!\n${currentEventText}`,
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Нажми на кнопку если перевёл деньги.", callback_data: "confirm" },
          ],
        ],
      },
    },
  });

  return res;
});
