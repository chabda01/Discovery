<template>
  <div class="space-y-8">
      <!-- TOP BAR -->
      <header
      class="glass-topbar flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4 rounded-2xl"
      >
        <div class="flex items-center gap-2 sm:gap-4">
          <div>
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white transition-colors">
              {{ vehicle?.name || "My Vehicle" }}
            </h1>
            <div class="flex items-center gap-2 mt-1">
              <div
                class="w-2 h-2 bg-kemet-success rounded-full animate-pulse"
              ></div>
              <span class="text-xs text-gray-600 dark:text-slate-400 transition-colors uppercase tracking-wider transition-colors"
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
          class="kemet-btn px-3 sm:px-5 py-2 sm:py-2.5 flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto"
        >
          <span class="material-symbols-outlined text-lg sm:text-xl">swap_horiz</span>
          <span class="hidden sm:inline">Switch Vehicle</span>
          <span class="sm:hidden">Switch</span>
        </button>
      </header>

      <!-- CONTENT -->
      <div v-if="vehicle" class="space-y-8">
        <!-- MAIN GRID -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <!-- LEFT: Vehicle Visual -->
          <div class="lg:col-span-2 space-y-4 sm:space-y-6">
            <!-- Vehicle 3D Card -->
            <div
              class="relative glass-card rounded-2xl sm:rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500"
            >
              <!-- Vehicle 3D Viewer -->
              <div class="relative h-[300px] sm:h-[400px] lg:h-[500px] bg-gradient-to-br from-gray-50 via-kemet-primary/5 to-gray-100 dark:from-black/50 dark:via-kemet-primary/10 dark:to-black/50">
                <Vehicle3DViewer
                  :vehicle-image="vehicleImage"
                  :battery="vehicle?.battery || 0"
                  :is-charging="vehicle?.charging || false"
                />
              </div>
            </div>

            <!-- Quick Stats Grid -->
            <div class="grid grid-cols-3 gap-4">
              <!-- Battery Level -->
              <div
                class="relative glass-card p-6 rounded-2xl overflow-hidden group hover:scale-105 transition-all duration-300 hover:shadow-xl cursor-pointer"
              >
                <div
                  class="absolute top-0 right-0 w-32 h-32 bg-kemet-success/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"
                ></div>
                <div class="relative z-10">
                  <div class="flex items-center gap-2 mb-3">
                    <span class="material-symbols-outlined text-kemet-success group-hover:scale-110 transition-transform duration-300"
                      >battery_charging_full</span
                    >
                    <span
                      class="text-xs text-gray-600 dark:text-slate-400 transition-colors uppercase tracking-wider font-medium"
                      >Battery Level</span
                    >
                  </div>
                  <p
                    class="text-5xl font-bold group-hover:scale-110 transition-transform duration-300"
                    :class="getBatteryColor(vehicle.battery)"
                  >
                    {{ vehicle.battery }}%
                  </p>
                  <div
                    class="mt-3 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden backdrop-blur-sm"
                  >
                    <div
                      :class="[
                        'h-2.5 rounded-full transition-all duration-1000 ease-out relative overflow-hidden',
                        getBatteryBarClass(vehicle.battery),
                      ]"
                      :style="{ width: vehicle.battery + '%' }"
                    >
                      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Range -->
              <div
                class="relative glass-card p-6 rounded-2xl overflow-hidden group hover:scale-105 transition-all duration-300 hover:shadow-xl cursor-pointer"
              >
                <div
                  class="absolute top-0 right-0 w-32 h-32 bg-kemet-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"
                ></div>
                <div class="relative z-10">
                  <div class="flex items-center gap-2 mb-3">
                    <span class="material-symbols-outlined text-kemet-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-300"
                      >electric_bolt</span
                    >
                    <span
                      class="text-xs text-gray-600 dark:text-slate-400 transition-colors uppercase tracking-wider font-medium"
                      >Est. Range</span
                    >
                  </div>
                  <p class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white transition-colors group-hover:scale-110 transition-transform duration-300">
                    {{ Math.round(vehicle.battery * 4) }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-slate-400 transition-colors mt-1">km</p>
                  <p
                    class="text-xs text-kemet-primary mt-2 font-semibold uppercase"
                  >
                    Peak Efficiency
                  </p>
                </div>
              </div>

              <!-- Status -->
              <div
                class="relative glass-card p-4 sm:p-6 rounded-2xl overflow-hidden group"
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
                      class="text-xs text-gray-600 dark:text-slate-400 transition-colors uppercase tracking-wider font-medium"
                      >Status</span
                    >
                  </div>
                  <p class="text-3xl font-bold text-gray-900 dark:text-white transition-colors mb-2">
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
            <!-- Active Features -->
            <div
              v-if="activeFeaturesList.length > 0"
              class="glass-card-primary rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
            >
              <h3 class="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white transition-colors">
                <span class="material-symbols-outlined text-kemet-primary animate-float"
                  >auto_awesome</span
                >
                Active Features
              </h3>
              <div class="space-y-2">
                <div
                  v-for="(feature, index) in activeFeaturesList"
                  :key="feature.id"
                  class="flex items-center justify-between p-3 glass-effect rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
                  :style="{ animationDelay: `${index * 0.1}s` }"
                >
                  <div class="flex items-center gap-3">
                    <span
                      class="material-symbols-outlined text-kemet-success group-hover:scale-110 group-hover:rotate-12 transition-all duration-300"
                      >{{ feature.icon }}</span
                    >
                    <span class="text-sm font-medium text-gray-900 dark:text-white transition-colors">{{
                      feature.name
                    }}</span>
                  </div>
                  <span
                    class="px-2 py-1 bg-kemet-success/20 text-kemet-success rounded text-xs font-bold group-hover:bg-kemet-success/30 transition-colors"
                    >Active</span
                  >
                </div>
              </div>

              <!-- Driving Mode Badge -->
              <div
                v-if="vehicle.drivingMode !== 'manual'"
                class="mt-4 p-4 bg-kemet-primary/20 rounded-xl border border-kemet-primary/30"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-gradient-kemet rounded-full flex items-center justify-center"
                  >
                    <span class="material-symbols-outlined text-gray-900 dark:text-white transition-colors"
                      >smart_toy</span
                    >
                  </div>
                  <div>
                    <p
                      class="text-xs text-kemet-primary-light uppercase tracking-wider font-semibold"
                    >
                      Current Mode
                    </p>
                    <p class="text-sm font-bold text-gray-900 dark:text-white transition-colors capitalize">
                      {{ vehicle.drivingMode.replace("-", " ") }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div
              class="glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
            >
              <h3 class="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white transition-colors">
                <span class="material-symbols-outlined text-kemet-primary animate-float"
                  >tune</span
                >
                Quick Actions
              </h3>
              <div class="grid grid-cols-2 gap-3">
                <button
                  @click="$router.push('/client/features')"
                  class="p-4 glass-effect-primary rounded-xl transition-all duration-300 group hover:scale-105 hover:shadow-lg relative overflow-hidden"
                >
                  <div class="absolute inset-0 bg-gradient-to-r from-kemet-primary/0 via-kemet-primary/20 to-kemet-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span
                    class="material-symbols-outlined text-2xl text-kemet-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 relative z-10"
                    >add_circle</span
                  >
                  <p class="text-xs mt-2 font-medium text-gray-900 dark:text-white transition-colors relative z-10">Add Features</p>
                </button>
                <button
                  class="p-4 glass-effect rounded-xl transition-all duration-300 group hover:scale-105 hover:shadow-lg relative overflow-hidden"
                >
                  <div class="absolute inset-0 bg-gradient-to-r from-gray-200/0 via-gray-200/20 to-gray-200/0 dark:from-white/0 dark:via-white/10 dark:to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span
                    class="material-symbols-outlined text-2xl text-gray-600 dark:text-slate-400 transition-colors group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 relative z-10"
                    >bar_chart</span
                  >
                  <p class="text-xs mt-2 font-medium text-gray-900 dark:text-white transition-colors relative z-10">View Stats</p>
                </button>
              </div>
            </div>

            <!-- Vehicle Health -->
            <div
              class="glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
            >
              <h3 class="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white transition-colors">
                <span class="material-symbols-outlined text-kemet-success animate-pulse-glow"
                  >favorite</span
                >
                Vehicle Health
              </h3>

              <div class="space-y-3">
                <div
                  class="flex items-center justify-between p-3 glass-effect rounded-xl hover:scale-105 transition-all duration-300 group cursor-pointer"
                >
                  <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-kemet-success group-hover:scale-110 transition-transform duration-300"
                      >check_circle</span
                    >
                    <span class="text-sm text-gray-900 dark:text-white transition-colors">Battery Health</span>
                  </div>
                  <span class="text-kemet-success font-bold group-hover:scale-110 transition-transform duration-300"
                    >{{ vehicle.battery }}%</span
                  >
                </div>

                <div
                  class="flex items-center justify-between p-3 glass-effect rounded-xl hover:scale-105 transition-all duration-300 group cursor-pointer"
                >
                  <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-kemet-success group-hover:scale-110 transition-transform duration-300"
                      >thermostat</span
                    >
                    <span class="text-sm text-gray-900 dark:text-white transition-colors">Motor Temp</span>
                  </div>
                  <span class="text-gray-900 dark:text-white transition-colors font-bold group-hover:scale-110 transition-transform duration-300">42°C</span>
                </div>

                <div
                  class="flex items-center justify-between p-3 glass-effect rounded-xl hover:scale-105 transition-all duration-300 group cursor-pointer"
                >
                  <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-kemet-success group-hover:scale-110 transition-transform duration-300"
                      >speed</span
                    >
                    <span class="text-sm text-gray-900 dark:text-white transition-colors">Tire Pressure</span>
                  </div>
                  <span class="text-gray-900 dark:text-white transition-colors font-bold group-hover:scale-110 transition-transform duration-300">32 PSI</span>
                </div>
              </div>

              <p class="text-xs text-gray-500 dark:text-slate-500 mt-4 uppercase tracking-wider transition-colors">
                Optimal Charging Condition
              </p>
            </div>
          </div>
        </div>

        <!-- MAP SECTION -->
        <div class="glass-card h-[500px] xl:h-[560px] p-4 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group">
          <div class="absolute top-6 left-6 z-10 glass-effect-primary px-4 py-2 rounded-xl">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-kemet-primary text-sm">location_on</span>
              <span class="text-xs font-bold text-kemet-primary uppercase tracking-wider">Live Location</span>
            </div>
          </div>
          <LiveMap :vehicles="mapVehicles" />
        </div>
      </div>

      <!-- NO VEHICLE SELECTED -->
      <div v-else class="flex items-center justify-center py-20">
        <div class="text-center">
          <span class="material-symbols-outlined text-6xl text-slate-600 mb-4"
            >directions_car_filled</span
          >
          <p class="text-slate-500 mb-4">No vehicle selected</p>
          <button
            @click="toggleVehicleSelector"
            class="kemet-btn px-6 py-3"
          >
            Select Vehicle
          </button>
        </div>
      </div>

    <!-- VEHICLE SELECTOR MODAL -->
    <Transition name="modal">
    <div
      v-if="showVehicleSelector"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="toggleVehicleSelector"
    >
      <div
          class="glass-card-lg rounded-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300"
      >
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white transition-colors">Select Your Vehicle</h3>
            <button
              @click="toggleVehicleSelector"
              class="p-2 glass-effect hover:bg-gray-200/50 dark:hover:bg-white/10 rounded-lg transition-all"
            >
              <span class="material-symbols-outlined text-gray-700 dark:text-slate-400">close</span>
            </button>
          </div>
        <div class="space-y-3">
          <button
              v-for="(v, index) in vehicles"
            :key="v.id"
            @click="selectVehicle(v.id)"
            :class="[
                'w-full p-4 rounded-xl transition-all duration-300 flex items-center justify-between group relative overflow-hidden',
              selectedVehicleId === v.id
                  ? 'glass-effect-primary shadow-lg scale-105'
                  : 'glass-effect hover:scale-105 hover:shadow-lg',
            ]"
              :style="{ animationDelay: `${index * 0.1}s` }"
          >
              <div class="absolute inset-0 bg-gradient-to-r from-kemet-primary/0 via-kemet-primary/20 to-kemet-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div class="text-left relative z-10">
                <p class="font-bold text-gray-900 dark:text-white transition-colors">
                {{ v.name || `Vehicle ${v.id}` }}
              </p>
                <p class="text-xs text-gray-600 dark:text-slate-400 transition-colors">{{ v.country }}</p>
            </div>
            <span
              v-if="selectedVehicleId === v.id"
                class="material-symbols-outlined text-kemet-primary dark:text-white transition-colors relative z-10 animate-float"
              >check_circle</span
            >
              <span
                v-else
                class="material-symbols-outlined text-gray-400 transition-colors relative z-10 opacity-0 group-hover:opacity-100"
                >arrow_forward</span
              >
          </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import LiveMap from "../../components/LiveMap.vue";
import Vehicle3DViewer from "../../components/Vehicle3DViewer.vue";
import vehicleService from "../../services/vehicleService";
import vehicleImage from "../../assets/RENDER-4-scaled.png";
import { WS_URL } from "../../config/env.js";

export default {
  name: "ClientDashboard",
  components: {
    LiveMap,
    Vehicle3DViewer,
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
      mapInitialized: false,
      allFeatures: [],
      vehicleImage: vehicleImage,
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

    activeFeaturesList() {
      if (!this.vehicle || !this.vehicle.activeFeatures) return [];

      return this.vehicle.activeFeatures
        .map((id) => this.allFeatures.find((f) => f.id === id))
        .filter(Boolean);
    },
  },

  mounted() {
    // Charger la liste des features
    import("../../services/featureService").then((module) => {
      this.allFeatures = module.default.getFeatures();
    });

    vehicleService.connect(WS_URL);

    this.unsubscribe = vehicleService.subscribe((vehicles) => {
      this.vehicles = vehicles;

      if (!this.selectedVehicleId && vehicles.length > 0) {
        this.selectedVehicleId = vehicles[0].id;
      }

      if (this.selectedVehicleId) {
        this.vehicle = vehicles.find((v) => v.id === this.selectedVehicleId);
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

      // Attendre que le DOM soit mis à jour avant d'initialiser la carte
      this.$nextTick(() => {
        setTimeout(() => {
          this.initMap();
        }, 100);
      });
    },

    initMap() {
      // Si la carte existe déjà, la détruire d'abord
      if (this.map) {
        this.map.remove();
        this.map = null;
        this.marker = null;
      }

      const mapElement = this.$refs.mapEl;

      if (!mapElement || !this.vehicle) {
        console.warn("Map element or vehicle not found");
        return;
      }

      try {
        // Créer la carte
        this.map = L.map(mapElement, {
          zoomControl: true,
          attributionControl: false,
        }).setView([this.vehicle.lat, this.vehicle.lng], 13);

        // Ajouter le tile layer
        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
          {
            attribution: "© OpenStreetMap contributors © CARTO",
            maxZoom: 19,
          }
        ).addTo(this.map);

        // Créer l'icône personnalisée
        const customIcon = L.divIcon({
          html: `
            <div class="relative">
              <div class="w-8 h-8 bg-gradient-kemet rounded-full shadow-glow-lg flex items-center justify-center">
                <span class="material-symbols-outlined text-gray-900 dark:text-white transition-colors text-lg">directions_car</span>
              </div>
              <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-kemet-primary rounded-full"></div>
            </div>
          `,
          className: "custom-car-marker",
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });

        // Ajouter le marker
        this.marker = L.marker([this.vehicle.lat, this.vehicle.lng], {
          icon: customIcon,
        }).addTo(this.map);

        // Forcer Leaflet à recalculer la taille
        setTimeout(() => {
          if (this.map) {
            this.map.invalidateSize();
          }
        }, 200);

        this.mapInitialized = true;
        console.log("Map initialized successfully");
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    },

    updateMap() {
      if (!this.map || !this.vehicle) {
        // Si la carte n'existe pas, l'initialiser
        this.$nextTick(() => {
          this.initMap();
        });
        return;
      }

      try {
        // Mettre à jour la position du marker
        if (this.marker) {
          this.marker.setLatLng([this.vehicle.lat, this.vehicle.lng]);
        }

        // Centrer la carte sur la nouvelle position (sans zoom)
        this.map.setView(
          [this.vehicle.lat, this.vehicle.lng],
          this.map.getZoom()
        );
      } catch (error) {
        console.error("Error updating map:", error);
        // En cas d'erreur, réinitialiser la carte
        this.initMap();
      }
    },

    locateOnMap() {
      if (this.map && this.vehicle) {
        this.map.setView([this.vehicle.lat, this.vehicle.lng], 15);
      } else {
        this.initMap();
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

  watch: {
    vehicle: {
      handler(newVehicle) {
        if (newVehicle && this.mapInitialized) {
          this.updateMap();
        } else if (newVehicle && !this.mapInitialized) {
          this.$nextTick(() => {
            this.initMap();
          });
        }
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
#map {
  z-index: 0;
  width: 100%;
  height: 100%;
}

:deep(.custom-car-marker) {
  background: none !important;
  border: none !important;
}

:deep(.leaflet-container) {
  background: #132f4c;
  font-family: inherit;
}

:deep(.leaflet-control-zoom) {
  border: none !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

:deep(.leaflet-control-zoom a) {
  background: #132f4c !important;
  color: white !important;
  border: 1px solid #1e3a5f !important;
}

:deep(.leaflet-control-zoom a:hover) {
  background: #1a4971 !important;
}
</style>
