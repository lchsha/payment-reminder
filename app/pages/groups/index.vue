<script setup lang="ts">
import type { GroupForm } from "~/shared/schemas/group";
import type { Group } from "~/stores/group";

import AppGroupItem from "~/components/AppGroupItem.vue";
import { GroupSchema } from "~/shared/schemas/group";

type CreateGroupResponse = {
  status: boolean;
  message: string;
};

const groupStore = useGroupStore();
await useAsyncData("group", () => groupStore.fetchGroups());
const groups = computed<Group[]>(() => groupStore.groups);

const form = ref<GroupForm>({
  name: "",
});

const errors = ref<Record<string, string>>({});
const success = ref(false);

async function handleSubmit() {
  const result = GroupSchema.safeParse(form.value);

  if (!result.success) {
    errors.value = {};
    for (const issue of result.error.issues) {
      errors.value[issue.path[0]] = issue.message;
    }
    return;
  }

  try {
    const query: CreateGroupResponse = await $fetch("/api/group", {
      method: "POST",
      body: form.value,
    });
    errors.value = {
      name: query.message,
    };
    success.value = query.status;
    if (query.status) {
      form.value.name = "";
      await groupStore.fetchGroups();
    }
  }
  catch (err) {
    errors.value = {
      name: "Ошибка отправки",
    };
    console.error("Ошибка отправки:", err);
  }
}

function resetErrors() {
  setTimeout(() => {
    errors.value = {};
    form.value.name = "";
  }, 300);
}
</script>

<template>
  <div>
    <button class="btn btn-primary" onclick="my_modal_5.showModal()">
      Создать группу
    </button>
    <ul class="groups w-full md:w-88 mt-10">
      <AppGroupItem v-for="(item) in groups" :id="item.id" :key="item.id" :name="item.name" />
    </ul>
    <dialog id="my_modal_5" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box">
        <form class="flex flex-wrap flex-column gap-2" @submit.prevent="handleSubmit">
          <input v-model="form.name" type="text" placeholder="Название группы" class="input grow">
          <button class="btn btn-primary">
            Создать
          </button>
          <span v-if="errors.name" :class="{ 'text-red-500': !success, 'text-green-500': success }">{{ errors.name }}</span>
        </form>
        <div class="modal-action">
          <form method="dialog">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn" @click="resetErrors">
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
