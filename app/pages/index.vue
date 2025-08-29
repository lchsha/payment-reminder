<script setup lang="ts">
// import AppTelegramLogin from "~/components/AppTelegramLogin.vue";

definePageMeta({
  layout: "login",
});
</script>

<template>
  <div class="h-full flex items-center justify-center flex-col gap-10">
    <!-- <button class="btn btn-success p-8 text-lg text-white rounded-xl">

    </button> -->
    <h1 class="font-bold text-3xl">
      Авторизируйтесь через телеграм
    </h1>
    <AppTelegramLogin />
  </div>
</template>

<style scoped>

</style>
