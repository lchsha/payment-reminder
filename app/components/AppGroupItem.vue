<script setup lang="ts">
defineProps<{
  name?: string;
  id?: number;
}>();
</script>

<template>
  <li class="p-0 mb-2 ">
    <NuxtLink :to="`/groups/${id}`" class="w-full block p-4 bg-indigo-100 hover:text-indigo-500 rounded-xl font-bold text-neutral-800 duration-200">
      <div>
        {{ name }}
      </div>
    </NuxtLink>
  </li>
</template>

<style scoped>
.list-row::after {
  display: none;
}
</style>
