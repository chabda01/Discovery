<template>
  <div
    class="kemet-shell flex h-screen overflow-hidden text-gray-900 dark:text-white relative"
  >
    <!-- Animated Background -->
    <AnimatedBackground />
    
    <!-- Mobile Menu Overlay -->
    <div
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
    ></div>
    
    <!-- SIDEBAR -->
    <div
      :class="[
        'fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <Sidebar @close="sidebarOpen = false" />
    </div>

    <!-- MAIN -->
    <main class="flex-1 flex flex-col overflow-y-auto relative z-10 w-full lg:w-auto">
      <!-- TOP BAR -->
      <Topbar :title="pageTitle">
        <template #left>
          <button
            @click="sidebarOpen = !sidebarOpen"
            class="lg:hidden p-2 glass-effect rounded-lg hover:bg-gray-200/50 dark:hover:bg-white/10 transition-all"
          >
            <span class="material-symbols-outlined text-gray-700 dark:text-white">menu</span>
          </button>
        </template>
        <template #right>
          <div class="flex items-center gap-2 glass-effect px-3 py-1.5 rounded-lg">
            <div
              :class="[
                'w-2 h-2 rounded-full',
                isConnected ? 'bg-green-500' : 'bg-red-500',
              ]"
            ></div>
            <span class="text-sm text-gray-700 dark:text-white/70 transition-colors hidden sm:inline">{{
              isConnected ? "Connected" : "Disconnected"
            }}</span>
          </div>
        </template>
      </Topbar>

      <!-- CONTENT -->
      <div class="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
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
import AnimatedBackground from "../AnimatedBackground.vue";

import vehicleService from "../../services/vehicleService.js";
import { WS_URL } from "../../config/env.js";

const route = useRoute();
const isConnected = ref(false);
const sidebarOpen = ref(false);

const pageTitle = computed(() => {
  if (route.name === "dashboard") return "System Overview";
  if (route.name === "fleet") return "Fleet Inventory";
  if (route.name === "fota") return "FOTA Control Center";
  if (route.name === "features") return "Features Catalog";
  return "KemetLink";
});

// Connexion WS globale (1 seule fois)
vehicleService.connect(WS_URL);
isConnected.value = true;

// si tu veux vraiment fermer quand l’app se démonte :
onBeforeUnmount(() => {
  vehicleService.disconnect();
  isConnected.value = false;
});
</script>
