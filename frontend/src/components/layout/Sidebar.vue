<template>
  <aside
    class="w-64 h-full border-r border-charcoal-light bg-background-dark flex flex-col"
  >
    <!-- LOGO -->
    <div class="p-6 flex items-center gap-3">
      <div
        class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white"
      >
        <span class="material-symbols-outlined font-bold">bolt</span>
      </div>
      <div>
        <h1 class="text-white text-lg font-bold leading-tight">VoltaLink</h1>
        <p class="text-slate-500 text-xs uppercase tracking-widest">
          Fleet Admin
        </p>
      </div>
    </div>

    <!-- NAV -->
    <nav class="flex-1 px-4 py-4 space-y-2">
      <RouterLink
        to="/admin"
        :class="linkClass('/')"
        class="w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left"
      >
        <span class="material-symbols-outlined text-lg">dashboard</span>
        <span class="text-sm font-semibold">Dashboard</span>
      </RouterLink>

      <RouterLink
        :to="{ name: 'fleet' }"
        :class="linkClass('/fleet')"
        class="w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left"
      >
        <span class="material-symbols-outlined text-lg">local_shipping</span>
        <span class="text-sm font-medium">Fleet</span>
      </RouterLink>

      <RouterLink
        :to="{ name: 'fota' }"
        :class="linkClass('/admin/fota')"
        class="w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left"
      >
        <span class="material-symbols-outlined text-lg">memory</span>
        <span class="text-sm font-medium">Firmware</span>
      </RouterLink>

      <RouterLink
        to="/features"
        :class="linkClass('/features')"
        class="w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left"
      >
        <span class="material-symbols-outlined text-lg">auto_awesome</span>
        <span class="text-sm font-medium">Features</span>
      </RouterLink>
    </nav>

    <!-- USER CARD -->
    <div class="p-4 mt-auto">
      <div
        class="p-4 rounded-xl bg-charcoal-medium border border-charcoal-light"
      >
        <p class="text-sm font-bold text-white">Kwame Mensah</p>
        <p class="text-xs text-slate-400">Fleet Manager</p>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from "vue-router";
const route = useRoute();

function linkClass(path) {
  const active = route.path === path;

  return active
    ? "bg-primary/10 text-premium-gray border-primary/30"
    : "text-slate-400 border-transparent hover:text-white hover:bg-white/5";
}
</script>
