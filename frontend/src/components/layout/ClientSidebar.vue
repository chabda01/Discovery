<template>
  <aside class="w-64 h-full bg-dark-bg flex flex-col relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-mesh opacity-20"></div>
    <div class="absolute inset-0 bg-gradient-to-b from-kemet-primary/5 via-transparent to-kemet-secondary/5"></div>

    <div class="relative p-6 flex items-center gap-3">
      <div class="w-12 h-12 bg-gradient-kemet rounded-xl flex items-center justify-center shadow-glow relative group">
        <div class="absolute inset-0 bg-gradient-kemet rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
        <span class="material-symbols-outlined font-bold text-white text-2xl relative z-10">bolt</span>
      </div>
      <div>
        <h1 class="text-white text-xl font-bold leading-tight drop-shadow-lg">VoltaLink</h1>
        <p class="text-kemet-primary-light text-xs uppercase tracking-widest font-semibold">Client</p>
      </div>
    </div>

    <nav class="relative flex-1 px-4 py-6 space-y-2">
      <RouterLink
        :to="{ name: 'ClientDashboard' }"
        :class="linkClass('ClientDashboard', '/client/dashboard')"
        class="group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden"
      >
        <div class="absolute inset-0 bg-gradient-kemet opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <span class="material-symbols-outlined text-xl relative z-10 group-hover:scale-110 transition-transform">dashboard</span>
        <span class="text-sm font-semibold relative z-10">Dashboard</span>
      </RouterLink>

      <RouterLink
        :to="{ name: 'ClientFeatures' }"
        :class="linkClass('/client/features')"
        class="group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden"
      >
        <div class="absolute inset-0 bg-gradient-kemet opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <span class="material-symbols-outlined text-xl relative z-10 group-hover:scale-110 transition-transform">auto_awesome</span>
        <span class="text-sm font-semibold relative z-10">Features</span>
      </RouterLink>

      <RouterLink
        :to="{ name: 'ClientUpdates' }"
        :class="linkClass('/client/updates')"
        class="group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden"
      >
        <div class="absolute inset-0 bg-gradient-kemet opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <span class="material-symbols-outlined text-xl relative z-10 group-hover:scale-110 transition-transform">system_update</span>
        <span class="text-sm font-semibold relative z-10">Updates</span>
      </RouterLink>
    </nav>

    <div class="relative p-4 mt-auto">
      <div class="p-4 rounded-xl bg-dark-card/50 backdrop-blur-md shadow-elevation-2 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-kemet-primary/10 to-transparent"></div>
        <div class="flex items-center gap-3 mb-2 relative z-10">
          <div class="w-10 h-10 bg-gradient-kemet rounded-full flex items-center justify-center shadow-glow-sm">
            <span class="text-white font-bold text-lg">CL</span>
          </div>
          <div class="flex-1">
            <p class="text-sm font-bold text-white">Client User</p>
            <p class="text-xs text-kemet-primary-light">Account</p>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from "vue-router";
const route = useRoute();

function linkClass(nameOrPath, fallbackPath = '') {
  const targetIsPath = (typeof nameOrPath === 'string' && nameOrPath.startsWith('/')) || (fallbackPath && fallbackPath.startsWith('/'));
  const pathToCheck = targetIsPath ? (nameOrPath.startsWith('/') ? nameOrPath : fallbackPath) : null;

  let isActive = false;
  if (pathToCheck) {
    isActive = route.path === pathToCheck || route.path.startsWith(pathToCheck + '/');
  } else {
    isActive = route.name === nameOrPath;
  }

  return isActive
    ? "bg-gradient-kemet text-white shadow-glow"
    : "text-slate-400 hover:text-white hover:bg-white/5 hover:shadow-elevation-1";
}
</script>
