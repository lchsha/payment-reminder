import * as z from "zod";
import "dotenv/config";

const EnvSchema = z.object({
  TURSO_DATABASE_URL: z.string(),
  TURSO_AUTH_TOKEN: z.string(),
  NODE_ENV: z.string(),
  TELEGRAM_BOT_TOKEN: z.string(),
  JWT_SECRET: z.string(),
  APP_URL: z.string(),
});

const env = EnvSchema.parse(process.env);

export default env;
