import type { H3Event } from "h3";

import { defineEventHandler } from "h3";

let clients: H3Event[] = [];

export default defineEventHandler((event: H3Event) => {
  // Настройка SSE
  event.res.setHeader("Content-Type", "text/event-stream");
  event.res.setHeader("Cache-Control", "no-cache");
  event.res.setHeader("Connection", "keep-alive");
  event.res.flushHeaders?.();

  clients.push(event);

  // Очистка при отключении
  event.req.on("close", () => {
    clients = clients.filter(c => c !== event);
  });

  // Просто держим соединение открытым
  return new Promise(() => {});
});

// Функция для отправки события всем клиентам
export function sendTelegramUpdate(data: any) {
  clients.forEach((client) => {
    client.res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}
