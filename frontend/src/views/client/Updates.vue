<template>
  <div class="flex h-screen overflow-hidden bg-dark-bg text-white relative">
    <div class="absolute inset-0 bg-gradient-mesh opacity-20"></div>
    
    <main class="flex-1 flex flex-col overflow-y-auto relative z-10">
      <!-- TOP BAR -->
      <header class="sticky top-0 z-40 flex items-center justify-between px-8 py-4 bg-dark-card/30 backdrop-blur-xl shadow-elevation-1">
        <div class="flex items-center gap-4">
          <h2 class="text-2xl font-bold bg-gradient-to-r from-white via-kemet-primary-light to-kemet-primary bg-clip-text text-transparent">
            Firmware Updates
          </h2>
          <div v-if="vehicle?.pendingUpdate" class="flex items-center gap-2 px-3 py-1.5 bg-kemet-warning/10 backdrop-blur-sm rounded-full shadow-inner-glow">
            <span class="material-symbols-outlined text-kemet-warning text-sm animate-pulse">update</span>
            <span class="text-xs text-kemet-warning font-medium">Update Available</span>
          </div>
        </div>

        <!-- Vehicle Selector -->
        <select
          v-model="selectedVehicleId"
          @change="onVehicleChange"
          class="px-4 py-2 bg-dark-card/50 backdrop-blur-md shadow-elevation-1 rounded-xl text-white focus:outline-none focus:shadow-glow transition-all"
        >
          <option v-if="vehicles.length === 0" disabled>No vehicles available</option>
          <option v-for="v in vehicles" :key="v.id" :value="v.id">
            {{ v.name || `Vehicle ${v.id}` }}
          </option>
        </select>
      </header>

      <!-- CONTENT -->
      <div v-if="vehicle" class="p-8 space-y-8">
        <!-- CURRENT FIRMWARE -->
        <section class="bg-dark-card/40 backdrop-blur-md rounded-2xl shadow-elevation-2 p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-lg font-bold text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-kemet-primary">memory</span>
                Current Firmware
              </h3>
              <p class="text-sm text-slate-400 mt-1">Installed on your vehicle</p>
            </div>
            <div class="text-right">
              <p class="text-3xl font-bold text-white font-mono">v{{ vehicle.firmwareVersion }}</p>
              <span v-if="!vehicle.pendingUpdate" class="px-3 py-1 bg-kemet-success/20 text-kemet-success rounded-full text-xs font-medium inline-flex items-center gap-1 mt-2">
                <span class="material-symbols-outlined text-xs">check_circle</span>
                Up to date
              </span>
            </div>
          </div>
        </section>

        <!-- PENDING UPDATE ALERT -->
        <div
          v-if="vehicle.pendingUpdate"
          class="relative bg-gradient-to-r from-kemet-warning/20 to-kemet-accent/20 backdrop-blur-md p-8 rounded-2xl shadow-elevation-3 border border-kemet-warning/30"
        >
          <div class="flex items-start gap-6">
            <div class="p-4 bg-kemet-warning/20 rounded-2xl backdrop-blur-sm">
              <span class="material-symbols-outlined text-kemet-warning text-4xl">system_update</span>
            </div>
            <div class="flex-1">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h3 class="text-2xl font-bold text-white mb-2">
                    New Update Available: v{{ vehicle.pendingUpdate.version }}
                  </h3>
                  <p class="text-lg text-slate-300 mb-2">{{ vehicle.pendingUpdate.name }}</p>
                  <p class="text-sm text-slate-400">{{ vehicle.pendingUpdate.description }}</p>
                </div>
              </div>
              
              <!-- Update Requirements -->
              <div class="mb-6 p-6 bg-dark-card/50 backdrop-blur-sm rounded-2xl">
                <p class="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                  <span class="material-symbols-outlined text-kemet-primary">checklist</span>
                  Installation Requirements
                </p>
                <div class="space-y-3">
                  <div class="flex items-center gap-3 p-3 rounded-xl" :class="vehicle.speed === 0 ? 'bg-kemet-success/10' : 'bg-kemet-danger/10'">
                    <span :class="['material-symbols-outlined', vehicle.speed === 0 ? 'text-kemet-success' : 'text-kemet-danger']">
                      {{ vehicle.speed === 0 ? 'check_circle' : 'cancel' }}
                    </span>
                    <div class="flex-1">
                      <span class="text-sm font-medium text-white">Vehicle must be stopped</span>
                      <p v-if="vehicle.speed > 0" class="text-xs text-kemet-danger mt-1">Currently moving at {{ vehicle.speed }} km/h</p>
                      <p v-else class="text-xs text-kemet-success mt-1">Ready</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-3 p-3 rounded-xl" :class="vehicle.isConnected ? 'bg-kemet-success/10' : 'bg-kemet-danger/10'">
                    <span :class="['material-symbols-outlined', vehicle.isConnected ? 'text-kemet-success' : 'text-kemet-danger']">
                      {{ vehicle.isConnected ? 'check_circle' : 'cancel' }}
                    </span>
                    <div class="flex-1">
                      <span class="text-sm font-medium text-white">Internet connection required</span>
                      <p :class="['text-xs mt-1', vehicle.isConnected ? 'text-kemet-success' : 'text-kemet-danger']">
                        {{ vehicle.isConnected ? 'Connected' : 'No internet connection' }}
                      </p>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-3 p-3 rounded-xl" :class="vehicle.battery > 20 ? 'bg-kemet-success/10' : 'bg-kemet-danger/10'">
                    <span :class="['material-symbols-outlined', vehicle.battery > 20 ? 'text-kemet-success' : 'text-kemet-danger']">
                      {{ vehicle.battery > 20 ? 'check_circle' : 'cancel' }}
                    </span>
                    <div class="flex-1">
                      <span class="text-sm font-medium text-white">Battery level > 20%</span>
                      <p :class="['text-xs mt-1', vehicle.battery > 20 ? 'text-kemet-success' : 'text-kemet-danger']">
                        Current: {{ vehicle.battery }}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Install Button -->
              <div class="flex gap-4">
                <button
                  @click="startUpdate"
                  :disabled="!vehicle.canUpdate || vehicle.isUpdating"
                  :class="[
                    'flex-1 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-elevation-2',
                    vehicle.canUpdate && !vehicle.isUpdating
                      ? 'bg-gradient-kemet hover:shadow-glow-lg text-white'
                      : 'bg-dark-hover text-slate-500 cursor-not-allowed'
                  ]"
                >
                  <span v-if="!vehicle.isUpdating" class="material-symbols-outlined text-2xl">download</span>
                  <span v-else class="material-symbols-outlined text-2xl animate-spin">sync</span>
                  <span v-if="!vehicle.isUpdating">Install Update Now</span>
                  <span v-else>Installing... {{ updateProgress }}%</span>
                </button>

                <button
                  @click="dismissUpdate"
                  :disabled="vehicle.isUpdating"
                  class="px-6 py-4 bg-dark-hover hover:bg-dark-border text-slate-300 rounded-2xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Remind Later
                </button>
              </div>

              <!-- Update Progress -->
              <div v-if="vehicle.isUpdating" class="mt-6 p-4 bg-dark-card/50 rounded-xl">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-white">Installation Progress</span>
                  <span class="text-sm font-bold text-kemet-primary">{{ updateProgress }}%</span>
                </div>
                <div class="w-full bg-dark-bg/50 rounded-full h-3 overflow-hidden">
                  <div
                    class="h-3 bg-gradient-kemet rounded-full transition-all duration-300"
                    :style="{ width: updateProgress + '%' }"
                  ></div>
                </div>
                <p class="text-xs text-slate-400 mt-2">
                  Please do not turn off your vehicle during installation
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- UPDATE HISTORY -->
        <section class="bg-dark-card/40 backdrop-blur-md rounded-2xl shadow-elevation-2 p-6">
          <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-kemet-primary">history</span>
            Update History
          </h3>
          <div class="space-y-3">
            <div
              v-for="update in updateHistory"
              :key="update.id"
              class="p-4 bg-dark-bg/30 rounded-xl hover:bg-dark-hover/30 transition-all"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="p-2 bg-kemet-success/20 rounded-lg">
                    <span class="material-symbols-outlined text-kemet-success">check_circle</span>
                  </div>
                  <div>
                    <p class="font-semibold text-white">v{{ update.version }} - {{ update.name }}</p>
                    <p class="text-sm text-slate-400">{{ update.description }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm text-slate-400">{{ formatDate(update.releaseDate) }}</p>
                  <span class="px-2 py-1 bg-kemet-success/20 text-kemet-success rounded text-xs font-medium">
                    Installed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- SUPPORT INFO -->
        <div class="bg-gradient-to-r from-blue-500/10 to-kemet-primary/10 backdrop-blur-md p-6 rounded-2xl">
          <div class="flex items-start gap-4">
            <span class="material-symbols-outlined text-blue-400 text-3xl">info</span>
            <div>
              <h4 class="font-bold text-white mb-2">Need Help?</h4>
              <p class="text-sm text-slate-300 mb-3">
                Updates are automatically downloaded and ready to install. The installation process takes approximately 10 minutes.
              </p>
              <ul class="text-sm text-slate-400 space-y-1">
                <li>• Your vehicle must be stationary</li>
                <li>• Ensure stable internet connection</li>
                <li>• Battery level should be above 20%</li>
                <li>• Do not interrupt the update process</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- NO VEHICLE SELECTED -->
      <div v-else class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <span class="material-symbols-outlined text-6xl text-slate-600 mb-4">directions_car_filled</span>
          <p class="text-slate-500">Select a vehicle to view available updates</p>
        </div>
      </div>

      <!-- FOOTER -->
      <footer class="mt-auto bg-dark-card/20 backdrop-blur-md shadow-elevation-1">
        <div class="px-8 py-6">
          <div class="flex items-center gap-2 text-xs text-slate-500">
            <div class="p-1.5 bg-kemet-primary/10 rounded-lg">
              <span class="material-symbols-outlined text-kemet-primary text-sm">copyright</span>
            </div>
            <span>2024 VoltaLink Electric • Powered by Kemet Technology</span>
          </div>
        </div>
      </footer>
    </main>

    <!-- SUCCESS MODAL -->
    <div
      v-if="showSuccessModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      @click="showSuccessModal = false"
    >
      <div class="bg-dark-card/90 backdrop-blur-xl rounded-2xl shadow-elevation-3 p-8 max-w-md w-full mx-4">
        <div class="text-center">
          <div class="w-20 h-20 mx-auto mb-6 bg-kemet-success/20 rounded-full flex items-center justify-center">
            <span class="material-symbols-outlined text-kemet-success text-5xl">check_circle</span>
          </div>
          <h3 class="text-2xl font-bold text-white mb-3">Update Successful!</h3>
          <p class="text-slate-300 mb-6">
            Your vehicle has been updated to v{{ vehicle?.firmwareVersion }}
          </p>
          <button
            @click="showSuccessModal = false"
            class="w-full px-6 py-3 bg-gradient-kemet text-white rounded-xl font-semibold"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vehicleService from '../../services/vehicleService';
import fotaService from '../../services/fotaService';

export default {
  name: 'ClientUpdates',

  data() {
    return {
      vehicles: [],
      selectedVehicleId: null,
      vehicle: null,
      updateHistory: [],
      unsubscribe: null,
      updateProgress: 0,
      updateInterval: null,
      showSuccessModal: false
    };
  },

  mounted() {
    vehicleService.connect('ws://localhost:8080');

    this.unsubscribe = vehicleService.subscribe((vehicles) => {
      this.vehicles = vehicles;
      
      if (!this.selectedVehicleId && vehicles.length > 0) {
        this.selectedVehicleId = vehicles[0].id;
      }

      if (this.selectedVehicleId) {
        const previousVersion = this.vehicle?.firmwareVersion;
        this.vehicle = vehicles.find(v => v.id === this.selectedVehicleId);
        
        // Détecter la fin de la mise à jour
        if (previousVersion && this.vehicle && 
            !this.vehicle.isUpdating && 
            this.vehicle.firmwareVersion !== previousVersion) {
          this.onUpdateComplete();
        }
        
        // Gérer la progression de l'update
        if (this.vehicle && this.vehicle.isUpdating && !this.updateInterval) {
          this.startUpdateProgress();
        } else if (this.vehicle && !this.vehicle.isUpdating && this.updateInterval) {
          this.stopUpdateProgress();
        }
      }
    });

    this.loadUpdateHistory();
  },

  beforeUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    this.stopUpdateProgress();
  },

  methods: {
    onVehicleChange() {
      this.vehicle = this.vehicles.find(v => v.id === this.selectedVehicleId);
      this.stopUpdateProgress();
    },

    loadUpdateHistory() {
      this.updateHistory = fotaService.getUpdates().filter(u => u.status === 'deployed');
    },

    startUpdate() {
      if (!this.vehicle || !this.vehicle.canUpdate || this.vehicle.isUpdating) {
        return;
      }

      const success = vehicleService.startUpdate(this.vehicle.id);
      
      if (success) {
        this.startUpdateProgress();
      } else {
        alert('Failed to start update. Please check your connection.');
      }
    },

    dismissUpdate() {
      // Logique pour reporter la mise à jour
      console.log('Update dismissed');
    },

    startUpdateProgress() {
      this.updateProgress = 0;
      this.updateInterval = setInterval(() => {
        if (this.updateProgress < 100) {
          this.updateProgress += 10;
        }
      }, 1000);
    },

    stopUpdateProgress() {
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
        this.updateInterval = null;
        this.updateProgress = 0;
      }
    },

    onUpdateComplete() {
      this.stopUpdateProgress();
      this.showSuccessModal = true;
      this.loadUpdateHistory();
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }
};
</script>
