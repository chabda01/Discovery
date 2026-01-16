<template>
  <div class="space-y-4 sm:space-y-6 lg:space-y-8">
    <!-- STATS -->
    <section class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
      <div class="glass-card p-6 rounded-2xl">
        <div class="flex items-center justify-between mb-2">
          <p class="text-gray-600 dark:text-gray-600 dark:text-white/60 text-sm transition-colors transition-colors">Total Vehicles</p>
          <span class="material-symbols-outlined text-kemet-primary"
            >directions_car</span
          >
        </div>
        <p class="text-3xl font-bold text-gray-900 dark:text-white transition-colors">{{ stats.total }}</p>
      </div>

      <div class="glass-card p-6 rounded-2xl">
        <div class="flex items-center justify-between mb-2">
          <p class="text-gray-600 dark:text-gray-600 dark:text-white/60 text-sm transition-colors transition-colors">Connected</p>
          <span class="material-symbols-outlined text-green-500"
            >wifi</span
          >
        </div>
        <p class="text-3xl font-bold text-gray-900 dark:text-white transition-colors">{{ connectedCount }}</p>
      </div>

      <div class="glass-card p-6 rounded-2xl">
        <div class="flex items-center justify-between mb-2">
          <p class="text-gray-600 dark:text-gray-600 dark:text-white/60 text-sm transition-colors transition-colors">Online</p>
          <span class="material-symbols-outlined text-green-500"
            >power</span
          >
        </div>
        <p class="text-3xl font-bold text-gray-900 dark:text-white transition-colors">{{ stats.online }}</p>
      </div>

      <div class="glass-card p-6 rounded-2xl">
        <div class="flex items-center justify-between mb-2">
          <p class="text-gray-600 dark:text-gray-600 dark:text-white/60 text-sm transition-colors transition-colors">Charging</p>
          <span class="material-symbols-outlined text-blue-500"
            >battery_charging_full</span
          >
        </div>
        <p class="text-3xl font-bold text-gray-900 dark:text-white transition-colors">{{ stats.charging }}</p>
      </div>

      <div class="glass-card p-6 rounded-2xl">
        <div class="flex items-center justify-between mb-2">
          <p class="text-gray-600 dark:text-gray-600 dark:text-white/60 text-sm transition-colors transition-colors">Low Battery</p>
          <span class="material-symbols-outlined text-red-500"
            >warning</span
          >
        </div>
        <p class="text-3xl font-bold text-gray-900 dark:text-white transition-colors">{{ stats.lowBattery }}</p>
      </div>
    </section>

    <!-- MAP -->
    <div class="glass-card h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[560px] p-2 sm:p-4 rounded-2xl overflow-hidden">
      <LiveMap :vehicles="vehicles" />
    </div>
  </div>
</template>

<script>
import vehicleService from "../../services/vehicleService";
import LiveMap from "../../components/LiveMap.vue";
import { WS_URL } from "../../config/env.js";

export default {
  name: "AdminDashboard",

  components: {
    LiveMap,
  },

  data() {
    return {
      vehicles: [],
      stats: {
        total: 0,
        online: 0,
        charging: 0,
        lowBattery: 0,
      },
      isConnected: false,
      unsubscribe: null,
    };
  },

  mounted() {
    // Se connecter au service de véhicules
    vehicleService.connect(WS_URL);
    this.isConnected = true;

    // S'abonner aux mises à jour
    this.unsubscribe = vehicleService.subscribe((vehicles) => {
      this.vehicles = vehicles;
      this.stats = vehicleService.getStats();
    });
  },

  beforeUnmount() {
    // Se désabonner et déconnecter
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },

  computed: {
    connectedCount() {
      return this.vehicles.filter((v) => v.isConnected).length;
    },
  },

  methods: {
    getVehicleStatus(vehicle) {
      if (vehicle.charging) return "Charging";
      if (vehicle.speed > 0) return "Moving";
      return "Idle";
    },

    getStatusClass(vehicle) {
      if (vehicle.charging) return "text-blue-500 font-medium";
      if (vehicle.speed > 0) return "text-green-500 font-medium";
      return "text-gray-600 dark:text-gray-600 dark:text-slate-400 transition-colors";
    },

    getBatteryColorClass(battery) {
      if (battery < 20) return "text-red-500 font-bold";
      if (battery < 50) return "text-yellow-500 font-medium";
      return "text-green-500 font-medium";
    },

    formatTime(date) {
      if (!date) return "N/A";
      const now = new Date();
      const diff = Math.floor((now - date) / 1000);

      if (diff < 60) return `${diff}s ago`;
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      return date.toLocaleTimeString();
    },
  },
};
</script>

<style scoped></style>
