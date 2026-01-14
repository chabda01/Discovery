<template>
  <div class="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
    <main class="flex-1 flex flex-col overflow-y-auto">
      <!-- TOP BAR -->
      <header class="flex items-center justify-between px-8 py-4 border-b border-border-dark sticky top-0 bg-card-dark">
        <h2 class="text-xl font-bold">Fleet Management</h2>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <div :class="['w-2 h-2 rounded-full', isConnected ? 'bg-green-500' : 'bg-red-500']"></div>
            <span class="text-sm text-slate-400">{{ isConnected ? 'Connected' : 'Disconnected' }}</span>
          </div>
        </div>
      </header>

      <!-- CONTENT -->
      <div class="p-8 space-y-8">
        <!-- STATS MINI -->
        <section class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-card-dark p-4 rounded-xl border border-border-dark">
            <p class="text-slate-400 text-xs mb-1">Total Vehicles</p>
            <p class="text-2xl font-bold text-white">{{ stats.total }}</p>
          </div>
          <div class="bg-card-dark p-4 rounded-xl border border-border-dark">
            <p class="text-slate-400 text-xs mb-1">Online</p>
            <p class="text-2xl font-bold text-green-500">{{ stats.online }}</p>
          </div>
          <div class="bg-card-dark p-4 rounded-xl border border-border-dark">
            <p class="text-slate-400 text-xs mb-1">Charging</p>
            <p class="text-2xl font-bold text-blue-500">{{ stats.charging }}</p>
          </div>
          <div class="bg-card-dark p-4 rounded-xl border border-border-dark">
            <p class="text-slate-400 text-xs mb-1">Low Battery</p>
            <p class="text-2xl font-bold text-red-500">{{ stats.lowBattery }}</p>
          </div>
        </section>

        <!-- FILTERS -->
        <div class="flex gap-4 items-center">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search vehicles..."
            class="flex-1 px-4 py-2 bg-card-dark border border-border-dark rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <select
            v-model="filterStatus"
            class="px-4 py-2 bg-card-dark border border-border-dark rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="moving">Moving</option>
            <option value="charging">Charging</option>
            <option value="idle">Idle</option>
          </select>
        </div>

        <!-- VEHICLE GRID -->
        <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="vehicle in filteredVehicles"
            :key="vehicle.id"
            class="bg-card-dark rounded-2xl border border-border-dark overflow-hidden hover:border-primary/50 transition-all"
          >
            <!-- Header -->
            <div class="p-6 border-b border-border-dark">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h3 class="text-lg font-bold text-white">{{ vehicle.name }}</h3>
                  <p class="text-sm text-slate-400">{{ vehicle.country }}</p>
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
                  <span class="text-sm text-slate-400">Battery</span>
                  <span :class="['text-sm font-bold', getBatteryColorClass(vehicle.battery)]">
                    {{ vehicle.battery }}%
                  </span>
                </div>
                <div class="w-full bg-background-dark rounded-full h-2">
                  <div
                    :class="['h-2 rounded-full transition-all', getBatteryBarClass(vehicle.battery)]"
                    :style="{ width: vehicle.battery + '%' }"
                  ></div>
                </div>
              </div>

              <!-- Speed & Location -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-slate-400 mb-1">Speed</p>
                  <p class="text-lg font-bold text-white">{{ vehicle.speed }} <span class="text-xs text-slate-400">km/h</span></p>
                </div>
                <div>
                  <p class="text-xs text-slate-400 mb-1">Last Update</p>
                  <p class="text-sm text-white">{{ formatTime(vehicle.lastUpdate) }}</p>
                </div>
              </div>

              <!-- Location -->
              <div>
                <p class="text-xs text-slate-400 mb-1">Location</p>
                <p class="text-xs font-mono text-slate-300">
                  {{ vehicle.lat.toFixed(4) }}, {{ vehicle.lng.toFixed(4) }}
                </p>
              </div>

              <!-- Action Button -->
              <button
                @click="viewDetails(vehicle.id)"
                class="w-full mt-4 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-medium transition-all flex items-center justify-center gap-2"
              >
                <span>View Details</span>
                <span class="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        <!-- No vehicles -->
        <div v-if="filteredVehicles.length === 0" class="text-center py-12">
          <span class="material-symbols-outlined text-6xl text-slate-600 mb-4">directions_car_filled</span>
          <p class="text-slate-500">No vehicles found</p>
        </div>
      </div>
    </main>
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
      return 'bg-slate-500/20 text-slate-400';
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
