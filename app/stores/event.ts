import { defineStore } from "pinia";

export type Event = {
  id: number;
  groupId: number;
  date: string;
  paidByUserId: number;
};

export const useEventStore = defineStore("event", () => {
  const events = ref<Event[]>([]);

  async function fetchEvents() {
    try {
      const data = await $fetch<Event[]>("/api/event");
      events.value = data || [];
      return events.value;
    }
    catch (error) {
      console.error("Ошибка при загрузке событий", error);
      events.value = [];
      return [];
    }
  }

  return {
    events,
    fetchEvents,
  };
});
