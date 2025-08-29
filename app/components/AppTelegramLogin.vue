<script setup lang="ts">
// useHead({
//   script: [
//     {
//       "src": "https://telegram.org/js/telegram-widget.js?22",
//       "data-telegram-login": "friends_payment_reminder_bot", // Replace with your bot's username
//       "data-size": "large",
//       "data-radius": "10",
//       "data-onauth": "onTelegramAuth(user)",
//       "data-auth-url": "/api/auth/telegram", // Your auth endpoint
//       "data-request-access": "write",
//       "async": true,
//     },
//   ],
// });
onMounted(() => {
  const script = ref(document.createElement("script"));
  script.value.src = "https://telegram.org/js/telegram-widget.js?22";
  script.value.setAttribute("data-telegram-login", "friends_payment_reminder_bot");
  script.value.setAttribute("data-size", "large");
  script.value.setAttribute("data-radius", "10");
  script.value.setAttribute("data-onauth", "onTelegramAuth(user)");
  script.value.setAttribute("data-request-access", "write");
  script.value.async = true;
  document.getElementById("telegram-login-button").appendChild(script.value);
  window.onTelegramAuth = (user) => {
    auth(user);
  };
});

async function auth(user) {
  try {
    const query = await $fetch("/api/auth", {
      method: "POST",
      body: user,
    });
    if (query.length && query[0].telegramId) {
      navigateTo("/users");
    }
  }
  catch (error) {

  }
}
</script>

<template>
  <div>
    <div id="telegram-login-button" />
  </div>
</template>
