<template>
  <div class="flex overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
    <main class="flex-1 flex flex-col overflow-y-auto">
      <!-- TOP BAR -->
      <header class="flex items-center justify-between px-8 py-4 border-b border-border-dark sticky top-0 bg-card-dark">
        <h2 class="text-xl font-bold">FOTA Control Center</h2>
        <button
          @click="showUploadModal = true"
          class="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg font-medium transition-all flex items-center gap-2"
        >
          <span class="material-symbols-outlined">upload</span>
          Upload Update
        </button>
      </header>

      <!-- CONTENT -->
      <div class="p-8 space-y-8">
        <!-- Stats -->
        <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div class="bg-card-dark p-6 rounded-2xl border border-border-dark">
            <div class="flex items-center justify-between mb-2">
              <p class="text-slate-400 text-sm">Total Vehicles</p>
              <span class="material-symbols-outlined text-primary">directions_car</span>
            </div>
            <p class="text-3xl font-bold text-white">{{ stats.totalVehicles }}</p>
          </div>

          <div class="bg-card-dark p-6 rounded-2xl border border-border-dark">
            <div class="flex items-center justify-between mb-2">
              <p class="text-slate-400 text-sm">Up to Date</p>
              <span class="material-symbols-outlined text-green-500">check_circle</span>
            </div>
            <p class="text-3xl font-bold text-green-500">{{ stats.upToDate }}</p>
          </div>

          <div class="bg-card-dark p-6 rounded-2xl border border-border-dark">
            <div class="flex items-center justify-between mb-2">
              <p class="text-slate-400 text-sm">Updating</p>
              <span class="material-symbols-outlined text-blue-500">sync</span>
            </div>
            <p class="text-3xl font-bold text-blue-500">{{ stats.updating }}</p>
          </div>

          <div class="bg-card-dark p-6 rounded-2xl border border-border-dark">
            <div class="flex items-center justify-between mb-2">
              <p class="text-slate-400 text-sm">Pending</p>
              <span class="material-symbols-outlined text-yellow-500">pending</span>
            </div>
            <p class="text-3xl font-bold text-yellow-500">{{ stats.pendingUpdate }}</p>
          </div>

          <div class="bg-card-dark p-6 rounded-2xl border border-border-dark">
            <div class="flex items-center justify-between mb-2">
              <p class="text-slate-400 text-sm">Offline</p>
              <span class="material-symbols-outlined text-red-500">cloud_off</span>
            </div>
            <p class="text-3xl font-bold text-red-500">{{ stats.offline }}</p>
          </div>
        </section>

        <!-- Version Distribution -->
        <section class="bg-card-dark rounded-2xl border border-border-dark p-6">
          <h3 class="text-lg font-bold text-white mb-4">Firmware Version Distribution</h3>
          <div class="space-y-3">
            <div
              v-for="(count, version) in stats.versions"
              :key="version"
              class="flex items-center justify-between p-4 bg-background-dark rounded-lg"
            >
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-primary">memory</span>
                <span class="font-medium text-white">v{{ version }}</span>
              </div>
              <div class="flex items-center gap-4">
                <div class="w-48 bg-charcoal-light rounded-full h-2">
                  <div
                    class="bg-primary h-2 rounded-full transition-all"
                    :style="{ width: `${(count / stats.totalVehicles) * 100}%` }"
                  ></div>
                </div>
                <span class="text-slate-400 text-sm font-medium w-16 text-right">
                  {{ count }} / {{ stats.totalVehicles }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- Available Updates -->
        <section class="bg-card-dark rounded-2xl border border-border-dark p-6">
          <h3 class="text-lg font-bold text-white mb-4">Available Updates</h3>
          <div class="space-y-4">
            <div
              v-for="update in updates"
              :key="update.id"
              class="p-4 bg-background-dark rounded-lg border border-border-dark"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h4 class="text-white font-bold">v{{ update.version }}</h4>
                    <span
                      :class="[
                        'px-3 py-1 rounded-full text-xs font-medium',
                        update.status === 'deployed' ? 'bg-green-500/20 text-green-400' :
                        update.status === 'deploying' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-slate-500/20 text-slate-400'
                      ]"
                    >
                      {{ update.status }}
                    </span>
                  </div>
                  <p class="text-slate-300 mb-2">{{ update.name }}</p>
                  <p class="text-sm text-slate-400">{{ update.description }}</p>
                  <div class="flex items-center gap-4 mt-3 text-xs text-slate-500">
                    <span>Released: {{ formatDate(update.releaseDate) }}</span>
                    <span>•</span>
                    <span>{{ update.vehiclesUpdated }} vehicles updated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Vehicle Update Status -->
        <section class="bg-card-dark rounded-2xl border border-border-dark p-6">
          <h3 class="text-lg font-bold text-white mb-4">Vehicle Update Status</h3>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-border-dark">
                  <th class="text-left text-sm font-semibold text-slate-400 pb-3">Vehicle</th>
                  <th class="text-left text-sm font-semibold text-slate-400 pb-3">Current Version</th>
                  <th class="text-left text-sm font-semibold text-slate-400 pb-3">Status</th>
                  <th class="text-left text-sm font-semibold text-slate-400 pb-3">Connection</th>
                  <th class="text-left text-sm font-semibold text-slate-400 pb-3">Update Status</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="vehicle in vehicles"
                  :key="vehicle.id"
                  class="border-b border-border-dark/50 hover:bg-background-dark/50"
                >
                  <td class="py-3 text-white font-medium">{{ vehicle.name }}</td>
                  <td class="py-3 text-slate-300 font-mono text-sm">v{{ vehicle.firmwareVersion }}</td>
                  <td class="py-3">
                    <span :class="getVehicleStatusClass(vehicle)">
                      {{ getVehicleStatusText(vehicle) }}
                    </span>
                  </td>
                  <td class="py-3">
                    <span :class="vehicle.isConnected ? 'text-green-500' : 'text-red-500'" class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-sm">
                        {{ vehicle.isConnected ? 'wifi' : 'wifi_off' }}
                      </span>
                      {{ vehicle.isConnected ? 'Online' : 'Offline' }}
                    </span>
                  </td>
                  <td class="py-3">
                    <div class="flex items-center gap-2">
                      <span v-if="vehicle.isUpdating" class="text-blue-500 flex items-center gap-2">
                        <span class="material-symbols-outlined text-sm animate-spin">sync</span>
                        Installing...
                      </span>
                      <span v-else-if="vehicle.pendingUpdate" class="text-yellow-500 flex items-center gap-2">
                        <span class="material-symbols-outlined text-sm">pending</span>
                        Pending ({{ vehicle.pendingUpdate.version }})
                      </span>
                      <span v-else class="text-green-500 flex items-center gap-2">
                        <span class="material-symbols-outlined text-sm">check_circle</span>
                        Up to date
                      </span>
                      
                      <!-- Bouton pour démarrer la mise à jour -->
                      <button
                        v-if="vehicle.pendingUpdate && !vehicle.isUpdating"
                        @click="startUpdate(vehicle)"
                        :disabled="!vehicle.canUpdate"
                        :class="[
                          'ml-2 px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1',
                          vehicle.canUpdate
                            ? 'bg-blue-500 hover:bg-blue-600 text-white'
                            : 'bg-slate-500/20 text-slate-500 cursor-not-allowed'
                        ]"
                        :title="getUpdateTooltip(vehicle)"
                      >
                        <span class="material-symbols-outlined text-sm">play_arrow</span>
                        Install
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>

    <!-- Upload Modal -->
    <div
      v-if="showUploadModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      @click.self="showUploadModal = false"
    >
      <div class="bg-card-dark rounded-2xl border border-border-dark p-8 max-w-2xl w-full mx-4">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-white">Upload Firmware Update</h3>
          <button
            @click="showUploadModal = false"
            class="p-2 hover:bg-background-dark rounded-lg transition-colors"
          >
            <span class="material-symbols-outlined text-slate-400">close</span>
          </button>
        </div>

        <form @submit.prevent="handleUpload" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Version Number</label>
            <input
              v-model="newUpdate.version"
              type="text"
              placeholder="e.g., 1.1.0"
              class="w-full px-4 py-3 bg-background-dark border border-border-dark rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Update Name</label>
            <input
              v-model="newUpdate.name"
              type="text"
              placeholder="e.g., Performance Improvements"
              class="w-full px-4 py-3 bg-background-dark border border-border-dark rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea
              v-model="newUpdate.description"
              rows="4"
              placeholder="Describe what's new in this update..."
              class="w-full px-4 py-3 bg-background-dark border border-border-dark rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              required
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Firmware File</label>
            <div class="relative">
              <input
                @change="handleFileChange"
                type="file"
                accept=".bin,.hex,.fw"
                class="w-full px-4 py-3 bg-background-dark border border-border-dark rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:cursor-pointer hover:file:bg-primary/80"
                required
              />
            </div>
            <p class="text-xs text-slate-500 mt-2">Accepted formats: .bin, .hex, .fw</p>
          </div>

          <div class="flex gap-4">
            <button
              type="submit"
              :disabled="isUploading"
              class="flex-1 px-6 py-3 bg-primary hover:bg-primary/80 disabled:bg-primary/50 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
            >
              <span v-if="!isUploading">Deploy Update</span>
              <span v-else class="flex items-center gap-2">
                <span class="material-symbols-outlined animate-spin">sync</span>
                Deploying...
              </span>
            </button>
            <button
              type="button"
              @click="showUploadModal = false"
              class="px-6 py-3 bg-background-dark hover:bg-charcoal-light text-slate-300 rounded-lg font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import vehicleService from '../../services/vehicleService';
import fotaService from '../../services/fotaService';

export default {
  name: 'FotaView',

  data() {
    return {
      vehicles: [],
      updates: [],
      stats: {
        totalVehicles: 0,
        upToDate: 0,
        updating: 0,
        pendingUpdate: 0,
        offline: 0,
        versions: {}
      },
      showUploadModal: false,
      isUploading: false,
      newUpdate: {
        version: '',
        name: '',
        description: '',
        file: null
      },
      unsubscribe: null
    };
  },

  mounted() {
    vehicleService.connect('ws://localhost:8080');

    this.unsubscribe = vehicleService.subscribe((vehicles) => {
      this.vehicles = vehicles;
      this.stats = fotaService.getUpdateStats(vehicles);
    });

    this.updates = fotaService.getUpdates();
  },

  beforeUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },

  methods: {
    handleFileChange(event) {
      this.newUpdate.file = event.target.files[0];
    },

    async handleUpload() {
      this.isUploading = true;

      try {
        await fotaService.deployUpdate(this.newUpdate);
        
        this.updates = fotaService.getUpdates();
        this.showUploadModal = false;
        
        // Reset form
        this.newUpdate = {
          version: '',
          name: '',
          description: '',
          file: null
        };
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        this.isUploading = false;
      }
    },

    startUpdate(vehicle) {
      if (!vehicle.canUpdate) {
        return;
      }

      const success = vehicleService.startUpdate(vehicle.id);
      
      if (!success) {
        alert('Failed to start update. Please check connection.');
      }
    },

    getUpdateTooltip(vehicle) {
      if (vehicle.canUpdate) {
        return 'Click to start installation';
      }

      const reasons = [];
      if (vehicle.speed > 0) reasons.push('Vehicle must be stopped');
      if (!vehicle.isConnected) reasons.push('No internet connection');
      if (vehicle.battery <= 20) reasons.push('Battery too low (needs >20%)');

      return `Cannot update: ${reasons.join(', ')}`;
    },

    getVehicleStatusText(vehicle) {
      if (vehicle.speed === 0) return 'Stopped';
      return 'Moving';
    },

    getVehicleStatusClass(vehicle) {
      if (vehicle.speed === 0) return 'text-slate-400';
      return 'text-green-500';
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
