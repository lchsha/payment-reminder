import { and, eq, gt, gte, ne } from "drizzle-orm";
import { setCookie } from "h3";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

import db from "~/lib/db";
import { user } from "~/lib/db/schema/user";
import env from "~/lib/env";

export default defineEventHandler(async (e) => {
  const body = await readBody(e);
  const botToken = env.TELEGRAM_BOT_TOKEN;

  const sortedData = Object.keys(body)
    .filter(item => item !== "hash")
    .sort()
    .map(item => `${item}=${body[item]}`)
    .join("\n");
  const secretKey = crypto.createHash("sha256").update(botToken).digest();
  const hmac = crypto.createHmac("sha256", secretKey).update(sortedData).digest("hex");

  if (hmac !== body.hash) {
    throw createError({ statusCode: 401, statusMessage: "Invalid hash" });
  }

  let existing = await db.select().from(user).where(eq(user.telegramId, body.id));

  if (!existing.length) {
    existing = await db.insert(user).values({
      name: body.first_name,
      username: body.username ?? "",
      telegramId: body.id,
      photoUrl: body.photo_url ?? `https://eu.ui-avatars.com/api/?name=${body.username}&background=random&size=128`,
    }).returning();
  }
  else {
    await db.update(user)
      .set({ photoUrl: body.photo_url ?? `https://eu.ui-avatars.com/api/?name=${existing[0].name}&background=random&size=128` })
      .where(eq(user.id, existing[0].id));
    existing = await db.select().from(user).where(eq(user.telegramId, body.id));
  }

  const userId = existing[0].id;
  const token = jwt.sign({ userId }, env.JWT_SECRET!, { expiresIn: "180d" });

  setCookie(e, "auth_token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: env.NODE_ENV === "production",
    // secure: ,
    maxAge: 60 * 60 * 24 * 180, // 180 дней в секундах
    path: "/",
  });

  setCookie(e, "user_id", userId, {
    httpOnly: false,
    sameSite: "strict",
    secure: env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 180, // 180 дней в секундах
    path: "/",
  });

  return existing;
});
