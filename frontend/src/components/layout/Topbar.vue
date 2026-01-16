<template>
  <header class="glass-topbar sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
    <div class="flex items-center gap-2 sm:gap-4">
      <slot name="left"></slot>
      <h2 class="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-kemet-primary dark:from-white dark:to-kemet-primary/80 bg-clip-text text-transparent transition-colors">
        {{ title }}
      </h2>
      <div
        v-if="subtitle"
        class="hidden md:flex items-center gap-2 px-3 py-1 glass-effect-primary rounded-full"
      >
        <span class="material-symbols-outlined text-kemet-primary dark:text-white text-sm"
          >info</span
        >
        <span class="text-xs text-kemet-primary/80 dark:text-white/80 font-medium"
          >{{ subtitle }}</span
        >
      </div>
    </div>

    <div class="flex items-center gap-4">
      <slot name="right"></slot>

      <!-- Theme Toggle -->
      <ThemeToggle />

      <!-- Notifications -->
      <button class="relative p-2 glass-effect hover:bg-white/10 dark:hover:bg-white/10 rounded-lg transition-all duration-300 group">
        <span
          class="material-symbols-outlined text-white/70 dark:text-white/70 text-gray-700 dark:group-hover:text-white group-hover:text-gray-900 transition-colors"
          >notifications</span
        >
        <span class="absolute top-1 right-1 w-2 h-2 bg-kemet-primary rounded-full animate-pulse"></span>
      </button>

      <!-- Settings -->
      <button class="p-2 glass-effect hover:bg-white/10 dark:hover:bg-white/10 rounded-lg transition-all duration-300 group">
        <span
          class="material-symbols-outlined text-white/70 dark:text-white/70 text-gray-700 dark:group-hover:text-white group-hover:text-gray-900 transition-colors"
          >settings</span
        >
      </button>
    </div>
  </header>
</template>

<script setup>
import ThemeToggle from '../ThemeToggle.vue';

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
