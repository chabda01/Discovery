<template>
  <header
    class="flex items-center justify-between px-8 py-4 border-b border-border-dark glass-effect sticky top-0 z-10"
  >
    <h2 class="text-xl font-bold">{{ title }}</h2>

    <input
      class="bg-card-dark border-border-dark rounded-full px-4 py-2 text-sm text-white"
      placeholder="Search by VIN, Model or ID..."
      v-model="search"
    />
  </header>
</template>

<script setup>
import { ref } from "vue";
defineProps({ title: String });
const search = ref("");
</script>
