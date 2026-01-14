<template>
  <div
    class="relative w-full h-full bg-card-dark rounded-2xl border border-border-dark overflow-hidden"
  >
    <div ref="mapEl" class="w-full h-full"></div>

    <!-- Panneau optionnel au clic -->
    <div
      v-if="selectedVehicle"
      class="absolute bottom-4 left-4 bg-background-dark/90 backdrop-blur-sm p-4 rounded-xl border border-border-dark min-w-[280px]"
    >
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-bold text-white">
          {{ selectedVehicle.name || `Vehicle ${selectedVehicle.id}` }}
        </h3>
        <button
          @click="selectedVehicle = null"
          class="text-slate-400 hover:text-white"
        >
          <span class="material-symbols-outlined text-sm">close</span>
        </button>
      </div>

      <div class="space-y-2 text-xs text-slate-300">
        <div class="flex justify-between">
          <span>Battery:</span>
          <span class="font-bold" :class="getBatteryColor(selectedVehicle.battery)">
            {{ selectedVehicle.battery }}%
          </span>
        </div>
        <div class="flex justify-between">
          <span>Speed:</span>
          <span class="font-bold">{{ selectedVehicle.speed }} km/h</span>
        </div>
        <div class="flex justify-between">
          <span>Status:</span>
          <span class="font-bold">{{ getVehicleStatus(selectedVehicle) }}</span>
        </div>
        <div class="flex justify-between">
          <span>Internet:</span>
          <span class="font-bold flex items-center gap-1" :class="selectedVehicle.isConnected ? 'text-green-500' : 'text-red-500'">
            <span class="material-symbols-outlined text-xs">
              {{ selectedVehicle.isConnected ? 'wifi' : 'wifi_off' }}
            </span>
            {{ selectedVehicle.isConnected ? 'Connected' : 'Offline' }}
          </span>
        </div>
        <div class="flex justify-between">
          <span>Firmware:</span>
          <span class="font-mono font-bold">v{{ selectedVehicle.firmwareVersion }}</span>
        </div>
        <div class="flex justify-between">
          <span>Location:</span>
          <span class="font-mono">{{ selectedVehicle.lat.toFixed(4) }}, {{ selectedVehicle.lng.toFixed(4) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  name: "LiveMap",
  props: {
    vehicles: { type: Array, default: () => [] },
  },

  data() {
    return {
      map: null,
      markers: new Map(), // id -> L.Marker
      selectedVehicle: null,
      resizeObserver: null,
    };
  },

  mounted() {
    this.initMap();
  },

  beforeUnmount() {
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.map) this.map.remove();
  },

  watch: {
    vehicles: {
      handler(newVehicles) {
        this.updateMarkers(newVehicles);
      },
      deep: true,
    },
  },

  methods: {
    initMap() {
      const el = this.$refs.mapEl;
      if (!el) return;

      // Centre par défaut (Porto-Novo)
      this.map = L.map(el, { zoomControl: false }).setView(
        [6.4969, 2.6283],
        11
      );

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution: "© OpenStreetMap contributors © CARTO",
          maxZoom: 19,
        }
      ).addTo(this.map);

      // Fix taille dans layouts flex
      this.$nextTick(() => this.map && this.map.invalidateSize());

      this.resizeObserver = new ResizeObserver(() => {
        if (this.map) this.map.invalidateSize();
      });
      this.resizeObserver.observe(el);
    },

    updateMarkers(vehicles) {
      if (!this.map) return;

      // Prendre uniquement les véhicules avec coords valides
      const valid = vehicles.filter(
        (v) =>
          typeof v.lat === "number" &&
          typeof v.lng === "number" &&
          !Number.isNaN(v.lat) &&
          !Number.isNaN(v.lng)
      );

      const currentIds = new Set(valid.map((v) => v.id));

      // Remove old markers
      this.markers.forEach((marker, id) => {
        if (!currentIds.has(id)) {
          marker.remove();
          this.markers.delete(id);
        }
      });

      // Add/update markers
      valid.forEach((vehicle) => {
        const tooltipHtml = this.buildTooltip(vehicle);

        if (this.markers.has(vehicle.id)) {
          const marker = this.markers.get(vehicle.id);

          marker.setLatLng([vehicle.lat, vehicle.lng]);
          marker.setIcon(this.getMarkerIcon(vehicle));

          // Mettre à jour le tooltip (contenu)
          marker.setTooltipContent(tooltipHtml);
        } else {
          const marker = L.marker([vehicle.lat, vehicle.lng], {
            icon: this.getMarkerIcon(vehicle),
          }).addTo(this.map);

          // ✅ Tooltip au survol (hover)
          marker.bindTooltip(tooltipHtml, {
            direction: "top",
            offset: [0, -10],
            opacity: 1,
            sticky: false,
            interactive: false,
            className: "vl-tooltip",
          });

          // (Optionnel) sélectionner au clic
          marker.on("click", () => {
            this.selectedVehicle = vehicle;
          });

          this.markers.set(vehicle.id, marker);
        }
      });

      // Fit bounds
      if (valid.length >= 2) {
        const bounds = L.latLngBounds(valid.map((v) => [v.lat, v.lng]));
        this.map.fitBounds(bounds, { padding: [50, 50] });
      } else if (valid.length === 1) {
        this.map.setView([valid[0].lat, valid[0].lng], 13);
      }
    },

    buildTooltip(vehicle) {
      const status = this.getVehicleStatus(vehicle);
      const speedText = `${vehicle.speed ?? 0} km/h`;

      // Couleurs “badge”
      let badgeClass = "vl-badge-idle";
      if (vehicle.battery < 20) badgeClass = "vl-badge-low";
      else if (vehicle.charging) badgeClass = "vl-badge-charging";
      else if ((vehicle.speed ?? 0) > 0) badgeClass = "vl-badge-moving";

      const title = vehicle.name || `Vehicle ${vehicle.id}`;

      // Tooltip HTML (petit, propre, comme ton exemple HTML)
      return `
          <div class="vl-tip">
            <div class="vl-tip-title">${title}</div>
            <div class="vl-tip-sub">
              <span class="vl-dot ${badgeClass}"></span>
              ${status} • ${speedText}
            </div>
            <div class="vl-tip-sub">
              Battery: <span class="vl-tip-batt">${
                vehicle.battery ?? "N/A"
              }%</span>
            </div>
          </div>
        `;
    },

    getMarkerIcon(vehicle) {
      const color = this.getVehicleColor(vehicle);

      // petit effet glow si moving/charging (pas pour low batt)
      const glow = vehicle.battery < 20 ? 0.15 : 0.25;

      const svgIcon = `
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="12" fill="${color}" opacity="${glow}"/>
            <circle cx="16" cy="16" r="8" fill="${color}"/>
            <circle cx="16" cy="16" r="4" fill="white"/>
          </svg>
        `;

      return L.divIcon({
        html: svgIcon,
        className: "vl-marker",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
    },

    getVehicleColor(vehicle) {
      if ((vehicle.battery ?? 100) < 20) return "#ef4444"; // red
      if (vehicle.charging) return "#3b82f6"; // blue
      if ((vehicle.speed ?? 0) > 0) return "#22c55e"; // green
      return "#6b7280"; // gray
    },

    getVehicleStatus(vehicle) {
      if (vehicle.charging) return "Charging";
      if ((vehicle.speed ?? 0) > 0) return "Moving";
      if ((vehicle.battery ?? 100) < 20) return "Low Battery";
      return "Idle";
    },

    getBatteryTextClass(battery) {
      if (battery < 20) return "text-red-500";
      if (battery < 50) return "text-yellow-500";
      return "text-green-500";
    },
  },
};
</script>

<style scoped>
:deep(.leaflet-container) {
  height: 100%;
  width: 100%;
}
:deep(.vl-marker) {
  background: none !important;
  border: none !important;
}

/* Tooltip custom (dark, clean) */
:deep(.vl-tooltip) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
}
:deep(.leaflet-tooltip:before) {
  display: none !important;
}

:deep(.vl-tip) {
  background: rgba(18, 18, 20, 0.92);
  border: 1px solid #2d2d33;
  border-radius: 10px;
  padding: 10px 12px;
  min-width: 160px;
  backdrop-filter: blur(10px);
}
:deep(.vl-tip-title) {
  color: #fff;
  font-weight: 700;
  font-size: 12px;
  margin-bottom: 4px;
}
:deep(.vl-tip-sub) {
  color: #94a3b8; /* slate-400 */
  font-size: 11px;
  line-height: 1.35;
  display: flex;
  align-items: center;
  gap: 6px;
}
:deep(.vl-tip-batt) {
  color: #e2e8f0; /* slate-200 */
  font-weight: 700;
}

/* small colored dot */
:deep(.vl-dot) {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  display: inline-block;
}
:deep(.vl-badge-moving) {
  background: #22c55e;
}
:deep(.vl-badge-charging) {
  background: #3b82f6;
}
:deep(.vl-badge-low) {
  background: #ef4444;
}
:deep(.vl-badge-idle) {
  background: #6b7280;
}
</style>
