import { z } from "zod";

export const EventSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  group: z.string().refine(val => val !== "Выберите группу", { message: "Выберите группу" }),
//   group: z.preprocess((val) => {
//     if (typeof val === "string") {
//       return Number.parseInt(val);
//     }
//     return val;
//   }, z.int()),
});

export type EventForm = z.infer<typeof EventSchema>;
