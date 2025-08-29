<script setup lang="ts">
import { group } from "node:console";

import type { Event } from "~/stores/event";

import timeConverter from "~/utils/timeConverter";

type EventParticipant = {
  userId: number;
  name: string;
  username: string;
  photoUrl: string;
  isPaid: boolean;
};
type GroupMember = {
  userId: number;
  memberId: number;
  name: string;
  username: string;
  photoUrl: string;
};

const eventStore = useEventStore();
const route = useRoute();

let event: Event | null = null;
if (!eventStore.events.length) {
  const events: Event[] = await eventStore.fetchEvents();
  event = events.find(item => +item.id === +route.params.id) ?? null;
}
else {
  event = eventStore.events.find(item => +item.id === +route.params.id) ?? null;
}

const { data: eventParticipants, refresh: refreshEventParticipants } = await useAsyncData<EventParticipant[]>("event-participants", () => $fetch(`/api/event-participant?eventId=${event.id}`));
const { data: groupMembers, refresh: refreshGroupMembers } = await useAsyncData<GroupMember[]>("group-members", () => $fetch(`/api/group-member?groupId=${event.groupId}`));

const createdDate: string = event ? timeConverter(event.date) : "";
const creatorId: number = event?.paidByUserId ?? 0;
const userId: number = useCookie("user_id");
const eventCreator = computed(() => groupMembers.value.find(el => el.userId === creatorId));
const isCreator: boolean = eventCreator.value.userId === userId.value;

const filteredGroupMembers = computed(() => {
  if (!groupMembers.value)
    return [];
  return groupMembers.value?.filter((item) => {
    return (item.userId !== creatorId
      && (
        eventParticipants.value?.length
          ? !eventParticipants.value.some(participant => participant.userId === item.userId)
          : true
      ));
  });
});

async function addEventMember(id: number): Promise<void> {
  try {
    const query = await $fetch("/api/event-participant", {
      method: "POST",
      body: {
        id,
        eventId: event?.id,
      },
    });
    if (query.status) {
      await refreshGroupMembers();
      await refreshEventParticipants();
    }
  }
  catch (error) {
    console.log("Не удалось добавить участника.", error);
  }
}

async function notify(telegramId: number): Promise<void> {
  try {
    const query = await $fetch("/api/notify", {
      method: "POST",
      body: {
        telegramId,
        eventId: event?.id,
      },
    });

    if (query.ok) {
      console.log("Уведомление отправлено.");
    }
  }
  catch (error) {
    console.log("Не удалось отправить уведомление.", error);
  }
}

async function changeStatus(userId: number): Promise<void> {
  try {
    const query = await $fetch("/api/event-participant", {
      method: "PATCH",
      body: {
        userId,
        eventId: event?.id,
      },
    });

    if (query.status) {
      await refreshEventParticipants();
    }
  }
  catch (error) {
    console.log("Не удалось изменить статус участника.", error);
  }
}

const whoPaidIds = ref<number[]>([]); // Массив  телеграм-ID тех, кто отправил уведомление об оплате
// const isTelegramResponsExist = ref(false);
let eventSource: EventSource | null = null;

onMounted(() => {
  eventSource = new EventSource("/api/telegram-sse");

  eventSource.onmessage = (e) => {
    const { data } = JSON.parse(e.data);
    if (whoPaidIds.value.includes(data.from.id))
      return;
    whoPaidIds.value.push(data.from.id);
  };
});
</script>

<template>
  <div>
    <NuxtLink to="/events" class="text-base flex flex gap-2 items-center mb-4">
      <Icon name="tabler:arrow-back-up" class="text-indigo-400" size="22" />
      <span>Назад</span>
    </NuxtLink>
    <h1 class="text-3xl font-bold mb-8 flex flex-wrap gap-2 justify-between flex-col md:flex-row">
      <span>{{ event.name }}</span> <span class="text-lg font-normal">{{ createdDate }} <br> Создатель: {{ eventCreator.name }}</span>
    </h1>
    <button v-if="isCreator" class="mb-8 btn btn-primary" onclick="my_modal_8.showModal()">
      Добавить участников
    </button>
    <h2 class="text-xl font-bold">
      Участники
    </h2>
    <ul class="participants list bg-base-100 rounded-box shadow-md w-full md:w-125 mt-6">
      <AppUserItem v-for="(item) in eventParticipants" :key="item.userId" :name="item.name" :username="item.username" :photo-url="item.photoUrl" :with-status="true">
        <template v-if="!item.isPaid" #remind>
          <button class="!row-start-2 !column-start-3 btn btn-square btn-ghost w-32 flex align-center" @click="notify(item.telegramId)">
            <Icon name="tabler:bell" size="22" class="text-green-400" />
            <span class="text-stone-600">Напомнить</span>
          </button>
        </template>
        <template #pay-status>
          <div class="!row-start-1 !column-start-1 col-span-full">
            <div>
              <div v-if="item.isPaid" class="px-1 border-solid border-1 rounded-sm border-green-500 text-green-500 text-center inline-block">
                Оплатил
              </div>
              <div v-else class="px-1 border-solid border-1 rounded-sm border-red-500 text-red-500 text-center inline-block">
                Не оплатил
              </div>
            </div>
          </div>
        </template>
        <template #pay-question>
          <!-- <pre>ids: {{ whoPaidIds }}</pre>
            <pre>item: {{ item.telegramId }} (type: {{ typeof item.telegramId }})</pre> -->
          <div v-if="!item.isPaid && whoPaidIds.includes(item.telegramId)" class="!row-start-3  mt-2 col-span-full">
            <span>Пользователь отправил уведомление об оплате. Изменить статус?</span>
            <div class="flex justify-start mt-1">
              <button class="btn btn-sm btn-success mr-2 text-white" @click="changeStatus(item.userId)">
                Оплатил
              </button>
              <button class="btn btn-sm btn-error text-white" @click="whoPaidIds = whoPaidIds.filter(id => id !== item.telegramId)">
                Не оплатил
              </button>
            </div>
          </div>
        </template>
      </AppUserItem>
    </ul>
    <dialog v-if="isCreator" id="my_modal_8" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box">
        <div class="max-h-67 overflow-auto">
          <ul v-if="filteredGroupMembers.length > 0" class="users list bg-base-100 rounded-box shadow-md ">
            <AppUserItem v-for="(item) in filteredGroupMembers" :key="item.userId" :name="item.name" :username="item.username" :photo-url="item.photoUrl">
              <template #add>
                <button class="btn btn-square btn-ghost" @click="addEventMember(item.userId)">
                  <Icon name="tabler:user-plus" size="22" class="text-indigo-500" />
                </button>
              </template>
            </AppUserItem>
          </ul>
          <div v-else>
            Все участники события из группы добавлены.
          </div>
        </div>
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
