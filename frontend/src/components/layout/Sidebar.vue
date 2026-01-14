<template>
  <aside class="w-64 h-full bg-dark-bg flex flex-col relative overflow-hidden">
    <!-- Animated Background Mesh -->
    <div class="absolute inset-0 bg-gradient-mesh opacity-30"></div>
    <div class="absolute inset-0 bg-gradient-to-b from-kemet-primary/5 via-transparent to-kemet-secondary/5"></div>
    
    <!-- Glowing Line -->
    <div class="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-kemet-primary/30 to-transparent"></div>
    
    <!-- LOGO -->
    <div class="relative p-6 flex items-center gap-3">
      <div class="w-12 h-12 bg-gradient-kemet rounded-xl flex items-center justify-center shadow-glow relative group">
        <div class="absolute inset-0 bg-gradient-kemet rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
        <span class="material-symbols-outlined font-bold text-white text-2xl relative z-10">bolt</span>
      </div>
      <div>
        <h1 class="text-white text-xl font-bold leading-tight drop-shadow-lg">VoltaLink</h1>
        <p class="text-kemet-primary-light text-xs uppercase tracking-widest font-semibold">
          Fleet Admin
        </p>
      </div>
    </div>

    <!-- NAV -->
    <nav class="relative flex-1 px-4 py-6 space-y-2">
      <RouterLink
        to="/admin"
        :class="linkClass('/admin')"
        class="group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden"
      >
        <div class="absolute inset-0 bg-gradient-kemet opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <span class="material-symbols-outlined text-xl relative z-10 group-hover:scale-110 transition-transform">dashboard</span>
        <span class="text-sm font-semibold relative z-10">Dashboard</span>
      </RouterLink>

      <RouterLink
        :to="{ name: 'fleet' }"
        :class="linkClass('/admin/fleet')"
        class="group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden"
      >
        <div class="absolute inset-0 bg-gradient-kemet opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <span class="material-symbols-outlined text-xl relative z-10 group-hover:scale-110 transition-transform">local_shipping</span>
        <span class="text-sm font-semibold relative z-10">Fleet</span>
      </RouterLink>

      <RouterLink
        to="/admin/fota"
        :class="linkClass('/admin/fota')"
        class="group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden"
      >
        <div class="absolute inset-0 bg-gradient-kemet opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <span class="material-symbols-outlined text-xl relative z-10 group-hover:scale-110 transition-transform">memory</span>
        <span class="text-sm font-semibold relative z-10">Firmware</span>
      </RouterLink>

      <RouterLink
        to="/admin/features"
        :class="linkClass('/admin/features')"
        class="group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden"
      >
        <div class="absolute inset-0 bg-gradient-kemet opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <span class="material-symbols-outlined text-xl relative z-10 group-hover:scale-110 transition-transform">auto_awesome</span>
        <span class="text-sm font-semibold relative z-10">Features</span>
      </RouterLink>
    </nav>

    <!-- USER CARD -->
    <div class="relative p-4 mt-auto">
      <div class="p-4 rounded-xl bg-dark-card/50 backdrop-blur-md shadow-elevation-2 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-kemet-primary/10 to-transparent"></div>
        <div class="flex items-center gap-3 mb-2 relative z-10">
          <div class="w-10 h-10 bg-gradient-kemet rounded-full flex items-center justify-center shadow-glow-sm">
            <span class="text-white font-bold text-lg">KM</span>
          </div>
          <div class="flex-1">
            <p class="text-sm font-bold text-white">Kwame Mensah</p>
            <p class="text-xs text-kemet-primary-light">Fleet Manager</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Glow -->
    <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-kemet-primary/50 to-transparent"></div>
  </aside>
</template>

<script setup>
import { useRoute } from "vue-router";
const route = useRoute();

function linkClass(path) {
  const isActive = route.path === path || route.path.startsWith(path + '/');

  return isActive
    ? "bg-gradient-kemet text-white shadow-glow"
    : "text-slate-400 hover:text-white hover:bg-white/5 hover:shadow-elevation-1";
}
</script>
