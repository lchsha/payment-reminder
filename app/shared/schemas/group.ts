import { z } from "zod";

export const GroupSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
});

export type GroupForm = z.infer<typeof GroupSchema>;
