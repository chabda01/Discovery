<template>
  <div
    class="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100"
  >
    <!-- SIDEBAR -->
    <aside
      class="w-64 border-r border-border-dark bg-background-dark flex-col hidden lg:flex"
    >
      <div class="p-6 flex items-center gap-3">
        <div
          class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-background-dark"
        >
          <span class="material-symbols-outlined font-bold">bolt</span>
        </div>
        <div>
          <h1 class="text-white text-lg font-bold">VoltaLink</h1>
          <p class="text-slate-500 text-xs uppercase tracking-widest">Admin</p>
        </div>
      </div>

      <nav class="flex-1 px-4 py-4 space-y-2">
        <div
          class="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary"
        >
          <span class="material-symbols-outlined">dashboard</span>
          <p class="text-sm font-bold">Dashboard</p>
        </div>
      </nav>
    </aside>

    <!-- MAIN -->
    <main class="flex-1 flex flex-col overflow-y-auto">
      <!-- TOP BAR -->
      <header
        class="flex items-center justify-between px-8 py-4 border-b border-border-dark sticky top-0 bg-card-dark"
      >
        <h2 class="text-xl font-bold">System Overview</h2>
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
        <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        <!-- VEHICLE LIST -->
        <section class="bg-card-dark rounded-2xl border border-border-dark p-6">
          <h3 class="text-lg font-bold text-white mb-4">Vehicle Fleet</h3>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-border-dark">
                  <th
                    class="text-left text-sm font-semibold text-slate-400 pb-3"
                  >
                    Vehicle ID
                  </th>
                  <th
                    class="text-left text-sm font-semibold text-slate-400 pb-3"
                  >
                    Battery
                  </th>
                  <th
                    class="text-left text-sm font-semibold text-slate-400 pb-3"
                  >
                    Speed
                  </th>
                  <th
                    class="text-left text-sm font-semibold text-slate-400 pb-3"
                  >
                    Status
                  </th>
                  <th
                    class="text-left text-sm font-semibold text-slate-400 pb-3"
                  >
                    Last Update
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="vehicle in vehicles"
                  :key="vehicle.id"
                  class="border-b border-border-dark/50 hover:bg-background-dark/50"
                >
                  <td class="py-3 text-white font-medium">
                    {{ vehicle.name || `Vehicle ${vehicle.id}` }}
                  </td>
                  <td class="py-3">
                    <span :class="getBatteryColorClass(vehicle.battery)">
                      {{ vehicle.battery }}%
                    </span>
                  </td>
                  <td class="py-3 text-slate-300">{{ vehicle.speed }} km/h</td>
                  <td class="py-3">
                    <span :class="getStatusClass(vehicle)">
                      {{ getVehicleStatus(vehicle) }}
                    </span>
                  </td>
                  <td class="py-3 text-slate-400 text-sm">
                    {{ formatTime(vehicle.lastUpdate) }}
                  </td>
                </tr>
              </tbody>
            </table>
            <div
              v-if="vehicles.length === 0"
              class="text-center py-8 text-slate-500"
            >
              No vehicles connected
            </div>
          </div>
        </section>
      </div>

      <!-- FOOTER -->
      <footer
        class="mt-auto p-6 text-xs text-slate-500 border-t border-border-dark"
      >
        © 2024 VoltaLink Electric
      </footer>
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
