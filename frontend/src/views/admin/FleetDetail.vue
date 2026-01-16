<template>
  <div class="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
    <main class="flex-1 flex flex-col overflow-y-auto">
      <!-- TOP BAR -->
      <header class="flex items-center justify-between px-8 py-4 border-b border-border-dark sticky top-0 bg-card-dark">
        <div class="flex items-center gap-4">
          <button
            @click="$router.back()"
            class="p-2 hover:bg-background-dark rounded-lg transition-colors"
          >
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 class="text-xl font-bold">{{ vehicle ? vehicle.name : 'Vehicle Details' }}</h2>
        </div>
      </header>

      <!-- CONTENT -->
      <div v-if="vehicle" class="p-8 space-y-8">
        <!-- Vehicle Header -->
        <section class="bg-card-dark rounded-2xl border border-border-dark p-6">
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white transition-colors mb-2">{{ vehicle.name }}</h1>
              <p class="text-gray-600 dark:text-slate-400 transition-colors">ID: {{ vehicle.id }} • {{ vehicle.country }}</p>
            </div>
            <div class="flex gap-2">
              <span
                :class="[
                  'px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2',
                  vehicle.isConnected ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                ]"
              >
                <span class="material-symbols-outlined text-lg">
                  {{ vehicle.isConnected ? 'wifi' : 'wifi_off' }}
                </span>
                {{ vehicle.isConnected ? 'Connected' : 'Disconnected' }}
              </span>
              <span
                :class="[
                  'px-4 py-2 rounded-full text-sm font-medium',
                  getStatusBadgeClass(vehicle)
                ]"
              >
                {{ getVehicleStatus(vehicle) }}
              </span>
            </div>
          </div>
        </section>

        <!-- Main Info Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Battery Info -->
          <section class="bg-card-dark rounded-2xl border border-border-dark p-6">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white transition-colors mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined">battery_charging_full</span>
              Battery Status
            </h3>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between items-center mb-3">
                  <span class="text-gray-600 dark:text-slate-400 transition-colors">Current Level</span>
                  <span :class="['text-2xl font-bold', getBatteryColorClass(vehicle.battery)]">
                    {{ vehicle.battery }}%
                  </span>
                </div>
                <div class="w-full bg-background-dark rounded-full h-4">
                  <div
                    :class="['h-4 rounded-full transition-all', getBatteryBarClass(vehicle.battery)]"
                    :style="{ width: vehicle.battery + '%' }"
                  ></div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4 pt-4">
                <div class="text-center p-4 bg-background-dark rounded-lg">
                  <p class="text-xs text-slate-400 mb-1">Charging</p>
                  <p class="text-lg font-bold" :class="vehicle.charging ? 'text-blue-500' : 'text-slate-500'">
                    {{ vehicle.charging ? 'Yes' : 'No' }}
                  </p>
                </div>
                <div class="text-center p-4 bg-background-dark rounded-lg">
                  <p class="text-xs text-slate-400 mb-1">Range</p>
                  <p class="text-lg font-bold text-gray-900 dark:text-white transition-colors">
                    {{ Math.round(vehicle.battery * 4) }} km
                  </p>
                </div>
              </div>
            </div>
          </section>

          <!-- Connectivity & Performance -->
          <section class="bg-card-dark rounded-2xl border border-border-dark p-6">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white transition-colors mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined">speed</span>
              Performance & Connectivity
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 bg-background-dark rounded-lg">
                <div class="flex items-center gap-2 mb-2">
                  <span :class="['material-symbols-outlined', vehicle.isConnected ? 'text-green-500' : 'text-red-500']">
                    {{ vehicle.isConnected ? 'wifi' : 'wifi_off' }}
                  </span>
                  <p class="text-xs text-gray-600 dark:text-slate-400 transition-colors">Internet</p>
                </div>
                <p :class="['text-xl font-bold', vehicle.isConnected ? 'text-green-500' : 'text-red-500']">
                  {{ vehicle.isConnected ? 'Connected' : 'Offline' }}
                </p>
              </div>
              <div class="p-4 bg-background-dark rounded-lg">
                <p class="text-xs text-slate-400 mb-1">Firmware</p>
                <p class="text-xl font-bold text-gray-900 dark:text-white transition-colors font-mono">v{{ vehicle.firmwareVersion }}</p>
              </div>
              <div class="p-4 bg-background-dark rounded-lg">
                <p class="text-xs text-slate-400 mb-1">Current Speed</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white transition-colors">{{ vehicle.speed }} <span class="text-sm text-gray-600 dark:text-slate-400 transition-colors">km/h</span></p>
              </div>
              <div class="p-4 bg-background-dark rounded-lg">
                <p class="text-xs text-slate-400 mb-1">Max Speed</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white transition-colors">200 <span class="text-sm text-gray-600 dark:text-slate-400 transition-colors">km/h</span></p>
              </div>
              <div class="p-4 bg-background-dark rounded-lg">
                <p class="text-xs text-slate-400 mb-1">Odometer</p>
                <p class="text-xl font-bold text-gray-900 dark:text-white transition-colors">{{ Math.floor(Math.random() * 50000) }} <span class="text-sm text-gray-600 dark:text-slate-400 transition-colors">km</span></p>
              </div>
              <div class="p-4 bg-background-dark rounded-lg">
                <p class="text-xs text-slate-400 mb-1">Efficiency</p>
                <p class="text-xl font-bold text-green-500">18.5 <span class="text-sm text-gray-600 dark:text-slate-400 transition-colors">kWh/100km</span></p>
              </div>
            </div>
          </section>
        </div>

        <!-- Location Map -->
        <section class="bg-card-dark rounded-2xl border border-border-dark p-6">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white transition-colors mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined">location_on</span>
            Current Location
          </h3>
          <div class="h-[400px]">
            <LiveMap :vehicles="[vehicle]" />
          </div>
          <div class="mt-4 p-4 bg-background-dark rounded-lg">
            <p class="text-sm text-slate-400 mb-1">Coordinates</p>
            <p class="font-mono text-gray-900 dark:text-white transition-colors">{{ vehicle.lat.toFixed(6) }}, {{ vehicle.lng.toFixed(6) }}</p>
          </div>
        </section>

        <!-- Activity Log -->
        <section class="bg-card-dark rounded-2xl border border-border-dark p-6">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white transition-colors mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined">history</span>
            Recent Activity
          </h3>
          <div class="space-y-3">
            <div class="flex items-center gap-4 p-3 bg-background-dark rounded-lg">
              <span class="material-symbols-outlined text-primary">update</span>
              <div class="flex-1">
                <p class="text-gray-900 dark:text-white transition-colors font-medium">Status Update</p>
                <p class="text-sm text-gray-600 dark:text-slate-400 transition-colors">{{ formatTime(vehicle.lastUpdate) }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Loading State -->
      <div v-else class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <span class="material-symbols-outlined text-6xl text-slate-600 animate-pulse mb-4">directions_car</span>
          <p class="text-slate-500">Loading vehicle data...</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import vehicleService from '../../services/vehicleService';
import LiveMap from '../../components/LiveMap.vue';
import { WS_URL } from '../../config/env.js';

export default {
  name: 'FleetDetail',

  components: {
    LiveMap
  },

  data() {
    return {
      vehicle: null,
      unsubscribe: null
    };
  },

  mounted() {
    const vehicleId = parseInt(this.$route.params.id);

    vehicleService.connect(WS_URL);

    this.unsubscribe = vehicleService.subscribe((vehicles) => {
      this.vehicle = vehicles.find(v => v.id === vehicleId);
    });
  },

  beforeUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },

  methods: {
    getVehicleStatus(vehicle) {
      if (vehicle.charging) return 'Charging';
      if (vehicle.speed > 0) return 'Moving';
      return 'Idle';
    },

    getStatusBadgeClass(vehicle) {
      if (vehicle.charging) return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      if (vehicle.speed > 0) return 'bg-green-500/20 text-green-400 border border-green-500/30';
      return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
    },

    getBatteryColorClass(battery) {
      if (battery < 20) return 'text-red-500';
      if (battery < 50) return 'text-yellow-500';
      return 'text-green-500';
    },

    getBatteryBarClass(battery) {
      if (battery < 20) return 'bg-red-500';
      if (battery < 50) return 'bg-yellow-500';
      return 'bg-green-500';
    },

    formatTime(date) {
      if (!date) return 'N/A';
      const now = new Date();
      const diff = Math.floor((now - date) / 1000);

      if (diff < 60) return `${diff}s ago`;
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      return date.toLocaleTimeString();
    }
  }
};
</script>
