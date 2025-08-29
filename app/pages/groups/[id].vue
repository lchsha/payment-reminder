<script setup lang="ts">
import type { Group } from "~/stores/group";

const groupStore = useGroupStore();
const route = useRoute();

type GroupMember = {
  id: number;
  userId: number;
  groupId: number;
};

let group: Group | null = null;
if (!groupStore.groups.length) {
  const groups: Group[] = await groupStore.fetchGroups();
  group = groups.find(item => +item.id === +route.params.id) ?? null;
}
else {
  group = groupStore.groups.find(item => +item.id === +route.params.id) ?? null;
}

const { data: members, refresh } = await useAsyncData<GroupMember[]>("group-members", () => $fetch(`/api/group-member?groupId=${group?.id}`));

const userStore = useUserStore();
await userStore.fetchUsers();
const users = computed(() => userStore.users.filter(user => !members.value?.find(member => member.userId === user.id)));

async function addMember(id: number): Promise<void> {
  try {
    const query = await $fetch("/api/group-member", {
      method: "POST",
      body: {
        id,
        groupId: group?.id,
      },
    });
    if (query.status) {
      users.value = users.value.filter(user => user.id !== id);
      await refresh();
    }
  }
  catch (error) {
    console.log("Не удалось добавить пользователя в группу.", error);
  }
}
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold">
      {{ group?.name }}
    </h1>
    <button class="mt-6 btn btn-primary" onclick="my_modal_6.showModal()">
      Добавить людей
    </button>
    <ul class="users list bg-base-100 rounded-box shadow-md w-full md:w-125 mt-10">
      <AppUserItem v-for="(item) in members" :key="item.memberId" :name="item.name" :username="item.username" :photo-url="item.photoUrl" />
    </ul>
    <dialog id="my_modal_6" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box">
        <div class="max-h-67 overflow-auto">
          <ul v-if="users.length > 0" class="users list bg-base-100 rounded-box shadow-md ">
            <AppUserItem v-for="(item) in users" :key="item.id" :name="item.name" :username="item.username" :photo-url="item.photoUrl">
              <template #add>
                <button class="btn btn-square btn-ghost" @click="addMember(item.id)">
                  <Icon name="tabler:user-plus" size="22" class="text-indigo-500" />
                </button>
              </template>
            </AppUserItem>
          </ul>
          <div v-else>
            Больше нет пользователей которые не состоят в этой группе.
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

<style scoped></style>
