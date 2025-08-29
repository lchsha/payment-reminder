import { defineStore } from "pinia";

export type User = {
  id: number;
  name: string;
  username: string;
  photoUrl: string;
  telegramId: number;
};

export const useUserStore = defineStore("user", () => {
  const users = ref<User[]>([]);

  async function fetchUsers() {
    const { data } = await useFetch<User[]>("/api/user", {
      lazy: false,
      key: "user-list",
    });
    users.value = data.value || [];
  }

  return {
    fetchUsers,
    users,
  };
});
