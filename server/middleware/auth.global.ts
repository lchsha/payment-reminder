import jwt from "jsonwebtoken";

import env from "~/lib/env";

export default defineEventHandler((event) => {
  const token = getCookie(event, "auth_token");

  if (!token)
    return; // куки нет → user останется undefined

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET!);
    event.context.user = decoded; // кладём данные в контекст запроса
  }
  catch {
    // Если токен невалиден — удалим куку
    deleteCookie(event, "auth_token");
  }
});
