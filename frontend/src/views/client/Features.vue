<template>
  <div class="flex h-screen overflow-hidden bg-dark-bg text-white relative">
    <div class="absolute inset-0 bg-gradient-mesh opacity-20"></div>
    
    <main class="flex-1 flex flex-col overflow-y-auto relative z-10">
      <!-- TOP BAR -->
      <header class="sticky top-0 z-40 flex items-center justify-between px-8 py-4 bg-dark-card/30 backdrop-blur-xl shadow-elevation-1">
        <div class="flex items-center gap-4">
          <h2 class="text-2xl font-bold bg-gradient-to-r from-white via-kemet-primary-light to-kemet-primary bg-clip-text text-transparent">
            Available Features
          </h2>
        </div>

        <!-- Vehicle Selector -->
        <select
          v-model="selectedVehicleId"
          @change="loadVehicleFeatures"
          class="px-4 py-2 bg-dark-card/50 backdrop-blur-md shadow-elevation-1 rounded-xl text-white focus:outline-none focus:shadow-glow transition-all"
        >
          <option v-if="vehicles.length === 0" disabled>No vehicles available</option>
          <option v-for="v in vehicles" :key="v.id" :value="v.id">
            {{ v.name || `Vehicle ${v.id}` }}
          </option>
        </select>
      </header>

      <!-- CONTENT -->
      <div class="p-8 space-y-8">
        <!-- Features by Category -->
        <div v-for="(features, category) in featuresByCategory" :key="category" class="space-y-4">
          <h3 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-kemet-primary">{{ getCategoryIcon(category) }}</span>
            {{ category }}
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="feature in features"
              :key="feature.id"
              class="group relative bg-dark-card/40 backdrop-blur-md rounded-2xl shadow-elevation-2 hover:shadow-glow transition-all duration-300 overflow-hidden"
            >
              <div class="absolute inset-0 bg-gradient-to-br from-kemet-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <!-- Header -->
              <div class="p-6 relative">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <div class="w-14 h-14 bg-gradient-to-br from-kemet-primary/20 to-kemet-accent/20 rounded-xl flex items-center justify-center shadow-glow-sm">
                      <span class="material-symbols-outlined text-kemet-primary text-2xl">{{ feature.icon }}</span>
                    </div>
                    <div>
                      <h4 class="text-lg font-bold text-white">{{ feature.name }}</h4>
                      <p class="text-sm text-kemet-primary-light font-semibold">{{ formatCurrency(feature.price) }}</p>
                    </div>
                  </div>
                  <span
                    v-if="hasFeature(feature.id)"
                    class="px-3 py-1 bg-kemet-success/20 text-kemet-success rounded-full text-xs font-medium flex items-center gap-1"
                  >
                    <span class="material-symbols-outlined text-xs">check_circle</span>
                    Active
                  </span>
                </div>
                <p class="text-sm text-slate-300">{{ feature.description }}</p>
              </div>

              <!-- Action -->
              <div class="p-6 pt-0 relative">
                <button
                  v-if="!hasFeature(feature.id)"
                  @click="openPaymentModal(feature)"
                  class="w-full px-4 py-3 bg-gradient-kemet hover:shadow-glow text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span class="material-symbols-outlined">shopping_cart</span>
                  Subscribe Now
                </button>
                <button
                  v-else
                  disabled
                  class="w-full px-4 py-3 bg-dark-hover text-slate-500 rounded-xl font-semibold cursor-not-allowed flex items-center justify-center gap-2"
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

    <!-- PAYMENT MODAL -->
    <div
      v-if="showPaymentModal"
      class="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
      @click.self="closePaymentModal"
    >
      <div class="bg-dark-card/95 backdrop-blur-xl rounded-3xl shadow-elevation-3 p-8 max-w-md w-full mx-4 border border-dark-border">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-white">Subscribe to {{ selectedFeature?.name }}</h3>
          <button
            @click="closePaymentModal"
            class="p-2 hover:bg-dark-hover rounded-lg transition-colors"
          >
            <span class="material-symbols-outlined text-slate-400">close</span>
          </button>
        </div>

        <!-- Payment Steps -->
        <div v-if="!paymentStarted" class="space-y-6">
          <!-- Feature Summary -->
          <div class="p-5 bg-gradient-to-br from-kemet-primary/10 to-kemet-accent/10 rounded-2xl border border-kemet-primary/20">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-14 h-14 bg-gradient-to-br from-kemet-primary/30 to-kemet-accent/30 rounded-xl flex items-center justify-center">
                <span class="material-symbols-outlined text-kemet-primary text-2xl">{{ selectedFeature?.icon }}</span>
              </div>
              <div>
                <p class="text-white font-bold text-lg">{{ selectedFeature?.name }}</p>
                <p class="text-kemet-primary-light font-bold text-xl">{{ formatCurrency(selectedFeature?.price) }}</p>
              </div>
            </div>
            <p class="text-sm text-slate-300">{{ selectedFeature?.description }}</p>
          </div>

          <!-- Payment Method -->
          <div>
            <label class="block text-sm font-bold text-white mb-3 uppercase tracking-wider">Mobile Money Operator</label>
            <select
              v-model="paymentData.operator"
              class="w-full px-4 py-3 bg-dark-bg/80 backdrop-blur-sm shadow-elevation-1 rounded-xl text-white border border-dark-border focus:outline-none focus:border-kemet-primary transition-all"
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
            <label class="block text-sm font-bold text-white mb-3 uppercase tracking-wider">Phone Number</label>
            <input
              v-model="paymentData.phoneNumber"
              type="tel"
              placeholder="+229XXXXXXXX"
              class="w-full px-4 py-3 bg-dark-bg/80 backdrop-blur-sm shadow-elevation-1 rounded-xl text-white placeholder:text-slate-500 border border-dark-border focus:outline-none focus:border-kemet-primary transition-all"
              required
            />
            <p class="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">info</span>
              Format: +229XXXXXXXX (with country code)
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4">
            <button
              @click="processPayment"
              :disabled="!paymentData.operator || !paymentData.phoneNumber"
              class="flex-1 px-6 py-4 bg-gradient-kemet hover:shadow-glow-lg disabled:bg-dark-hover disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all duration-300 text-lg"
            >
              Pay {{ formatCurrency(selectedFeature?.price) }}
            </button>
            <button
              @click="closePaymentModal"
              class="px-6 py-4 bg-dark-hover hover:bg-dark-border text-slate-300 rounded-xl font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </div>

        <!-- Payment Processing -->
        <div v-else-if="paymentProcessing" class="text-center py-12">
          <div class="w-20 h-20 mx-auto mb-6 relative">
            <div class="absolute inset-0 bg-gradient-kemet rounded-full animate-pulse opacity-50"></div>
            <div class="absolute inset-0 bg-gradient-kemet rounded-full flex items-center justify-center">
              <span class="material-symbols-outlined text-white text-4xl animate-spin">sync</span>
            </div>
          </div>
          <p class="text-white font-bold text-xl mb-3">Processing Payment...</p>
          <p class="text-sm text-slate-400 mb-2">Please check your phone</p>
          <p class="text-xs text-kemet-primary-light">Dial {{ getOperatorCode() }} to confirm</p>
        </div>

        <!-- Payment Success -->
        <div v-else-if="paymentSuccess" class="text-center py-12">
          <div class="w-20 h-20 mx-auto mb-6 bg-kemet-success/20 rounded-full flex items-center justify-center">
            <span class="material-symbols-outlined text-kemet-success text-5xl">check_circle</span>
          </div>
          <p class="text-white font-bold text-2xl mb-3">Payment Successful!</p>
          <p class="text-slate-300 mb-2">{{ selectedFeature?.name }} activated</p>
          <p class="text-sm text-kemet-success mb-8">Feature is now active on your vehicle</p>
          <button
            @click="closePaymentModal"
            class="w-full px-6 py-3 bg-gradient-kemet text-white rounded-xl font-bold text-lg"
          >
            Continue
          </button>
        </div>

        <!-- Payment Failed -->
        <div v-else-if="paymentError" class="text-center py-12">
          <div class="w-20 h-20 mx-auto mb-6 bg-kemet-danger/20 rounded-full flex items-center justify-center">
            <span class="material-symbols-outlined text-kemet-danger text-5xl">error</span>
          </div>
          <p class="text-white font-bold text-2xl mb-3">Payment Failed</p>
          <p class="text-slate-300 mb-8">{{ paymentError }}</p>
          <div class="flex gap-3">
            <button
              @click="resetPayment"
              class="flex-1 px-6 py-3 bg-gradient-kemet text-white rounded-xl font-bold"
            >
              Try Again
            </button>
            <button
              @click="closePaymentModal"
              class="flex-1 px-6 py-3 bg-dark-hover text-slate-300 rounded-xl font-medium"
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

export default {
  name: 'ClientFeatures',

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
    
    vehicleService.connect('ws://localhost:8080');

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
          description: `VoltaLink Feature: ${this.selectedFeature.name}`
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
