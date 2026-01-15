<template>
  <div class="flex overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
    <main class="flex-1 flex flex-col overflow-y-auto">
      <!-- TOP BAR -->
      <header class="flex items-center justify-between px-8 py-4 border-b border-border-dark sticky top-0 bg-card-dark">
        <h2 class="text-xl font-bold">Features Catalog</h2>
        <button
          @click="showCreateModal = true"
          class="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg font-medium transition-all flex items-center gap-2"
        >
          <span class="material-symbols-outlined">add</span>
          Create Feature
        </button>
      </header>

      <!-- CONTENT -->
      <div class="p-8 space-y-8">
        <!-- Stats -->
        <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-card-dark p-6 rounded-2xl border border-border-dark">
            <div class="flex items-center justify-between mb-2">
              <p class="text-slate-400 text-sm">Total Features</p>
              <span class="material-symbols-outlined text-primary">auto_awesome</span>
            </div>
            <p class="text-3xl font-bold text-white">{{ stats.totalFeatures }}</p>
          </div>

          <div class="bg-card-dark p-6 rounded-2xl border border-border-dark">
            <div class="flex items-center justify-between mb-2">
              <p class="text-slate-400 text-sm">Total Activations</p>
              <span class="material-symbols-outlined text-green-500">check_circle</span>
            </div>
            <p class="text-3xl font-bold text-green-500">{{ stats.totalActivations }}</p>
          </div>

          <div class="bg-card-dark p-6 rounded-2xl border border-border-dark">
            <div class="flex items-center justify-between mb-2">
              <p class="text-slate-400 text-sm">Pending</p>
              <span class="material-symbols-outlined text-yellow-500">pending</span>
            </div>
            <p class="text-3xl font-bold text-yellow-500">{{ stats.pendingActivations }}</p>
          </div>

          <div class="bg-card-dark p-6 rounded-2xl border border-border-dark">
            <div class="flex items-center justify-between mb-2">
              <p class="text-slate-400 text-sm">Total Revenue</p>
              <span class="material-symbols-outlined text-blue-500">payments</span>
            </div>
            <p class="text-2xl font-bold text-white">{{ formatCurrency(stats.totalRevenue) }}</p>
          </div>
        </section>

        <!-- Features by Category -->
        <div v-for="(features, category) in featuresByCategory" :key="category" class="space-y-4">
          <h3 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">{{ getCategoryIcon(category) }}</span>
            {{ category }}
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="feature in features"
              :key="feature.id"
              class="bg-card-dark rounded-2xl border border-border-dark overflow-hidden hover:border-primary/50 transition-all"
            >
              <!-- Header -->
              <div class="p-6 border-b border-border-dark">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span class="material-symbols-outlined text-primary text-2xl">{{ feature.icon }}</span>
                    </div>
                    <div>
                      <h4 class="text-lg font-bold text-white">{{ feature.name }}</h4>
                      <p class="text-sm text-slate-400">{{ formatCurrency(feature.price) }}</p>
                    </div>
                  </div>
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-medium',
                      feature.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    ]"
                  >
                    {{ feature.active ? 'Active' : 'Inactive' }}
                  </span>
                </div>
                <p class="text-sm text-slate-300">{{ feature.description }}</p>
              </div>

              <!-- Stats -->
              <div class="p-6 space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-slate-400">Activations</span>
                  <span class="text-lg font-bold text-white">
                    {{ stats.activationsByFeature[feature.id] || 0 }}
                  </span>
                </div>

                <div v-if="feature.subscription" class="flex justify-between items-center">
                  <span class="text-sm text-slate-400">Type</span>
                  <span class="text-sm font-medium text-blue-400 capitalize">
                    {{ feature.subscription }}
                  </span>
                </div>

                <div v-if="feature.requiresApproval" class="flex items-center gap-2 text-yellow-500 text-xs">
                  <span class="material-symbols-outlined text-sm">warning</span>
                  <span>Requires Approval</span>
                </div>

                <!-- Actions -->
                <div class="flex gap-2 pt-3">
                  <button
                    @click="editFeature(feature)"
                    class="flex-1 px-4 py-2 bg-background-dark hover:bg-charcoal-light text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <span class="material-symbols-outlined text-sm">edit</span>
                    Edit
                  </button>
                  <button
                    @click="toggleFeatureStatus(feature)"
                    :class="[
                      'flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2',
                      feature.active
                        ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
                        : 'bg-green-500/10 hover:bg-green-500/20 text-green-400'
                    ]"
                  >
                    <span class="material-symbols-outlined text-sm">
                      {{ feature.active ? 'block' : 'check_circle' }}
                    </span>
                    {{ feature.active ? 'Disable' : 'Enable' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      @click.self="closeCreateModal"
    >
      <div class="bg-card-dark rounded-2xl border border-border-dark p-8 max-w-2xl w-full mx-4">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-white">
            {{ editingFeature ? 'Edit Feature' : 'Create New Feature' }}
          </h3>
          <button
            @click="closeCreateModal"
            class="p-2 hover:bg-background-dark rounded-lg transition-colors"
          >
            <span class="material-symbols-outlined text-slate-400">close</span>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Feature Name</label>
              <input
                v-model="formData.name"
                type="text"
                placeholder="e.g., Autopilot"
                class="w-full px-4 py-3 bg-background-dark border border-border-dark rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <select
                v-model="formData.category"
                class="w-full px-4 py-3 bg-background-dark border border-border-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="Driving">Driving</option>
                <option value="Connectivity">Connectivity</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Comfort">Comfort</option>
                <option value="Performance">Performance</option>
                <option value="Security">Security</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea
              v-model="formData.description"
              rows="3"
              placeholder="Describe the feature..."
              class="w-full px-4 py-3 bg-background-dark border border-border-dark rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              required
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Price (XOF)</label>
              <input
                v-model.number="formData.price"
                type="number"
                min="0"
                step="100"
                placeholder="5000"
                class="w-full px-4 py-3 bg-background-dark border border-border-dark rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Icon</label>
              <input
                v-model="formData.icon"
                type="text"
                placeholder="auto_mode"
                class="w-full px-4 py-3 bg-background-dark border border-border-dark rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div class="flex gap-4">
            <button
              type="submit"
              class="flex-1 px-6 py-3 bg-primary hover:bg-primary/80 text-white rounded-lg font-medium transition-all"
            >
              {{ editingFeature ? 'Update Feature' : 'Create Feature' }}
            </button>
            <button
              type="button"
              @click="closeCreateModal"
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
import featureService from '../../services/featureService';

export default {
  name: 'FeaturesView',

  data() {
    return {
      features: [],
      featuresByCategory: {},
      stats: {
        totalFeatures: 0,
        totalActivations: 0,
        pendingActivations: 0,
        totalRevenue: 0,
        activationsByFeature: {}
      },
      showCreateModal: false,
      editingFeature: null,
      formData: {
        name: '',
        description: '',
        price: 0,
        icon: '',
        category: 'Driving'
      }
    };
  },

  mounted() {
    this.loadData();
  },

  methods: {
    loadData() {
      this.features = featureService.getFeatures();
      this.featuresByCategory = featureService.getFeaturesByCategory();
      this.stats = featureService.getStats();
    },

    getCategoryIcon(category) {
      const icons = {
        'Driving': 'directions_car',
        'Connectivity': 'wifi',
        'Entertainment': 'music_note',
        'Comfort': 'airline_seat_recline_extra',
        'Performance': 'speed',
        'Security': 'shield'
      };
      return icons[category] || 'auto_awesome';
    },

    editFeature(feature) {
      this.editingFeature = feature;
      this.formData = { ...feature };
      this.showCreateModal = true;
    },

    toggleFeatureStatus(feature) {
      if (feature.active) {
        featureService.deactivateFeature(feature.id);
      } else {
        featureService.updateFeature(feature.id, { active: true });
      }
      this.loadData();
    },

    handleSubmit() {
      if (this.editingFeature) {
        featureService.updateFeature(this.editingFeature.id, this.formData);
      } else {
        featureService.createFeature(this.formData);
      }
      this.loadData();
      this.closeCreateModal();
    },

    closeCreateModal() {
      this.showCreateModal = false;
      this.editingFeature = null;
      this.formData = {
        name: '',
        description: '',
        price: 0,
        icon: '',
        category: 'Driving'
      };
    },

    formatCurrency(amount) {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0
      }).format(amount);
    }
  }
};
</script>
