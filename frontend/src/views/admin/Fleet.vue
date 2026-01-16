<template>
  <div class="space-y-4 sm:space-y-6 lg:space-y-8">
    <!-- STATS MINI -->
    <section class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      <div class="glass-card p-4 rounded-xl">
        <p class="text-gray-600 dark:text-white/60 text-xs mb-1 transition-colors">Total Vehicles</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white transition-colors">{{ stats.total }}</p>
      </div>
      <div class="glass-card p-4 rounded-xl">
        <p class="text-gray-600 dark:text-white/60 text-xs mb-1 transition-colors">Online</p>
        <p class="text-2xl font-bold text-green-500">{{ stats.online }}</p>
      </div>
      <div class="glass-card p-4 rounded-xl">
        <p class="text-gray-600 dark:text-white/60 text-xs mb-1 transition-colors">Charging</p>
        <p class="text-2xl font-bold text-blue-500">{{ stats.charging }}</p>
      </div>
      <div class="glass-card p-4 rounded-xl">
        <p class="text-gray-600 dark:text-white/60 text-xs mb-1 transition-colors">Low Battery</p>
        <p class="text-2xl font-bold text-red-500">{{ stats.lowBattery }}</p>
      </div>
    </section>

    <!-- FILTERS -->
    <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search vehicles..."
        class="kemet-input flex-1"
      />
      <select
        v-model="filterStatus"
        class="kemet-input px-4 py-2"
      >
        <option value="all">All Status</option>
        <option value="moving">Moving</option>
        <option value="charging">Charging</option>
        <option value="idle">Idle</option>
      </select>
    </div>

    <!-- VEHICLE GRID -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <div
        v-for="vehicle in filteredVehicles"
        :key="vehicle.id"
        class="glass-card rounded-2xl overflow-hidden hover:border-kemet-primary/50 transition-all"
      >
            <!-- Header -->
            <div class="p-6 border-b border-white/10">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white transition-colors">{{ vehicle.name }}</h3>
                  <p class="text-sm text-gray-600 dark:text-slate-400 transition-colors">{{ vehicle.country }}</p>
                </div>
                <div class="flex gap-2">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1',
                      vehicle.isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    ]"
                  >
                    <span class="material-symbols-outlined text-xs">
                      {{ vehicle.isConnected ? 'wifi' : 'wifi_off' }}
                    </span>
                    {{ vehicle.isConnected ? 'Online' : 'Offline' }}
                  </span>
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-medium',
                      getStatusBadgeClass(vehicle)
                    ]"
                  >
                    {{ getVehicleStatus(vehicle) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Stats -->
            <div class="p-6 space-y-4">
              <!-- Battery -->
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm text-gray-600 dark:text-slate-400 transition-colors">Battery</span>
                  <span :class="['text-sm font-bold', getBatteryColorClass(vehicle.battery)]">
                    {{ vehicle.battery }}%
                  </span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 transition-colors">
                  <div
                    :class="['h-2 rounded-full transition-all', getBatteryBarClass(vehicle.battery)]"
                    :style="{ width: vehicle.battery + '%' }"
                  ></div>
                </div>
              </div>

              <!-- Speed & Location -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-gray-600 dark:text-slate-400 mb-1 transition-colors">Speed</p>
                  <p class="text-lg font-bold text-gray-900 dark:text-white transition-colors">{{ vehicle.speed }} <span class="text-xs text-gray-600 dark:text-slate-400 transition-colors">km/h</span></p>
                </div>
                <div>
                  <p class="text-xs text-gray-600 dark:text-slate-400 mb-1 transition-colors">Last Update</p>
                  <p class="text-sm text-gray-900 dark:text-white transition-colors">{{ formatTime(vehicle.lastUpdate) }}</p>
                </div>
              </div>

              <!-- Location -->
              <div>
                <p class="text-xs text-gray-600 dark:text-slate-400 mb-1 transition-colors">Location</p>
                <p class="text-xs font-mono text-gray-700 dark:text-slate-300 transition-colors">
                  {{ vehicle.lat.toFixed(4) }}, {{ vehicle.lng.toFixed(4) }}
                </p>
              </div>

              <!-- Action Button -->
              <button
                @click="viewDetails(vehicle.id)"
                class="kemet-btn w-full mt-4"
              >
                <span>View Details</span>
                <span class="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        <!-- No vehicles -->
        <div v-if="filteredVehicles.length === 0" class="text-center py-12">
          <span class="material-symbols-outlined text-6xl text-gray-400 dark:text-white/30 mb-4 transition-colors">directions_car_filled</span>
          <p class="text-gray-600 dark:text-white/50 transition-colors">No vehicles found</p>
        </div>
  </div>
</template>

<script>
import vehicleService from '../../services/vehicleService';

export default {
  name: 'FleetView',

  data() {
    return {
      vehicles: [],
      stats: {
        total: 0,
        online: 0,
        charging: 0,
        lowBattery: 0
      },
      isConnected: false,
      unsubscribe: null,
      searchQuery: '',
      filterStatus: 'all'
    };
  },

  computed: {
    filteredVehicles() {
      let filtered = this.vehicles;

      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(v =>
          v.name.toLowerCase().includes(query) ||
          v.country.toLowerCase().includes(query) ||
          v.id.toString().includes(query)
        );
      }

      // Filter by status
      if (this.filterStatus !== 'all') {
        filtered = filtered.filter(v => {
          const status = this.getVehicleStatus(v).toLowerCase();
          return status === this.filterStatus;
        });
      }

      return filtered;
    }
  },

  mounted() {
    vehicleService.connect('ws://localhost:8080');
    this.isConnected = true;

    this.unsubscribe = vehicleService.subscribe((vehicles) => {
      this.vehicles = vehicles;
      this.stats = vehicleService.getStats();
    });
  },

  beforeUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },

  methods: {
    viewDetails(vehicleId) {
      this.$router.push(`/admin/fleet/${vehicleId}`);
    },

    getVehicleStatus(vehicle) {
      if (vehicle.charging) return 'Charging';
      if (vehicle.speed > 0) return 'Moving';
      return 'Idle';
    },

    getStatusBadgeClass(vehicle) {
      if (vehicle.charging) return 'bg-blue-500/20 text-blue-400';
      if (vehicle.speed > 0) return 'bg-green-500/20 text-green-400';
      return 'bg-gray-500/20 text-gray-600 dark:text-slate-400';
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
