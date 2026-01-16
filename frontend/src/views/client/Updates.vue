<template>
  <div class="space-y-8 text-gray-900 dark:text-white relative min-h-screen">
    <!-- TOP BAR -->
    <header class="glass-topbar sticky top-0 z-40 flex items-center justify-between px-8 py-4 rounded-2xl">
      <div class="flex items-center gap-4">
        <h2 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-kemet-primary dark:from-white dark:via-kemet-primary-light dark:to-kemet-primary bg-clip-text text-transparent transition-colors">
          Firmware Updates
        </h2>
        <div v-if="vehicle?.pendingUpdate" class="glass-effect-primary flex items-center gap-2 px-3 py-1.5 rounded-full">
          <span class="material-symbols-outlined text-yellow-500 text-sm animate-pulse">update</span>
          <span class="text-xs text-yellow-500 dark:text-yellow-400 font-medium">Update Available</span>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <!-- Vehicle Selector -->
        <select
          v-model="selectedVehicleId"
          @change="onVehicleChange"
          class="kemet-input px-4 py-2"
        >
          <option v-if="vehicles.length === 0" disabled>No vehicles available</option>
          <option v-for="v in vehicles" :key="v.id" :value="v.id">
            {{ v.name || `Vehicle ${v.id}` }}
          </option>
        </select>
      </div>
    </header>

    <!-- CONTENT -->
    <div v-if="vehicle" class="space-y-8">
      <!-- CURRENT FIRMWARE -->
      <section class="glass-card rounded-2xl p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 transition-colors">
              <span class="material-symbols-outlined text-kemet-primary">memory</span>
              Current Firmware
            </h3>
            <p class="text-sm text-gray-600 dark:text-slate-400 mt-1 transition-colors">Installed on your vehicle</p>
          </div>
          <div class="text-right">
            <p class="text-3xl font-bold text-gray-900 dark:text-white font-mono transition-colors">v{{ vehicle.firmwareVersion }}</p>
            <span v-if="!vehicle.pendingUpdate" class="kemet-badge bg-green-500/20 dark:bg-green-500/20 text-green-600 dark:text-green-400 mt-2">
              <span class="material-symbols-outlined text-xs">check_circle</span>
              Up to date
            </span>
          </div>
        </div>
      </section>

      <!-- PENDING UPDATE ALERT -->
      <div
        v-if="vehicle.pendingUpdate"
        class="relative glass-card-primary p-8 rounded-2xl border border-yellow-500/30"
      >
          <div class="flex items-start gap-6">
            <div class="p-4 bg-kemet-warning/20 rounded-2xl backdrop-blur-sm">
              <span class="material-symbols-outlined text-kemet-warning text-4xl">system_update</span>
            </div>
            <div class="flex-1">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
                    New Update Available: v{{ vehicle.pendingUpdate.version }}
                  </h3>
                  <p class="text-lg text-gray-700 dark:text-slate-300 mb-2 transition-colors">{{ vehicle.pendingUpdate.name }}</p>
                  <p class="text-sm text-gray-600 dark:text-slate-400 transition-colors">{{ vehicle.pendingUpdate.description }}</p>
                </div>
              </div>
              
              <!-- Update Requirements -->
              <div class="mb-6 glass-card p-6 rounded-2xl">
                <p class="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2 transition-colors">
                  <span class="material-symbols-outlined text-kemet-primary">checklist</span>
                  Installation Requirements
                </p>
                <div class="space-y-3">
                  <div class="flex items-center gap-3 glass-effect p-3 rounded-xl" :class="vehicle.speed === 0 ? 'border-green-500/30' : 'border-red-500/30'">
                    <span :class="['material-symbols-outlined', vehicle.speed === 0 ? 'text-green-500' : 'text-red-500']">
                      {{ vehicle.speed === 0 ? 'check_circle' : 'cancel' }}
                    </span>
                    <div class="flex-1">
                      <span class="text-sm font-medium text-gray-900 dark:text-white transition-colors">Vehicle must be stopped</span>
                      <p v-if="vehicle.speed > 0" class="text-xs text-red-500 mt-1">Currently moving at {{ vehicle.speed }} km/h</p>
                      <p v-else class="text-xs text-green-500 mt-1">Ready</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-3 glass-effect p-3 rounded-xl" :class="vehicle.isConnected ? 'border-green-500/30' : 'border-red-500/30'">
                    <span :class="['material-symbols-outlined', vehicle.isConnected ? 'text-green-500' : 'text-red-500']">
                      {{ vehicle.isConnected ? 'check_circle' : 'cancel' }}
                    </span>
                    <div class="flex-1">
                      <span class="text-sm font-medium text-gray-900 dark:text-white transition-colors">Internet connection required</span>
                      <p :class="['text-xs mt-1', vehicle.isConnected ? 'text-green-500' : 'text-red-500']">
                        {{ vehicle.isConnected ? 'Connected' : 'No internet connection' }}
                      </p>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-3 glass-effect p-3 rounded-xl" :class="vehicle.battery > 20 ? 'border-green-500/30' : 'border-red-500/30'">
                    <span :class="['material-symbols-outlined', vehicle.battery > 20 ? 'text-green-500' : 'text-red-500']">
                      {{ vehicle.battery > 20 ? 'check_circle' : 'cancel' }}
                    </span>
                    <div class="flex-1">
                      <span class="text-sm font-medium text-gray-900 dark:text-white transition-colors">Battery level > 20%</span>
                      <p :class="['text-xs mt-1', vehicle.battery > 20 ? 'text-green-500' : 'text-red-500']">
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
                    'kemet-btn flex-1 text-lg',
                    !vehicle.canUpdate || vehicle.isUpdating ? 'opacity-50 cursor-not-allowed' : ''
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
                  class="px-6 py-4 glass-effect hover:bg-gray-200/50 dark:hover:bg-white/10 text-gray-700 dark:text-slate-300 rounded-2xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Remind Later
                </button>
              </div>

              <!-- Update Progress -->
              <div v-if="vehicle.isUpdating" class="mt-6 glass-card p-4 rounded-xl">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-900 dark:text-white transition-colors">Installation Progress</span>
                  <span class="text-sm font-bold text-kemet-primary">{{ updateProgress }}%</span>
                </div>
                <div class="w-full bg-white/20 dark:bg-white/5 rounded-full h-3 overflow-hidden">
                  <div
                    class="h-3 bg-kemet-primary rounded-full transition-all duration-300"
                    :style="{ width: updateProgress + '%' }"
                  ></div>
                </div>
                <p class="text-xs text-gray-600 dark:text-slate-400 mt-2 transition-colors">
                  Please do not turn off your vehicle during installation
                </p>
              </div>
            </div>
          </div>
        </div>

      <!-- UPDATE HISTORY -->
      <section class="glass-card rounded-2xl p-6">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 transition-colors">
          <span class="material-symbols-outlined text-kemet-primary">history</span>
          Update History
        </h3>
        <div class="space-y-3">
          <div
            v-for="update in updateHistory"
            :key="update.id"
            class="glass-effect p-4 rounded-xl hover:bg-gray-200/50 dark:hover:bg-white/10 transition-all"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="p-2 glass-card-primary rounded-lg">
                  <span class="material-symbols-outlined text-green-500">check_circle</span>
                </div>
                <div>
                  <p class="font-semibold text-gray-900 dark:text-white transition-colors">v{{ update.version }} - {{ update.name }}</p>
                  <p class="text-sm text-gray-600 dark:text-slate-400 transition-colors">{{ update.description }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-600 dark:text-slate-400 transition-colors">{{ formatDate(update.releaseDate) }}</p>
                <span class="kemet-badge bg-green-500/20 dark:bg-green-500/20 text-green-600 dark:text-green-400">
                  Installed
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SUPPORT INFO -->
      <div class="glass-card-primary p-6 rounded-2xl">
        <div class="flex items-start gap-4">
          <span class="material-symbols-outlined text-blue-500 text-3xl">info</span>
          <div>
            <h4 class="font-bold text-gray-900 dark:text-white mb-2 transition-colors">Need Help?</h4>
            <p class="text-sm text-gray-700 dark:text-slate-300 mb-3 transition-colors">
              Updates are automatically downloaded and ready to install. The installation process takes approximately 10 minutes.
            </p>
            <ul class="text-sm text-gray-600 dark:text-slate-400 space-y-1 transition-colors">
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
    <div v-else class="flex items-center justify-center py-20">
      <div class="text-center">
        <span class="material-symbols-outlined text-6xl text-gray-400 dark:text-slate-600 mb-4 transition-colors">directions_car_filled</span>
        <p class="text-gray-600 dark:text-slate-500 transition-colors">Select a vehicle to view available updates</p>
      </div>
    </div>

    <!-- SUCCESS MODAL -->
    <div
      v-if="showSuccessModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      @click="showSuccessModal = false"
    >
      <div class="glass-card-lg rounded-2xl p-8 max-w-md w-full mx-4">
        <div class="text-center">
          <div class="w-20 h-20 mx-auto mb-6 glass-card-primary rounded-full flex items-center justify-center">
            <span class="material-symbols-outlined text-green-500 text-5xl">check_circle</span>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3 transition-colors">Update Successful!</h3>
          <p class="text-gray-600 dark:text-slate-300 mb-6 transition-colors">
            Your vehicle has been updated to v{{ vehicle?.firmwareVersion }}
          </p>
          <button
            @click="showSuccessModal = false"
            class="kemet-btn w-full"
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
  components: {},

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
