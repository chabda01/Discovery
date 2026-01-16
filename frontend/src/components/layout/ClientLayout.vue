<template>
  <div class="kemet-shell flex h-screen overflow-hidden text-gray-900 dark:text-white relative">
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
      <ClientSidebar @close="sidebarOpen = false" />
    </div>

    <!-- MAIN -->
    <main class="flex-1 flex flex-col overflow-y-auto relative z-10 w-full lg:w-auto">
      <!-- Header with Theme Toggle -->
      <div class="sticky top-0 z-40 flex items-center justify-between p-4 sm:p-6 pb-2">
        <button
          @click="sidebarOpen = !sidebarOpen"
          class="lg:hidden p-2 glass-effect rounded-lg hover:bg-gray-200/50 dark:hover:bg-white/10 transition-all"
        >
          <span class="material-symbols-outlined text-gray-700 dark:text-white">menu</span>
        </button>
        <div class="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
      
      <!-- CONTENT -->
      <div class="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 space-y-6 lg:space-y-8">
        <RouterView />
      </div>

      <!-- FOOTER -->
      <Footer />
    </main>

    <!-- Chatbot - visible on all client pages -->
    <Chatbot :vehicle-data="currentVehicleData" :user-data="userData" />
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed } from "vue";
import ClientSidebar from "./ClientSidebar.vue";
import Footer from "./Footer.vue";
import ThemeToggle from "../ThemeToggle.vue";
import AnimatedBackground from "../AnimatedBackground.vue";
import Chatbot from "../Chatbot.vue";
import vehicleService from "../../services/vehicleService.js";
import { WS_URL } from "../../config/env.js";

const vehicles = ref([]);
const sidebarOpen = ref(false);

const currentVehicleData = computed(() => {
  if (vehicles.value && vehicles.value.length > 0) {
    return vehicles.value[0];
  }
  return {
    battery: 50,
    speed: 0,
    charging: false,
    isConnected: true,
    firmwareVersion: '2.0.0',
    temperature: 25
  };
});

const userData = {
  name: 'Client User',
  role: 'client'
};

onMounted(() => {
  vehicleService.connect(WS_URL);
  
  // Get initial vehicles
  vehicles.value = vehicleService.getVehicles();
  
  // Subscribe to vehicle updates
  const unsubscribe = vehicleService.subscribe((updatedVehicles) => {
    vehicles.value = updatedVehicles;
  });
  
  // Store unsubscribe function for cleanup if needed
  // Note: vehicleService.disconnect() will handle cleanup
});

onBeforeUnmount(() => {
  vehicleService.disconnect();
});
</script>
