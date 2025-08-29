import FormData from "form-data";
import fetch from "node-fetch";
import fs from "node:fs";

import env from "~/lib/env";

import { sendTelegramUpdate } from "./telegram-sse";

export default defineEventHandler(async (e) => {
  const body = await readBody(e); // h3 helper

  if (!body.callback_query || !body.callback_query.from || !body.callback_query.from.id)
    return { ok: false };
  if (body.callback_query.from.id) {
    sendTelegramUpdate({
      type: "callback_query",
      data: body.callback_query,
    });
  }

  return { ok: true };
});
