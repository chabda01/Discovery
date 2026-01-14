<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-white">Features</h2>
      <div class="flex items-center gap-3">
        <select v-model="selectedVehicleId" class="px-3 py-2 bg-background-dark border border-border-dark rounded-md text-white">
          <option v-if="vehicles.length === 0" disabled>-- Aucun véhicule connecté --</option>
          <option v-for="v in vehicles" :value="v.id" :key="v.id">{{ v.name || v.id }}</option>
        </select>
        <button @click="refresh" class="px-4 py-2 bg-primary text-white rounded-md">Refresh</button>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-4">
      <div v-for="feature in features" :key="feature.id" class="p-4 rounded-lg bg-background-dark border border-border-dark flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <span class="material-symbols-outlined text-primary">{{ feature.icon }}</span>
          </div>
          <div>
            <h3 class="text-white font-semibold">{{ feature.name }}</h3>
            <p class="text-sm text-slate-400">{{ feature.description }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm text-white font-bold">{{ formatCurrency(feature.price) }}</span>
          <button
            @click="buyFeature(feature)"
            :disabled="!selectedVehicleId || buying || hasFeature(selectedVehicleId, feature.id)"
            class="px-3 py-2 bg-kemet-primary-dark text-white rounded-md disabled:opacity-50"
          >
            <span v-if="hasFeature(selectedVehicleId, feature.id)" class="text-xs">Activated</span>
            <span v-else>Buy</span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="message" class="mt-4 p-3 rounded-md bg-green-500 text-white">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import featureService from '../../services/featureService.js';
import vehicleService from '../../services/vehicleService.js';

const features = ref([]);
const vehicles = ref([]);
const selectedVehicleId = ref(null);
const message = ref('');
const buying = ref(false);
let unsubscribe = null;

onMounted(() => {
  vehicles.value = vehicleService.getVehicles();
  features.value = featureService.getFeatures();
  unsubscribe = vehicleService.subscribe(arr => {
    vehicles.value = arr;
    if (!selectedVehicleId.value && arr.length) selectedVehicleId.value = arr[0].id;
  });
});

onBeforeUnmount(() => {
  if (unsubscribe) unsubscribe();
});

function formatCurrency(amount) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(amount);
}

async function buyFeature(feature) {
  if (!selectedVehicleId.value) {
    message.value = 'Sélectionne d\'abord un véhicule';
    setTimeout(() => (message.value = ''), 3000);
    return;
  }

  buying.value = true;
  try {
    const activation = await featureService.activateFeature(selectedVehicleId.value, feature.id, 'card');
    message.value = `Activation pending (${activation.id})`;

    setTimeout(() => {
      featureService.confirmActivation(activation.id);
      message.value = `Feature "${feature.name}" activée sur ${selectedVehicleId.value}`;
      buying.value = false;
    }, 800);
  } catch (e) {
    message.value = e.message;
    buying.value = false;
  }

  setTimeout(() => (message.value = ''), 4000);
}

function hasFeature(vehicleId, featureId) {
  if (!vehicleId) return false;
  return featureService.hasFeature(vehicleId, featureId);
}

function refresh() {
  features.value = featureService.getFeatures();
  vehicles.value = vehicleService.getVehicles();
}
</script>
