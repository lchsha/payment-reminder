import { defineStore } from "pinia";

export type Group = {
  id: number;
  name: string;
  creatorId: number;
};

export const useGroupStore = defineStore("group", () => {
  const groups = ref<Group[]>([]);

  async function fetchGroups() {
    try {
      const data = await $fetch<Group[]>("/api/group");
      groups.value = data || [];
      return groups.value;
    }
    catch (error) {
      console.error("Ошибка при загрузке групп", error);
      groups.value = [];
      return [];
    }
  }

  return {
    fetchGroups,
    groups,
  };
});
