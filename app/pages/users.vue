<script setup lang="ts">
import type { User } from "~/stores/user";

const userStore = useUserStore();
await userStore.fetchUsers();
const users: User[] = userStore.users;
</script>

<template>
  <ul class="users list bg-base-100 rounded-box shadow-md w-full md:w-125">
    <AppUserItem v-for="(item) in users" :key="item.id" :name="item.name" :username="item.username" :photo-url="item.photoUrl" />
  </ul>
</template>

<style scoped></style>
