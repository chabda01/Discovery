<template>
  <div
    class="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100"
  >
    <!-- SIDEBAR -->
    <Sidebar />

    <!-- MAIN -->
    <main class="flex-1 flex flex-col overflow-y-auto">
      <!-- TOP BAR -->
      <!-- <Topbar :title="pageTitle">
        <template #right>
          Slot : connexion
          <div class="flex items-center gap-2">
            <div
              :class="[
                'w-2 h-2 rounded-full',
                isConnected ? 'bg-green-500' : 'bg-red-500',
              ]"
            ></div>
            <span class="text-sm text-slate-400">{{
              isConnected ? "Connected" : "Disconnected"
            }}</span>
          </div>
        </template>
      </Topbar> -->

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
import { computed, onBeforeUnmount, ref } from "vue";
import { useRoute } from "vue-router";

import Sidebar from "./Sidebar.vue";
import Topbar from "./Topbar.vue";
import Footer from "./Footer.vue";

import vehicleService from "../../services/vehicleService.js";

const route = useRoute();
const isConnected = ref(false);

const pageTitle = computed(() => {
  if (route.name === "dashboard") return "System Overview";
  if (route.name === "fleet") return "Fleet Inventory";
  if (route.name === "fota") return "FOTA Control Center";
  if (route.name === "features") return "Features Catalog";
  return "VoltaLink";
});

// Connexion WS globale (1 seule fois)
vehicleService.connect("ws://localhost:8080");
isConnected.value = true;

// si tu veux vraiment fermer quand l’app se démonte :
onBeforeUnmount(() => {
  vehicleService.disconnect();
  isConnected.value = false;
});
</script>
