<template>
  <div class="kemet-shell flex h-screen overflow-hidden text-gray-900 dark:text-white relative" style="position: relative;">
    <!-- Animated Background -->
    <AnimatedBackground />
    
    <!-- Mobile Menu Overlay -->
    <div
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
    ></div>
    
    <!-- SIDEBAR -->
    <aside
      :class="[
        'glass-sidebar w-64 h-full flex flex-col relative overflow-hidden z-10 bg-white dark:bg-gray-900 fixed lg:static inset-y-0 left-0 transform transition-transform duration-300 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Close button for mobile -->
      <button
        @click="sidebarOpen = false"
        class="lg:hidden absolute top-4 right-4 p-2 glass-effect hover:bg-gray-200/50 dark:hover:bg-white/10 rounded-lg transition-all z-20"
      >
        <span class="material-symbols-outlined text-gray-700 dark:text-white text-xl">close</span>
      </button>
      <!-- Animated Background -->
      <div class="absolute inset-0 bg-gradient-mesh opacity-10"></div>
      
      <!-- Glowing Line -->
      <div class="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-kemet-accent/20 to-transparent"></div>
      
      <!-- LOGO -->
      <div class="relative p-4 sm:p-6 flex flex-col items-center gap-3 sm:gap-4">
        <div class="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center shadow-lg border-2 border-gray-200 dark:border-gray-700 relative group overflow-hidden">
          <div class="absolute inset-0 bg-kemet-primary/20 dark:bg-kemet-primary/30 rounded-xl blur-md opacity-60 group-hover:opacity-80 transition-opacity"></div>
          <img 
            :src="logoImage" 
            alt="KemetLink Logo" 
            class="w-full h-full object-contain relative z-10 p-2.5"
            style="filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));"
          />
        </div>
        <div class="text-center">
          <h1 class="text-gray-900 dark:text-white text-base sm:text-lg lg:text-xl font-bold leading-tight drop-shadow-lg transition-colors">KemetLink</h1>
          <p class="text-kemet-primary/70 dark:text-kemet-accent text-[10px] sm:text-xs uppercase tracking-widest font-semibold transition-colors">Super Admin</p>
        </div>
      </div>

      <!-- NAV -->
      <nav class="relative flex-1 px-4 py-6 space-y-2 z-10">
        <RouterLink
          to="/super-admin"
          :class="linkClass('/super-admin')"
          class="group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden glass-effect hover:bg-gray-200/50 dark:hover:bg-white/10"
        >
          <span class="material-symbols-outlined text-xl relative z-10 group-hover:scale-110 transition-transform text-gray-700 dark:text-white">dashboard</span>
          <span class="text-sm font-semibold relative z-10 text-gray-700 dark:text-white">Dashboard</span>
        </RouterLink>

        <RouterLink
          to="/super-admin/admins"
          :class="linkClass('/super-admin/admins')"
          class="group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden glass-effect hover:bg-gray-200/50 dark:hover:bg-white/10"
        >
          <span class="material-symbols-outlined text-xl relative z-10 group-hover:scale-110 transition-transform text-gray-700 dark:text-white">group</span>
          <span class="text-sm font-semibold relative z-10 text-gray-700 dark:text-white">Admins</span>
        </RouterLink>

        <RouterLink
          to="/super-admin/logs"
          :class="linkClass('/super-admin/logs')"
          class="group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden glass-effect hover:bg-gray-200/50 dark:hover:bg-white/10"
        >
          <span class="material-symbols-outlined text-xl relative z-10 group-hover:scale-110 transition-transform text-gray-700 dark:text-white">list_alt</span>
          <span class="text-sm font-semibold relative z-10 text-gray-700 dark:text-white">System Logs</span>
        </RouterLink>
      </nav>

      <!-- USER CARD -->
      <div class="relative p-4 mt-auto z-10 space-y-2">
        <div class="glass-card-primary p-4 rounded-xl relative overflow-hidden">
          <div class="flex items-center gap-3 relative z-10">
            <div class="w-10 h-10 glass-card-primary rounded-full flex items-center justify-center">
              <span class="text-kemet-primary dark:text-white font-bold text-lg">SA</span>
            </div>
            <div class="flex-1">
              <p class="text-sm font-bold text-gray-900 dark:text-white transition-colors">Super Admin</p>
              <p class="text-xs text-kemet-primary/70 dark:text-kemet-accent transition-colors">System Administrator</p>
            </div>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="w-full glass-effect hover:bg-red-500/20 dark:hover:bg-red-500/20 border border-red-500/30 dark:border-red-500/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group"
        >
          <span class="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">logout</span>
          <span>Logout</span>
        </button>
      </div>

      <!-- Bottom Glow -->
      <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-kemet-accent/50 to-transparent"></div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="flex-1 flex flex-col overflow-y-auto relative w-full lg:w-auto" style="z-index: 1;">
      <!-- Mobile Header -->
      <div class="lg:hidden sticky top-0 z-40 flex items-center justify-between p-4 glass-topbar">
        <button
          @click="sidebarOpen = !sidebarOpen"
          class="p-2 glass-effect rounded-lg hover:bg-gray-200/50 dark:hover:bg-white/10 transition-all"
        >
          <span class="material-symbols-outlined text-gray-700 dark:text-white">menu</span>
        </button>
        <h1 class="text-lg font-bold text-gray-900 dark:text-white">KemetLink</h1>
        <div class="w-10"></div>
      </div>
      <div>
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import AnimatedBackground from "../AnimatedBackground.vue";
import logoImage from "../../assets/logo_KemeyLink.png";

const route = useRoute();
const router = useRouter();
const sidebarOpen = ref(false);

function linkClass(path) {
  const isActive = route.path === path || (path !== '/super-admin' && route.path.startsWith(path));
  
  return isActive
    ? "glass-effect-primary text-kemet-primary dark:text-white"
    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white";
}

function handleLogout() {
  // Clear authentication tokens
  localStorage.removeItem("authToken");
  sessionStorage.removeItem("authToken");
  
  // Redirect to login page
  router.push("/login");
}
</script>