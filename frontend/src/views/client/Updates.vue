<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-white">Firmware Updates</h2>
      <div class="flex items-center gap-3">
        <select v-model="selectedVehicleId" class="px-3 py-2 bg-background-dark border border-border-dark rounded-md text-white">
          <option v-if="vehicles.length === 0" disabled>-- Aucun véhicule connecté --</option>
          <option v-for="v in vehicles" :value="v.id" :key="v.id">{{ v.name || v.id }}</option>
        </select>
        <button @click="refresh" class="px-4 py-2 bg-primary text-white rounded-md">Refresh</button>
      </div>
    </div>

    <div class="space-y-4">
      <div v-for="u in updates" :key="u.id" class="p-4 rounded-lg bg-background-dark border border-border-dark flex items-center justify-between">
        <div>
          <h3 class="text-white font-semibold">v{{ u.version }} — {{ u.name }}</h3>
          <p class="text-sm text-slate-400">{{ u.description }}</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm text-white font-bold">{{ u.vehiclesUpdated }} vehicles</span>
          <button @click="installUpdate(u)" :disabled="!selectedVehicleId || installing" class="px-3 py-2 bg-kemet-primary-dark text-white rounded-md disabled:opacity-50">Install</button>
        </div>
      </div>
    </div>

    <div v-if="message" class="mt-4 p-3 rounded-md bg-green-500 text-white">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import fotaService from '../../services/fotaService.js';
import vehicleService from '../../services/vehicleService.js';

const updates = ref([]);
const vehicles = ref([]);
const selectedVehicleId = ref(null);
const message = ref('');
const installing = ref(false);
let unsubscribe = null;

onMounted(() => {
  updates.value = fotaService.getUpdates();
  vehicles.value = vehicleService.getVehicles();

  unsubscribe = vehicleService.subscribe(arr => {
    vehicles.value = arr;
    if (!selectedVehicleId.value && arr.length) selectedVehicleId.value = arr[0].id;
  });
});

onBeforeUnmount(() => {
  if (unsubscribe) unsubscribe();
});

function refresh() {
  updates.value = fotaService.getUpdates();
  vehicles.value = vehicleService.getVehicles();
}

function installUpdate(u) {
  if (!selectedVehicleId.value) {
    message.value = 'Sélectionne d\'abord un véhicule';
    setTimeout(() => (message.value = ''), 3000);
    return;
  }

  const started = vehicleService.startUpdate(selectedVehicleId.value);
  if (started) {
    message.value = `Update ${u.version} started on ${selectedVehicleId.value}`;
    installing.value = true;

    // simulate success
    setTimeout(() => {
      u.vehiclesUpdated = (u.vehiclesUpdated || 0) + 1;
      message.value = `Update ${u.version} successfully installed on ${selectedVehicleId.value}`;
      installing.value = false;
      setTimeout(() => (message.value = ''), 3000);
    }, 1500);
  } else {
    message.value = 'Pas de connexion au serveur';
    setTimeout(() => (message.value = ''), 3000);
  }
}
</script>
