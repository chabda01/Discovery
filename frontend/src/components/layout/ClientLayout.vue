<template>
  <div class="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
    <!-- SIDEBAR -->
    <ClientSidebar />

    <!-- MAIN -->
    <main class="flex-1 flex flex-col overflow-y-auto">
      <!-- CONTENT -->
      <div class="p-8 space-y-8">
        <RouterView />
      </div>

      <!-- FOOTER -->
      <Footer />
    </main>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import ClientSidebar from "./ClientSidebar.vue";
import Footer from "./Footer.vue";
import vehicleService from "../../services/vehicleService.js";

onMounted(() => {
  vehicleService.connect("ws://localhost:8080");
});

onBeforeUnmount(() => {
  vehicleService.disconnect();
});
</script>
