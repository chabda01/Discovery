<template>
  <div class="bg-background-light dark:bg-background-dark min-h-screen text-slate-900 dark:text-white">
    <main class="max-w-[900px] mx-auto px-6 py-8 space-y-6">

      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold">Vehicle Details</h1>
          <p class="text-slate-400 text-sm mt-1">Seules les informations du véhicule sélectionné sont affichées.</p>
        </div>

        <div class="flex items-center gap-3">
          <select v-model="selectedVehicleId" class="px-3 py-2 bg-background-dark border border-border-dark rounded-md text-white">
            <option v-if="vehicles.length === 0" disabled>-- Aucun véhicule connecté --</option>
            <option v-for="v in vehicles" :value="v.id" :key="v.id">{{ v.name || ('Véhicule ' + v.id) }}</option>
          </select>
          <button @click="refresh" class="px-3 py-2 bg-primary text-white rounded-md">Refresh</button>
        </div>
      </div>

      <div v-if="!selectedVehicle" class="p-6 bg-card-dark rounded-2xl border border-border-dark text-center">
        <p class="text-slate-400">Sélectionne un véhicule pour afficher ses informations.</p>
      </div>

      <div v-else class="grid md:grid-cols-2 gap-6">
        <!-- Left: Map -->
        <div>
          <div class="p-4 bg-card-dark rounded-2xl border border-border-dark mb-4">
            <h2 class="text-lg font-semibold text-white">{{ selectedVehicle.name || ('Véhicule ' + selectedVehicle.id) }}</h2>
            <p class="text-slate-400 text-sm">Dernière mise à jour : {{ formatTime(selectedVehicle.lastUpdate) }}</p>
          </div>

          <div id="map" class="h-72 rounded-2xl overflow-hidden border border-border-dark"></div>

          <div class="mt-3 p-3 bg-background-dark rounded-lg border border-border-dark text-sm text-slate-300">
            <div>Position: <strong class="text-white">{{ coords }}</strong></div>
            <div>Adresse: <span class="text-slate-400">—</span> <!-- placeholder for future reverse geocoding --></div>
          </div>
        </div>

        <!-- Right: Stats -->
        <div class="space-y-4">
          <div class="p-6 bg-card-dark rounded-2xl border border-border-dark">
            <p class="text-slate-400">Battery</p>
            <div class="flex items-center justify-between mt-3">
              <div>
                <p class="text-4xl font-bold text-white">{{ selectedVehicle.battery_level }}%</p>
                <p class="text-sm text-slate-400 mt-1">Est. range: {{ estimatedRange }} km</p>
              </div>
              <div class="w-20 h-20 bg-gradient-kemet rounded-full flex items-center justify-center shadow-glow">
                <span class="text-white font-bold">{{ batteryIcon }}</span>
              </div>
            </div>
          </div>

          <div class="p-6 bg-card-dark rounded-2xl border border-border-dark">
            <p class="text-slate-400">Stats</p>
            <div class="grid grid-cols-2 gap-3 mt-3">
              <div class="p-3 bg-background-dark rounded-lg text-white">
                <p class="text-xs text-slate-400">Speed</p>
                <p class="text-lg font-bold">{{ selectedVehicle.speed || 0 }} km/h</p>
              </div>
              <div class="p-3 bg-background-dark rounded-lg text-white">
                <p class="text-xs text-slate-400">Status</p>
                <p class="text-lg font-bold">{{ selectedVehicle.is_updating ? 'Updating' : 'Idle' }}</p>
              </div>
              <div class="p-3 bg-background-dark rounded-lg text-white">
                <p class="text-xs text-slate-400">Firmware</p>
                <p class="text-lg font-bold">{{ selectedVehicle.current_firmware_version || '—' }}</p>
              </div>
              <div class="p-3 bg-background-dark rounded-lg text-white">
                <p class="text-xs text-slate-400">Last seen</p>
                <p class="text-lg font-bold">{{ timeAgo(selectedVehicle.lastUpdate) }}</p>
              </div>
            </div>

            <div class="flex gap-3 mt-4">
              <button @click="locateOnMap" class="px-4 py-2 bg-primary text-white rounded-md">Locate</button>
              <button @click="copyCoords" class="px-4 py-2 bg-background-dark text-white rounded-md">Copy coords</button>
            </div>

            <div v-if="message" class="mt-3 p-2 rounded-md bg-green-500 text-white">{{ message }}</div>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import vehicleService from '../../services/vehicleService.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const vehicles = ref([]);
const selectedVehicleId = ref(null);
const selectedVehicle = ref(null);
const message = ref('');
let unsubscribe = null;
let map = null;
let marker = null;

function formatTime(t) {
  if (!t) return '—';
  const d = new Date(t);
  return d.toLocaleString();
}

function timeAgo(t) {
  if (!t) return '—';
  const diff = Date.now() - new Date(t).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s`; 
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  return `${h}h`;
}

function updateFromVehicles(arr) {
  // Normalize vehicle objects
  vehicles.value = arr.map(v => ({
    id: v.id || v.vehicle_id || v.vehicleId,
    name: v.name,
    battery_level: v.battery_level ?? v.battery ?? v.batteryLevel ?? 0,
    location: v.location || v.coords || { lat: 0, lng: 0 },
    speed: v.speed ?? 0,
    lastUpdate: v.lastUpdate || v.timestamp || new Date().toISOString(),
    is_updating: v.is_updating ?? v.isUpdating ?? false,
    current_firmware_version: v.current_firmware_version || v.firmwareVersion || null
  }));

  if (!selectedVehicleId.value && vehicles.value.length) selectedVehicleId.value = vehicles.value[0].id;
}

onMounted(() => {
  vehicleService.connect();
  vehicles.value = vehicleService.getVehicles();
  updateFromVehicles(vehicles.value);

  unsubscribe = vehicleService.subscribe(arr => {
    updateFromVehicles(arr);
  });

  // init map
  map = L.map('map', { zoomControl: false, attributionControl: false }).setView([6.37, 2.39], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
  }).addTo(map);
});

onBeforeUnmount(() => {
  if (unsubscribe) unsubscribe();
  if (map) map.remove();
  vehicleService.disconnect();
});

watch([selectedVehicleId, vehicles], () => {
  const v = vehicles.value.find(x => x.id === selectedVehicleId.value);
  selectedVehicle.value = v || null;

  if (selectedVehicle.value && selectedVehicle.value.location) {
    const lat = selectedVehicle.value.location.lat || selectedVehicle.value.location.latitude || selectedVehicle.value.location[0];
    const lng = selectedVehicle.value.location.lng || selectedVehicle.value.location.longitude || selectedVehicle.value.location[1];

    if (marker) {
      marker.setLatLng([lat, lng]);
    } else {
      marker = L.marker([lat, lng]).addTo(map);
    }
    map.setView([lat, lng], 15);
  }
});

function refresh() {
  vehicles.value = vehicleService.getVehicles();
  updateFromVehicles(vehicles.value);
}

function locateOnMap() {
  if (!selectedVehicle.value || !selectedVehicle.value.location) return;
  const lat = selectedVehicle.value.location.lat;
  const lng = selectedVehicle.value.location.lng;
  map.setView([lat, lng], 16);
  if (marker) marker.openPopup();
}

function copyCoords() {
  if (!selectedVehicle.value || !selectedVehicle.value.location) return;
  const text = `${selectedVehicle.value.location.lat}, ${selectedVehicle.value.location.lng}`;
  navigator.clipboard?.writeText(text);
  message.value = 'Coords copied';
  setTimeout(() => (message.value = ''), 2000);
}

const coords = computed(() => {
  if (!selectedVehicle.value || !selectedVehicle.value.location) return '—';
  return `${selectedVehicle.value.location.lat.toFixed(5)}, ${selectedVehicle.value.location.lng.toFixed(5)}`;
});

const estimatedRange = computed(() => {
  if (!selectedVehicle.value) return '—';
  // approx 3.5 km per % battery
  return Math.round((selectedVehicle.value.battery_level || 0) * 3.5);
});

const batteryIcon = computed(() => {
  const v = selectedVehicle.value?.battery_level ?? 0;
  if (v > 75) return '🟢';
  if (v > 50) return '🟡';
  if (v > 25) return '🟠';
  return '🔴';
});
</script>

<style scoped>
#map {
  width: 100%;
}
</style>
