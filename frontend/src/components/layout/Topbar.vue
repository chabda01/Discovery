<template>
  <header class="sticky top-0 z-40 flex items-center justify-between px-8 py-4 bg-dark-card/80 backdrop-blur-xl border-b border-dark-border">
    <div class="flex items-center gap-4">
      <h2 class="text-2xl font-bold bg-gradient-to-r from-white to-kemet-primary-light bg-clip-text text-transparent">
        {{ title }}
      </h2>
      <div
        v-if="subtitle"
        class="hidden md:flex items-center gap-2 px-3 py-1 bg-kemet-primary/10 rounded-full border border-kemet-primary/20"
      >
        <span class="material-symbols-outlined text-kemet-primary text-sm"
          >info</span
        >
        <span class="text-xs text-kemet-primary-light font-medium"
          >{{ subtitle }}</span
        >
      </div>
    </div>

    <div class="flex items-center gap-4">
      <slot name="right"></slot>

      <!-- Notifications -->
      <button class="relative p-2 hover:bg-dark-hover rounded-lg transition-colors group">
        <span
          class="material-symbols-outlined text-slate-400 group-hover:text-kemet-primary transition-colors"
          >notifications</span
        >
        <span class="absolute top-1 right-1 w-2 h-2 bg-kemet-accent rounded-full animate-pulse"></span>
      </button>

      <!-- Settings -->
      <button class="p-2 hover:bg-dark-hover rounded-lg transition-colors group">
        <span
          class="material-symbols-outlined text-slate-400 group-hover:text-kemet-primary transition-colors"
          >settings</span
        >
      </button>
    </div>
  </header>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: "",
  },
});
</script>
