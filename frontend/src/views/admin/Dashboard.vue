<template>
  <div class="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">

    <!-- SIDEBAR -->
    <aside class="w-64 border-r border-border-dark bg-background-dark flex-col hidden lg:flex">
      <div class="p-6 flex items-center gap-3">
        <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-background-dark">
          <span class="material-symbols-outlined font-bold">bolt</span>
        </div>
        <div>
          <h1 class="text-white text-lg font-bold">VoltaLink</h1>
          <p class="text-slate-500 text-xs uppercase tracking-widest">Admin</p>
        </div>
      </div>

      <nav class="flex-1 px-4 py-4 space-y-2">
        <div class="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary">
          <span class="material-symbols-outlined">dashboard</span>
          <p class="text-sm font-bold">Dashboard</p>
        </div>
      </nav>
    </aside>

    <!-- MAIN -->
    <main class="flex-1 flex flex-col overflow-y-auto">

      <!-- TOP BAR -->
      <header class="flex items-center justify-between px-8 py-4 border-b border-border-dark sticky top-0 bg-card-dark">
        <h2 class="text-xl font-bold">System Overview</h2>
      </header>

      <!-- CONTENT -->
      <div class="p-8 space-y-8">

        <!-- STATS -->
        <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="bg-card-dark p-6 rounded-2xl border border-border-dark"
          >
            <p class="text-slate-400 text-sm">{{ stat.label }}</p>
            <p class="text-3xl font-bold text-white">{{ stat.value }}</p>
          </div>
        </section>

        <!-- MAP PLACEHOLDER -->
        <div class="bg-card-dark rounded-2xl border border-border-dark p-6 min-h-[400px] flex items-center justify-center">
          <p class="text-slate-500">Live Map (à intégrer plus tard)</p>
        </div>

      </div>

      <!-- FOOTER -->
      <footer class="mt-auto p-6 text-xs text-slate-500 border-t border-border-dark">
        © 2024 VoltaLink Electric
      </footer>

    </main>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',

  data() {
    return {
      stats: [
        { label: 'Total Vehicles', value: 15 },
        { label: 'Online', value: 12 },
        { label: 'Updates', value: 2 },
        { label: 'Alerts', value: 1 }
      ]
    }
  }
}
</script>

<style scoped>
</style>
