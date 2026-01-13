<template>
  <div class="bg-background-light dark:bg-background-dark min-h-screen text-slate-900 dark:text-white">

    <!-- TOP BAR -->
    <header class="sticky top-0 z-50 glass-panel border-b border-white/5 px-6 py-4">
      <div class="max-w-[1200px] mx-auto flex justify-between items-center">
        <h2 class="text-xl font-bold">VoltaLink</h2>
        <button class="material-symbols-outlined text-slate-400">settings</button>
      </div>
    </header>

    <!-- MAIN -->
    <main class="max-w-[1200px] mx-auto px-6 py-8 space-y-10">

      <!-- HEADER -->
      <div>
        <h1 class="text-5xl font-black">My Moto 001</h1>
        <p class="text-slate-400 text-sm mt-2">Last synced: 2 minutes ago</p>
      </div>

      <!-- HERO -->
      <div class="rounded-3xl bg-surface-dark aspect-video flex items-center justify-center">
        <p class="text-slate-500">Vehicle Visual</p>
      </div>

      <!-- STATS -->
      <div class="grid md:grid-cols-3 gap-4">
        <div class="p-6 bg-surface-dark rounded-2xl">
          <p class="text-slate-400">Battery</p>
          <p class="text-4xl font-bold">82%</p>
        </div>
        <div class="p-6 bg-surface-dark rounded-2xl">
          <p class="text-slate-400">Range</p>
          <p class="text-4xl font-bold">320 km</p>
        </div>
        <div class="p-6 bg-surface-dark rounded-2xl">
          <p class="text-slate-400">Status</p>
          <p class="text-4xl font-bold">Connected</p>
        </div>
      </div>

      <!-- ACTIONS -->
      <div class="grid md:grid-cols-2 gap-4">
        <button class="bg-primary text-black p-5 rounded-2xl font-bold">
          Locate Vehicle
        </button>
        <button class="bg-surface-dark p-5 rounded-2xl">
          View Stats
        </button>
      </div>

    </main>

  </div>
</template>

<script>
export default {
  name: 'MotoDashboard'
}
</script>

<style scoped>
.glass-panel {
  background: rgba(28, 28, 33, 0.8);
  backdrop-filter: blur(12px);
}
</style>
