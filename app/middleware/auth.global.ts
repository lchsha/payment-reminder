export default defineNuxtRouteMiddleware(async (to) => {
  const user = useState("user");

  // Если на сервере — читаем event.context.user, переданный из server middleware
  if (import.meta.server) {
    const event = useRequestEvent();
    user.value = event?.context.user || null;
  }

  // Если на клиенте и user ещё не задан, можно сделать запрос к API профиля
  if (import.meta.client && !user.value) {
    try {
      const profile = await $fetch("/api/profile"); // возвращает данные из event.context.user
      user.value = profile;
    }
    catch {
      user.value = null;
    }
  }

  // Если нет пользователя и страница не index
  if (!user.value && to.path !== "/") {
    return navigateTo("/");
  }
  else if (user.value && to.path === "/") {
    return navigateTo("/users");
  }
});
