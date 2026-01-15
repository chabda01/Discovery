<template>
  <div class="flex overflow-hidden bg-dark-bg text-white relative">
    <div class="absolute inset-0 bg-gradient-mesh opacity-20"></div>

    <main class="flex-1 flex flex-col overflow-y-auto relative z-10">
      <!-- TOP BAR -->
      <header
        class="sticky top-0 z-40 flex items-center justify-between px-8 py-4 bg-dark-card/30 backdrop-blur-xl shadow-elevation-1"
      >
        <div class="flex items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold text-white">
              {{ vehicle?.name || "My Vehicle" }}
            </h1>
            <div class="flex items-center gap-2 mt-1">
              <div
                class="w-2 h-2 bg-kemet-success rounded-full animate-pulse"
              ></div>
              <span class="text-xs text-slate-400 uppercase tracking-wider"
                >Last synced: {{ formatLastSync(vehicle?.lastUpdate) }}</span
              >
            </div>
          </div>
          <span
            v-if="vehicle?.isConnected"
            class="ml-4 px-3 py-1 bg-kemet-success/20 text-kemet-success rounded-full text-xs font-bold uppercase"
            >Active</span
          >
        </div>

        <button
          @click="toggleVehicleSelector"
          class="px-5 py-2.5 bg-dark-card/80 backdrop-blur-md hover:bg-dark-hover rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-elevation-2"
        >
          <span class="material-symbols-outlined">swap_horiz</span>
          Switch Vehicle
        </button>
      </header>

      <!-- CONTENT -->
      <div v-if="vehicle" class="p-8 space-y-8">
        <!-- MAIN GRID -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- LEFT: Vehicle Visual -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Vehicle Image Card -->
            <div
              class="relative bg-dark-card/40 backdrop-blur-md rounded-3xl shadow-elevation-3 overflow-hidden group"
            >
              <div
                class="absolute top-4 left-4 z-10 px-4 py-2 bg-kemet-success/20 backdrop-blur-sm rounded-xl border border-kemet-success/30"
              >
                <div class="flex items-center gap-2">
                  <div
                    class="w-2 h-2 bg-kemet-success rounded-full animate-pulse"
                  ></div>
                  <span
                    class="text-xs font-bold text-kemet-success uppercase tracking-wider"
                    >Live Connection</span
                  >
                </div>
              </div>

              <!-- Vehicle 3D/Image -->
              <div
                class="relative h-[500px] flex items-center justify-center bg-gradient-to-br from-dark-card via-dark-hover to-dark-card"
              >
                <img
                  src="../../assets/RENDER-4-scaled.png"
                  alt="Vehicle"
                />
              </div>
            </div>

            <!-- Quick Stats Grid -->
            <div class="grid grid-cols-3 gap-4">
              <!-- Battery Level -->
              <div
                class="relative bg-dark-card/40 backdrop-blur-md p-6 rounded-2xl shadow-elevation-2 overflow-hidden group"
              >
                <div
                  class="absolute top-0 right-0 w-24 h-24 bg-kemet-success/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"
                ></div>
                <div class="relative">
                  <div class="flex items-center gap-2 mb-3">
                    <span class="material-symbols-outlined text-kemet-success"
                      >battery_charging_full</span
                    >
                    <span
                      class="text-xs text-slate-400 uppercase tracking-wider font-medium"
                      >Battery Level</span
                    >
                  </div>
                  <p
                    class="text-5xl font-bold"
                    :class="getBatteryColor(vehicle.battery)"
                  >
                    {{ vehicle.battery }}%
                  </p>
                  <div
                    class="mt-3 h-2 bg-dark-bg/50 rounded-full overflow-hidden"
                  >
                    <div
                      :class="[
                        'h-2 rounded-full transition-all duration-500',
                        getBatteryBarClass(vehicle.battery),
                      ]"
                      :style="{ width: vehicle.battery + '%' }"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Range -->
              <div
                class="relative bg-dark-card/40 backdrop-blur-md p-6 rounded-2xl shadow-elevation-2 overflow-hidden group"
              >
                <div
                  class="absolute top-0 right-0 w-24 h-24 bg-kemet-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"
                ></div>
                <div class="relative">
                  <div class="flex items-center gap-2 mb-3">
                    <span class="material-symbols-outlined text-kemet-primary"
                      >electric_bolt</span
                    >
                    <span
                      class="text-xs text-slate-400 uppercase tracking-wider font-medium"
                      >Est. Range</span
                    >
                  </div>
                  <p class="text-5xl font-bold text-white">
                    {{ Math.round(vehicle.battery * 4) }}
                  </p>
                  <p class="text-sm text-slate-400 mt-1">km</p>
                  <p
                    class="text-xs text-kemet-primary mt-2 font-semibold uppercase"
                  >
                    Peak Efficiency
                  </p>
                </div>
              </div>

              <!-- Status -->
              <div
                class="relative bg-dark-card/40 backdrop-blur-md p-6 rounded-2xl shadow-elevation-2 overflow-hidden group"
              >
                <div
                  class="absolute top-0 right-0 w-24 h-24 bg-blue-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"
                ></div>
                <div class="relative">
                  <div class="flex items-center gap-2 mb-3">
                    <span class="material-symbols-outlined text-blue-400"
                      >wifi</span
                    >
                    <span
                      class="text-xs text-slate-400 uppercase tracking-wider font-medium"
                      >Status</span
                    >
                  </div>
                  <p class="text-3xl font-bold text-white mb-2">
                    {{ getStatusText(vehicle) }}
                  </p>
                  <p
                    class="text-sm font-medium"
                    :class="
                      vehicle.isConnected
                        ? 'text-kemet-success'
                        : 'text-kemet-danger'
                    "
                  >
                    Signal:
                    <span class="uppercase">{{
                      vehicle.isConnected ? "Excellent" : "Offline"
                    }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT: Actions & Info -->
          <div class="space-y-6">
            <!-- Locate Vehicle Card -->
            <!-- <button
              @click="locateOnMap"
              class="w-full group relative bg-gradient-kemet hover:shadow-glow-lg rounded-2xl p-6 transition-all duration-300 overflow-hidden"
            >
              <div
                class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
              ></div>
              <div class="relative flex items-center justify-between">
                <div class="text-left">
                  <span class="material-symbols-outlined text-4xl mb-2"
                    >location_on</span
                  >
                  <h3 class="text-xl font-bold">Locate Vehicle</h3>
                  <p class="text-sm opacity-80 mt-1">View on map</p>
                </div>
                <span
                  class="material-symbols-outlined text-3xl group-hover:translate-x-1 transition-transform"
                  >arrow_forward</span
                >
              </div>
            </button> -->

            <!-- Quick Actions -->
            <div
              class="bg-dark-card/40 backdrop-blur-md rounded-2xl shadow-elevation-2 p-6"
            >
              <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined text-kemet-primary"
                  >lock</span
                >
                Quick Actions
              </h3>
              <div class="grid grid-cols-2 gap-3">
                <button
                  class="p-4 bg-dark-bg/50 hover:bg-dark-hover rounded-xl transition-all group"
                >
                  <span
                    class="material-symbols-outlined text-2xl text-kemet-success group-hover:scale-110 transition-transform"
                    >lock_open</span
                  >
                  <p class="text-xs mt-2 font-medium">Unlock</p>
                </button>
                <button
                  class="p-4 bg-dark-bg/50 hover:bg-dark-hover rounded-xl transition-all group"
                >
                  <span
                    class="material-symbols-outlined text-2xl text-slate-400 group-hover:scale-110 transition-transform"
                    >bar_chart</span
                  >
                  <p class="text-xs mt-2 font-medium">View Stats</p>
                </button>
              </div>
            </div>

            <!-- Vehicle Health -->
            <div
              class="bg-dark-card/40 backdrop-blur-md rounded-2xl shadow-elevation-2 p-6"
            >
              <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined text-kemet-success"
                  >favorite</span
                >
                Vehicle Health
              </h3>

              <div class="space-y-3">
                <div
                  class="flex items-center justify-between p-3 bg-dark-bg/30 rounded-xl"
                >
                  <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-kemet-success"
                      >check_circle</span
                    >
                    <span class="text-sm">Battery Health</span>
                  </div>
                  <span class="text-kemet-success font-bold"
                    >{{ vehicle.battery }}%</span
                  >
                </div>

                <div
                  class="flex items-center justify-between p-3 bg-dark-bg/30 rounded-xl"
                >
                  <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-kemet-success"
                      >thermostat</span
                    >
                    <span class="text-sm">Motor Temp</span>
                  </div>
                  <span class="text-white font-bold">42°C</span>
                </div>

                <div
                  class="flex items-center justify-between p-3 bg-dark-bg/30 rounded-xl"
                >
                  <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-kemet-success"
                      >speed</span
                    >
                    <span class="text-sm">Tire Pressure</span>
                  </div>
                  <span class="text-white font-bold">32 PSI</span>
                </div>
              </div>

              <p class="text-xs text-slate-500 mt-4 uppercase tracking-wider">
                Optimal Charging Condition
              </p>
            </div>
          </div>
        </div>

        <!-- MAP SECTION -->
        <div class="h-[500px] xl:h-[560px]">
          <LiveMap :vehicles="mapVehicles" />
        </div>
      </div>

      <!-- NO VEHICLE SELECTED -->
      <div v-else class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <span class="material-symbols-outlined text-6xl text-slate-600 mb-4"
            >directions_car_filled</span
          >
          <p class="text-slate-500 mb-4">No vehicle selected</p>
          <button
            @click="toggleVehicleSelector"
            class="px-6 py-3 bg-gradient-kemet text-white rounded-xl font-semibold"
          >
            Select Vehicle
          </button>
        </div>
      </div>
    </main>

    <!-- VEHICLE SELECTOR MODAL -->
    <div
      v-if="showVehicleSelector"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      @click.self="toggleVehicleSelector"
    >
      <div
        class="bg-dark-card/90 backdrop-blur-xl rounded-2xl shadow-elevation-3 p-8 max-w-md w-full mx-4"
      >
        <h3 class="text-2xl font-bold text-white mb-6">Select Your Vehicle</h3>
        <div class="space-y-3">
          <button
            v-for="v in vehicles"
            :key="v.id"
            @click="selectVehicle(v.id)"
            :class="[
              'w-full p-4 rounded-xl transition-all duration-300 flex items-center justify-between',
              selectedVehicleId === v.id
                ? 'bg-gradient-kemet shadow-glow'
                : 'bg-dark-hover hover:bg-dark-border',
            ]"
          >
            <div class="text-left">
              <p class="font-bold text-white">
                {{ v.name || `Vehicle ${v.id}` }}
              </p>
              <p class="text-xs text-slate-400">{{ v.country }}</p>
            </div>
            <span
              v-if="selectedVehicleId === v.id"
              class="material-symbols-outlined text-white"
              >check_circle</span
            >
          </button>
        </div>
        <button
          @click="toggleVehicleSelector"
          class="w-full mt-6 px-6 py-3 bg-dark-hover hover:bg-dark-border text-white rounded-xl font-semibold transition-all"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import LiveMap from '../../components/LiveMap.vue';
import vehicleService from "../../services/vehicleService";

export default {
  name: "ClientDashboard",
  components: {
    LiveMap,
  },
  data() {
    return {
      vehicles: [],
      selectedVehicleId: null,
      vehicle: null,
      unsubscribe: null,
      map: null,
      marker: null,
      showVehicleSelector: false,
      mapEl: null,
    };
  },

  computed: {
    mapVehicles() {
      if (!this.vehicle) return [];
      const lat = Number(this.vehicle.lat);
      const lng = Number(this.vehicle.lng);

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return [];

      return [
        {
          ...this.vehicle,
          lat,
          lng,
        },
      ];
    },

    coords() {
      if (!this.vehicle) return "—";
      const lat = Number(this.vehicle.lat);
      const lng = Number(this.vehicle.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return "—";
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    },
  },

  mounted() {
    vehicleService.connect("ws://localhost:8080");

    this.unsubscribe = vehicleService.subscribe((vehicles) => {
      this.vehicles = vehicles;

      if (!this.selectedVehicleId && vehicles.length > 0) {
        this.selectedVehicleId = vehicles[0].id;
      }

      if (this.selectedVehicleId) {
        this.vehicle = vehicles.find((v) => v.id === this.selectedVehicleId);
        this.updateMap();
      }
    });
  },

  beforeUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.map) {
      this.map.remove();
    }
  },

  methods: {
    toggleVehicleSelector() {
      this.showVehicleSelector = !this.showVehicleSelector;
    },

    selectVehicle(id) {
      this.selectedVehicleId = id;
      this.vehicle = this.vehicles.find((v) => v.id === id);
      this.showVehicleSelector = false;
      this.$nextTick(() => {
        this.initMap();
      });
    },

    initMap() {
      if (!this.$refs.mapEl || !this.vehicle) return;

      const lat = Number(this.vehicle.lat);
      const lng = Number(this.vehicle.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      // ✅ Si la map existe déjà, juste recentrer + invalider taille
      if (this.map) {
        this.map.setView([lat, lng], this.map.getZoom() || 13);
        if (this.marker) this.marker.setLatLng([lat, lng]);

        this.$nextTick(() => {
          requestAnimationFrame(() => this.map.invalidateSize());
        });
        return;
      }

      // ✅ Créer la map une seule fois
      this.map = L.map(this.$refs.mapEl, {
        zoomControl: false,
        attributionControl: true,
      }).setView([lat, lng], 13);

      L.control.zoom({ position: "bottomright" }).addTo(this.map);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution: "© OpenStreetMap contributors © CARTO",
          maxZoom: 19,
        }
      ).addTo(this.map);

      this.marker = L.marker([lat, lng]).addTo(this.map);

      // ✅ IMPORTANT : forcer Leaflet à recalculer la taille après rendu
      this.$nextTick(() => {
        requestAnimationFrame(() => this.map.invalidateSize());
      });
    },

    updateMap() {
      if (!this.vehicle) return;

      const lat = Number(this.vehicle.lat);
      const lng = Number(this.vehicle.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      // Si map pas encore créée, on la crée
      if (!this.map) {
        this.$nextTick(() => this.initMap());
        return;
      }

      if (this.marker) {
        this.marker.setLatLng([lat, lng]);
      } else {
        this.marker = L.marker([lat, lng]).addTo(this.map);
      }

      // Option : garder le zoom actuel
      this.map.setView([lat, lng], this.map.getZoom() || 13);

      // ✅ Forcer redraw (utile quand le layout change)
      this.$nextTick(() => {
        requestAnimationFrame(() => this.map.invalidateSize());
      });
    },

    locateOnMap() {
      if (this.map && this.vehicle) {
        this.map.setView([this.vehicle.lat, this.vehicle.lng], 15);
      }
    },

    getStatusText(vehicle) {
      if (vehicle.isUpdating) return "Updating";
      if (vehicle.charging) return "Charging";
      if (vehicle.speed > 0) return "Moving";
      return "Connected";
    },

    getBatteryColor(battery) {
      if (battery < 20) return "text-kemet-danger";
      if (battery < 50) return "text-kemet-warning";
      return "text-kemet-success";
    },
    getBatteryBarClass(battery) {
      if (battery < 20) return "bg-kemet-danger";
      if (battery < 50) return "bg-kemet-warning";
      return "bg-kemet-success";
    },
    formatLastSync(date) {
      if (!date) return "—";
      const d = new Date(date);
      const diff = Math.floor((Date.now() - d.getTime()) / 1000);
      if (diff < 60) return `${diff}s ago`;
      const m = Math.floor(diff / 60);
      if (m < 60) return `${m}m ago`;
      const h = Math.floor(m / 60);
      return `${h}h ago`;
    },
  },
};
</script>
