<script setup lang="ts">

</script>

<template>
  <div class="wrapper bg-purple-50">
    <AppNavbar />
    <div class="container my-15 mx-auto flex gap-6 grow">
      <main class="grow">
        <slot />
      </main>
    </div>
    <footer />
  </div>
</template>

<style scoped>

</style>
