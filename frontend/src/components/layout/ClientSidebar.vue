<template>
  <aside
    class="glass-sidebar w-64 h-full flex flex-col relative overflow-hidden z-10 bg-white dark:bg-gray-900"
  >
    <!-- Close button for mobile -->
    <button
      @click="$emit('close')"
      class="lg:hidden absolute top-4 right-4 p-2 glass-effect hover:bg-gray-200/50 dark:hover:bg-white/10 rounded-lg transition-all z-20"
    >
      <span class="material-symbols-outlined text-gray-700 dark:text-white text-xl">close</span>
    </button>
    <!-- Background Pattern -->
    <div class="absolute inset-0 bg-gradient-mesh opacity-20"></div>
    
    <!-- Glowing Line -->
    <div class="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-kemet-primary/40 to-transparent"></div>
    
    <!-- LOGO -->
    <div class="relative p-4 sm:p-6 flex flex-col items-center gap-3 sm:gap-4 z-10">
      <div class="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center overflow-hidden shadow-lg border-2 border-gray-200 dark:border-gray-700 relative group">
        <div class="absolute inset-0 bg-kemet-primary/20 dark:bg-kemet-primary/30 rounded-xl blur-md opacity-60 group-hover:opacity-80 transition-opacity"></div>
        <img 
          :src="logoImage" 
          alt="KemetLink Logo" 
          class="w-full h-full object-contain p-2.5 relative z-10"
          style="filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));"
        />
      </div>
      <div class="text-center">
        <h1 class="text-gray-900 dark:text-white font-bold text-base sm:text-lg transition-colors">KemetLink</h1>
        <p class="text-[10px] sm:text-xs uppercase tracking-widest text-gray-600 dark:text-white/60 transition-colors">
          Client Portal
        </p>
      </div>
    </div>

    <!-- NAV -->
    <nav class="relative flex-1 px-4 py-6 space-y-2 z-10">
      <RouterLink to="/client/dashboard" :class="linkClass('/client')" class="nav-item glass-effect hover:bg-gray-200/50 dark:hover:bg-white/10">
        <span class="material-symbols-outlined text-gray-700 dark:text-white">dashboard</span>
        <span class="text-gray-700 dark:text-white">My Vehicle</span>
      </RouterLink>

      <RouterLink
        to="/client/features"
        :class="linkClass('/client/features')"
        class="nav-item glass-effect hover:bg-gray-200/50 dark:hover:bg-white/10"
      >
        <span class="material-symbols-outlined text-gray-700 dark:text-white">auto_awesome</span>
        <span class="text-gray-700 dark:text-white">Features</span>
      </RouterLink>

      <RouterLink
        to="/client/updates"
        :class="linkClass('/client/updates')"
        class="nav-item glass-effect hover:bg-gray-200/50 dark:hover:bg-white/10"
      >
        <span class="material-symbols-outlined text-gray-700 dark:text-white">system_update</span>
        <span class="text-gray-700 dark:text-white">Updates</span>
      </RouterLink>
    </nav>

    <!-- USER -->
    <div class="relative p-4 mt-auto z-10 space-y-2">
      <div class="glass-card-primary p-4 rounded-xl">
        <p class="text-sm font-semibold text-gray-900 dark:text-white transition-colors">User Client</p>
        <p class="text-xs text-gray-600 dark:text-white/60 transition-colors">Vehicle Owner</p>
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
    <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-kemet-primary/50 to-transparent"></div>
  </aside>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import logoImage from "../../assets/logo_KemeyLink.png";

defineEmits(['close']);

const route = useRoute();
const router = useRouter();

function linkClass(path) {
  let active;
  
  // For dashboard, match exact path or /client/dashboard
  if (path === '/client') {
    active = route.path === '/client' || route.path === '/client/dashboard';
  } else {
    // For other routes, match path or sub-paths
    active = route.path === path || route.path.startsWith(path + "/");
  }

  return active
    ? "glass-effect-primary text-kemet-primary dark:text-white font-semibold"
    : "text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white";
}

function handleLogout() {
  // Clear authentication tokens
  localStorage.removeItem("authToken");
  sessionStorage.removeItem("authToken");
  
  // Redirect to login page
  router.push("/login");
}
</script>

<style scoped>
.nav-item {
  @apply flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300;
}
.nav-item span {
  @apply text-lg;
}
</style>
