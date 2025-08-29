import FormData from "form-data";
import fetch from "node-fetch";

import env from "~/lib/env";

export default defineNitroPlugin(async (nitroApp) => {
  const webhookUrl = `${env.APP_URL}/api/webhook`;
  const form = new FormData();
  form.append("url", webhookUrl);
  try {
    const response = await $fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/setWebhook`, {
      method: "POST",
      body: { url: webhookUrl },
    });
    console.log("✅ Telegram webhook set:", response);
  }
  catch (err) {
    console.error("❌ Failed to set Telegram webhook:", err);
  }
});
