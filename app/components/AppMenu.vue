<script setup lang="ts">

</script>

<template>
  <div class="menu-wrapper">
    <ul class="menu bg-indigo-100 rounded-box w-full grid-cols-3 grid gap-2 md:block">
      <li class="mb-1">
        <NuxtLink to="/users" class="text-base flex flex-col md:flex-row gap-0 md:gap-2">
          <Icon name="tabler:users" size="22" />
          <span class="text-xs md:text-base">Пользователи</span>
        </NuxtLink>
      </li>
      <li class="mb-1">
        <NuxtLink to="/groups" class="text-base active:bg-indigo-400 flex flex-col md:flex-row gap-0 md:gap-2">
          <Icon name="tabler:users-group" size="22" />
          <span class="text-xs md:text-base">Группы</span>
        </NuxtLink>
      </li>
      <li class="mb-1">
        <NuxtLink to="/events" class="text-base flex flex-col md:flex-row gap-0 md:gap-2">
          <Icon name="tabler:calendar" size="22" />
          <span class="text-xs md:text-base">События</span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.router-link-active {
  background-color: #7c86ff;
  color: #fff;
}
.menu li a:active {
  background-color: #7c86ff;
  color: #fff;
}
</style>
