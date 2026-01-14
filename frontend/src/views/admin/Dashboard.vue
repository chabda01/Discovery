<template>
  <div
    class="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100"
  >
    <!-- MAIN -->
    <main class="flex-1 flex flex-col overflow-y-auto">
      <!-- TOP BAR -->
      <header
        class="flex items-center justify-between px-8 py-4 border-b border-border-dark sticky top-0 bg-card-dark"
      >
        <h2 class="text-xl font-bold">Dashboard</h2>
        <div class="flex items-center gap-2">
          <div
            :class="[
              'w-2 h-2 rounded-full',
              isConnected ? 'bg-green-500' : 'bg-red-500',
            ]"
          ></div>
          <span class="text-sm text-slate-400">{{
            isConnected ? "Connected" : "Disconnected"
          }}</span>
        </div>
      </header>

      <!-- CONTENT -->
      <div class="p-8 space-y-8">
        <!-- STATS -->
        <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div class="bg-card-dark p-6 rounded-2xl border border-border-dark">
            <div class="flex items-center justify-between mb-2">
              <p class="text-slate-400 text-sm">Total Vehicles</p>
              <span class="material-symbols-outlined text-primary"
                >directions_car</span
              >
            </div>
            <p class="text-3xl font-bold text-white">{{ stats.total }}</p>
          </div>

          <div class="bg-card-dark p-6 rounded-2xl border border-border-dark">
            <div class="flex items-center justify-between mb-2">
              <p class="text-slate-400 text-sm">Connected</p>
              <span class="material-symbols-outlined text-green-500"
                >wifi</span
              >
            </div>
            <p class="text-3xl font-bold text-white">{{ connectedCount }}</p>
          </div>

          <div class="bg-card-dark p-6 rounded-2xl border border-border-dark">
            <div class="flex items-center justify-between mb-2">
              <p class="text-slate-400 text-sm">Online</p>
              <span class="material-symbols-outlined text-green-500"
                >power</span
              >
            </div>
            <p class="text-3xl font-bold text-white">{{ stats.online }}</p>
          </div>

          <div class="bg-card-dark p-6 rounded-2xl border border-border-dark">
            <div class="flex items-center justify-between mb-2">
              <p class="text-slate-400 text-sm">Charging</p>
              <span class="material-symbols-outlined text-blue-500"
                >battery_charging_full</span
              >
            </div>
            <p class="text-3xl font-bold text-white">{{ stats.charging }}</p>
          </div>

          <div class="bg-card-dark p-6 rounded-2xl border border-border-dark">
            <div class="flex items-center justify-between mb-2">
              <p class="text-slate-400 text-sm">Low Battery</p>
              <span class="material-symbols-outlined text-red-500"
                >warning</span
              >
            </div>
            <p class="text-3xl font-bold text-white">{{ stats.lowBattery }}</p>
          </div>
        </section>

        <!-- MAP -->
        <div class="h-[500px] xl:h-[560px]">
          <LiveMap :vehicles="vehicles" />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import vehicleService from "../../services/vehicleService";
import LiveMap from "../../components/LiveMap.vue";

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
    vehicleService.connect("ws://localhost:8080");
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
      return "text-slate-400";
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
