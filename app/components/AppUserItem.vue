<script setup lang="ts">
defineProps<{
  name: string;
  username: string;
  photoUrl: string;
  withStatus?: boolean;
}>();
function copyUsername(text: string) {
  window.navigator.clipboard.writeText(text);
}
</script>

<template>
  <li class="list-row flex-wrap">
    <div :class="withStatus ? '!row-start-2' : '!row-start-1'" class="!column-start-1">
      <img v-if="photoUrl" class="size-10 rounded-box" :src="photoUrl">
      <div v-else class="size-10 rounded-box" />
    </div>
    <div :class="withStatus ? '!row-start-2' : '!row-start-1'" class="!column-start-2">
      <div>{{ name }}</div>
      <div class="cursor-pointer hover:underline text-xs  font-semibold opacity-60" @click="copyUsername(username)">
        @{{ username }}
      </div>
    </div>
    <slot name="add" />
    <slot name="remind" />
    <slot name="pay-status" />
    <slot name="pay-question" />
  </li>
</template>

<style scoped>

</style>
