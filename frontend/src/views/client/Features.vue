<template>
  <div class="space-y-8 text-gray-900 dark:text-white relative min-h-screen">
    <!-- TOP BAR -->
    <header class="glass-topbar sticky top-0 z-40 flex items-center justify-between px-8 py-4 rounded-2xl">
      <div class="flex items-center gap-4">
        <h2 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-kemet-primary dark:from-white dark:via-kemet-primary-light dark:to-kemet-primary bg-clip-text text-transparent transition-colors">
          Available Features
        </h2>
      </div>

      <div class="flex items-center gap-4">
        <!-- Vehicle Selector -->
        <select
          v-model="selectedVehicleId"
          @change="loadVehicleFeatures"
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
    <div class="space-y-8">
      <!-- Features by Category -->
      <div v-for="(features, category) in featuresByCategory" :key="category" class="space-y-4">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 transition-colors">
          <span class="material-symbols-outlined text-kemet-primary">{{ getCategoryIcon(category) }}</span>
          {{ category }}
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="feature in features"
            :key="feature.id"
            class="group relative glass-card overflow-hidden transition-all duration-300"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-kemet-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <!-- Header -->
            <div class="p-6 relative">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-14 h-14 glass-card-primary rounded-xl flex items-center justify-center">
                    <span class="material-symbols-outlined text-kemet-primary dark:text-white text-2xl">{{ feature.icon }}</span>
                  </div>
                  <div>
                    <h4 class="text-lg font-bold text-gray-900 dark:text-white transition-colors">{{ feature.name }}</h4>
                    <p class="text-sm text-kemet-primary font-semibold">{{ formatCurrency(feature.price) }}</p>
                  </div>
                </div>
                <span
                  v-if="hasFeature(feature.id)"
                  class="kemet-badge bg-green-500/20 dark:bg-green-500/20 text-green-600 dark:text-green-400"
                >
                  <span class="material-symbols-outlined text-xs">check_circle</span>
                  Active
                </span>
              </div>
              <p class="text-sm text-gray-600 dark:text-slate-300 transition-colors">{{ feature.description }}</p>
            </div>

            <!-- Action -->
            <div class="p-6 pt-0 relative">
              <button
                v-if="!hasFeature(feature.id)"
                @click="openPaymentModal(feature)"
                class="kemet-btn w-full"
              >
                <span class="material-symbols-outlined">shopping_cart</span>
                Subscribe Now
              </button>
              <button
                v-else
                disabled
                class="w-full px-4 py-3 glass-effect text-gray-500 dark:text-slate-500 rounded-xl font-semibold cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span class="material-symbols-outlined">check_circle</span>
                Already Subscribed
              </button>
            </div>

            <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-kemet-primary/30 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- PAYMENT MODAL -->
    <div
      v-if="showPaymentModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="closePaymentModal"
    >
      <div class="glass-card-lg rounded-3xl p-8 max-w-md w-full mx-4">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white transition-colors">Subscribe to {{ selectedFeature?.name }}</h3>
          <button
            @click="closePaymentModal"
            class="p-2 glass-effect hover:bg-gray-200/50 dark:hover:bg-white/10 rounded-lg transition-all"
          >
            <span class="material-symbols-outlined text-gray-700 dark:text-slate-400">close</span>
          </button>
        </div>

        <!-- Payment Steps -->
        <div v-if="!paymentStarted" class="space-y-6">
          <!-- Feature Summary -->
          <div class="glass-card-primary p-5 rounded-2xl">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-14 h-14 glass-card-primary rounded-xl flex items-center justify-center">
                <span class="material-symbols-outlined text-kemet-primary dark:text-white text-2xl">{{ selectedFeature?.icon }}</span>
              </div>
              <div>
                <p class="text-gray-900 dark:text-white font-bold text-lg transition-colors">{{ selectedFeature?.name }}</p>
                <p class="text-kemet-primary font-bold text-xl">{{ formatCurrency(selectedFeature?.price) }}</p>
              </div>
            </div>
            <p class="text-sm text-gray-600 dark:text-slate-300 transition-colors">{{ selectedFeature?.description }}</p>
          </div>

          <!-- Payment Method -->
          <div>
            <label class="block text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wider transition-colors">Mobile Money Operator</label>
            <select
              v-model="paymentData.operator"
              class="kemet-input w-full"
              required
            >
              <option value="" disabled>Select your operator</option>
              <option v-for="op in mobileMoneyOperators" :key="op.id" :value="op.id">
                {{ op.name }} ({{ op.code }})
              </option>
            </select>
          </div>

          <!-- Phone Number -->
          <div>
            <label class="block text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wider transition-colors">Phone Number</label>
            <input
              v-model="paymentData.phoneNumber"
              type="tel"
              placeholder="+229XXXXXXXX"
              class="kemet-input w-full"
              required
            />
            <p class="text-xs text-gray-500 dark:text-slate-400 mt-2 flex items-center gap-1 transition-colors">
              <span class="material-symbols-outlined text-sm">info</span>
              Format: +229XXXXXXXX (with country code)
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4">
            <button
              @click="processPayment"
              :disabled="!paymentData.operator || !paymentData.phoneNumber"
              class="kemet-btn flex-1 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              Pay {{ formatCurrency(selectedFeature?.price) }}
            </button>
            <button
              @click="closePaymentModal"
              class="px-6 py-4 glass-effect hover:bg-gray-200/50 dark:hover:bg-white/10 text-gray-700 dark:text-slate-300 rounded-xl font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </div>

        <!-- Payment Processing -->
        <div v-else-if="paymentProcessing" class="text-center py-12">
          <div class="w-20 h-20 mx-auto mb-6 relative">
            <div class="absolute inset-0 bg-kemet-primary rounded-full animate-pulse opacity-50"></div>
            <div class="absolute inset-0 bg-kemet-primary rounded-full flex items-center justify-center">
              <span class="material-symbols-outlined text-white text-4xl animate-spin">sync</span>
            </div>
          </div>
          <p class="text-gray-900 dark:text-white font-bold text-xl mb-3 transition-colors">Processing Payment...</p>
          <p class="text-sm text-gray-600 dark:text-slate-400 mb-2 transition-colors">Please check your phone</p>
          <p class="text-xs text-kemet-primary transition-colors">Dial {{ getOperatorCode() }} to confirm</p>
        </div>

        <!-- Payment Success -->
        <div v-else-if="paymentSuccess" class="text-center py-12">
          <div class="w-20 h-20 mx-auto mb-6 glass-card-primary rounded-full flex items-center justify-center">
            <span class="material-symbols-outlined text-green-500 text-5xl">check_circle</span>
          </div>
          <p class="text-gray-900 dark:text-white font-bold text-2xl mb-3 transition-colors">Payment Successful!</p>
          <p class="text-gray-600 dark:text-slate-300 mb-2 transition-colors">{{ selectedFeature?.name }} activated</p>
          <p class="text-sm text-green-500 mb-8">Feature is now active on your vehicle</p>
          <button
            @click="closePaymentModal"
            class="kemet-btn w-full text-lg"
          >
            Continue
          </button>
        </div>

        <!-- Payment Failed -->
        <div v-else-if="paymentError" class="text-center py-12">
          <div class="w-20 h-20 mx-auto mb-6 glass-effect border-red-500/30 rounded-full flex items-center justify-center">
            <span class="material-symbols-outlined text-red-500 text-5xl">error</span>
          </div>
          <p class="text-gray-900 dark:text-white font-bold text-2xl mb-3 transition-colors">Payment Failed</p>
          <p class="text-gray-600 dark:text-slate-300 mb-8 transition-colors">{{ paymentError }}</p>
          <div class="flex gap-3">
            <button
              @click="resetPayment"
              class="kemet-btn flex-1"
            >
              Try Again
            </button>
            <button
              @click="closePaymentModal"
              class="flex-1 px-6 py-3 glass-effect hover:bg-gray-200/50 dark:hover:bg-white/10 text-gray-700 dark:text-slate-300 rounded-xl font-medium transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import featureService from '../../services/featureService';
import momoService from '../../services/momoService';
import vehicleService from '../../services/vehicleService';
import { WS_URL } from '../../config/env.js';

export default {
  name: 'ClientFeatures',
  components: {},

  data() {
    return {
      features: [],
      featuresByCategory: {},
      vehicles: [],
      selectedVehicleId: null,
      vehicleFeatures: [],
      showPaymentModal: false,
      selectedFeature: null,
      paymentData: {
        operator: '',
        phoneNumber: ''
      },
      mobileMoneyOperators: [],
      paymentStarted: false,
      paymentProcessing: false,
      paymentSuccess: false,
      paymentError: null,
      unsubscribe: null
    };
  },

  mounted() {
    this.loadData();
    
    vehicleService.connect(WS_URL);

    this.unsubscribe = vehicleService.subscribe((vehicles) => {
      this.vehicles = vehicles;
      
      if (!this.selectedVehicleId && vehicles.length > 0) {
        this.selectedVehicleId = vehicles[0].id;
        this.loadVehicleFeatures();
      }
    });
  },

  beforeUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },

  methods: {
    loadData() {
      this.features = featureService.getFeatures();
      this.featuresByCategory = featureService.getFeaturesByCategory();
      this.mobileMoneyOperators = momoService.getSupportedOperators();
    },

    loadVehicleFeatures() {
      if (this.selectedVehicleId) {
        this.vehicleFeatures = featureService.getVehicleFeatures(this.selectedVehicleId);
      }
    },

    hasFeature(featureId) {
      return this.vehicleFeatures.includes(featureId);
    },

    openPaymentModal(feature) {
      if (!this.selectedVehicleId) {
        alert('Please select a vehicle first');
        return;
      }

      this.selectedFeature = feature;
      this.showPaymentModal = true;
    },

    async processPayment() {
      this.paymentStarted = true;
      this.paymentProcessing = true;
      this.paymentError = null;

      try {
        const activation = await featureService.activateFeature(
          this.selectedVehicleId,
          this.selectedFeature.id,
          this.paymentData.operator
        );

        const transaction = await momoService.initiatePayment({
          phoneNumber: this.paymentData.phoneNumber,
          amount: this.selectedFeature.price,
          operator: this.paymentData.operator,
          description: `KemetLink Feature: ${this.selectedFeature.name}`
        });

        const checkStatus = setInterval(async () => {
          const status = await momoService.checkTransactionStatus(transaction.id);

          if (status.status === 'completed') {
            clearInterval(checkStatus);
            
            await featureService.confirmActivation(activation.id);

            vehicleService.activateFeature(
              this.selectedVehicleId,
              this.selectedFeature.id
            );

            this.paymentProcessing = false;
            this.paymentSuccess = true;
            
            setTimeout(() => {
              this.loadVehicleFeatures();
            }, 1500);

          } else if (status.status === 'failed' || status.status === 'expired' || status.status === 'cancelled') {
            clearInterval(checkStatus);
            featureService.cancelActivation(activation.id);
            this.paymentProcessing = false;
            this.paymentError = status.error?.message || 'Payment failed';
          }
        }, 2000);

        setTimeout(() => {
          clearInterval(checkStatus);
          if (this.paymentProcessing) {
            featureService.cancelActivation(activation.id);
            this.paymentProcessing = false;
            this.paymentError = 'Payment timeout. Please try again.';
          }
        }, 120000);

      } catch (error) {
        this.paymentProcessing = false;
        this.paymentError = error.message;
      }
    },

    getOperatorCode() {
      const operator = this.mobileMoneyOperators.find(op => op.id === this.paymentData.operator);
      return operator?.code || '*XXX#';
    },

    resetPayment() {
      this.paymentStarted = false;
      this.paymentProcessing = false;
      this.paymentSuccess = false;
      this.paymentError = null;
    },

    closePaymentModal() {
      this.showPaymentModal = false;
      this.selectedFeature = null;
      this.resetPayment();
      this.paymentData = {
        operator: '',
        phoneNumber: ''
      };
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
