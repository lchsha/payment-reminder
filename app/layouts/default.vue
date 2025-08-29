<script setup lang="ts">
const user = useState("user");
async function logout() {
  await $fetch("/api/logout", { method: "POST" });
  user.value = null;
  navigateTo("/");
}
</script>

<template>
  <div class="wrapper bg-purple-50">
    <AppNavbar>
      <div class="flex-none">
        <!-- change popover-1 and --anchor-1 names. Use unique names for each dropdown -->
        <button class="btn" popovertarget="popover-1" style="anchor-name:--anchor-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block h-5 w-5 stroke-current"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /> </svg>
        </button>
        <ul
          id="popover-1"
          class="dropdown dropdown-end menu w-25 rounded-box bg-base-100 shadow-sm mt-2" popover style="position-anchor:--anchor-1"
        >
          <li>
            <div class="active:bg-indigo-500!" @click.prevent="logout">
              Выйти
            </div>
          </li>
        </ul>
      </div>
    </AppNavbar>
    <div class="container my-10 md:my-15 px-4 mx-auto flex gap-6">
      <aside class="w-full md:w-64 shrink-0 left-menu">
        <AppMenu />
      </aside>
      <main class="grow">
        <slot />
      </main>
    </div>
    <footer />
  </div>
</template>

<style scoped>
@media (max-width: 767.98px) {
  .left-menu {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }
}
</style>
