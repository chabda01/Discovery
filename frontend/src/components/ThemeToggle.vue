<template>
  <button 
    @click="toggleTheme"
    class="relative p-2 glass-effect hover:bg-gray-200/50 dark:hover:bg-white/10 rounded-lg transition-all duration-300 group"
    :title="currentTheme === 'dark' ? 'Passer au thème clair' : 'Passer au thème sombre'"
  >
    <span
      v-if="currentTheme === 'dark'"
      class="material-symbols-outlined text-gray-700 dark:text-white/70 group-hover:text-gray-900 dark:group-hover:text-white transition-colors"
      >light_mode</span
    >
    <span
      v-else
      class="material-symbols-outlined text-gray-700 dark:text-white/70 group-hover:text-gray-900 dark:group-hover:text-white transition-colors"
      >dark_mode</span
    >
  </button>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import themeService from '../services/themeService.js';

const currentTheme = ref(themeService.getTheme());
let unsubscribe = null;

onMounted(() => {
  unsubscribe = themeService.subscribe((theme) => {
    currentTheme.value = theme;
  });
});

onBeforeUnmount(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});

const toggleTheme = () => {
  themeService.toggleTheme();
};
</script>
