import { setCookie } from "h3";

export default defineEventHandler((event) => {
  // Устанавливаем пустое значение и моментальный срок действия
  setCookie(event, "auth_token", "", {
    httpOnly: true,
    sameSite: "strict",
    secure: true, // В проде лучше оставить true
    path: "/",
    maxAge: 0, // моментально удаляет
  });

  return { status: "ok" };
});
