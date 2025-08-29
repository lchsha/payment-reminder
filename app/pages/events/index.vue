<script setup lang="ts">
import type { EventForm } from "~/shared/schemas/event";

import { EventSchema } from "~/shared/schemas/event";

const groupStore = useGroupStore();
await useAsyncData("group", () => groupStore.fetchGroups());
const groups = computed(() => groupStore.groups);

const eventStore = useEventStore();
await useAsyncData("event", () => eventStore.fetchEvents());
const events = computed(() => eventStore.events);

const form = ref<EventForm>({
  name: "",
  group: "Выберите группу",
});

const errors = ref<Record<string, string>>({});
const success = ref(false);

type CreateEventResponse = {
  status: boolean;
  message: string;
};

async function createEvent() {
  const result = EventSchema.safeParse(form.value);
  errors.value = {};
  if (!result.success) {
    success.value = false;
    for (const issue of result.error.issues) {
      errors.value[issue.path[0]] = issue.message;
    }
    return;
  }

  try {
    const query: CreateEventResponse = await $fetch("/api/event", {
      method: "POST",
      body: form.value,
    });
    errors.value = {
      name: query.message,
    };
    success.value = query.status;
    if (query.status) {
      form.value.name = "";
      form.value.group = "Выберите группу";
      await eventStore.fetchEvents();
    }
  }
  catch (err) {
    errors.value = {
      name: "Ошибка отправки",
    };
    console.error("Ошибка отправки:", err);
  }
}
</script>

<template>
  <div>
    <button class="btn btn-primary" onclick="my_modal_7.showModal()">
      Создать событие
    </button>
    <ul class="events w-full md:w-88 mt-10">
      <AppEventItem v-for="(item) in events" :id="item.id" :key="item.id" :name="item.name" />
    </ul>
    <dialog id="my_modal_7" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box">
        <form class="flex flex-wrap flex-column gap-2" @submit.prevent="createEvent">
          <input v-model="form.name" type="text" placeholder="Название события" class="input grow">
          <select v-model="form.group" class="select grow">
            <option disabled value="Выберите группу">
              Выберите группу
            </option>
            <option v-for="(item, index) in groups" :key="index" :value="item.id.toString()">
              {{ item.name }}
            </option>
          </select>
          <button class="btn btn-primary">
            Создать
          </button>
          <span v-if="errors.name || errors.group" :class="{ 'text-red-500': !success, 'text-green-500': success }"><div>{{ errors.name }}</div><div>{{ errors.group }}</div></span>
        </form>
        <div class="modal-action">
          <form method="dialog">
            <button class="btn">
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style scoped>

</style>
