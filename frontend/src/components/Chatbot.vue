<template>
  <Teleport to="body">
    <div class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999]" style="position: fixed !important;">
    <!-- Chat Button -->
    <button
      v-if="!isOpen"
      @click="isOpen = true"
      class="w-14 h-14 sm:w-16 sm:h-16 bg-kemet-primary rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-white group relative"
    >
      <span class="material-symbols-outlined text-xl sm:text-2xl">smart_toy</span>
      <span
        v-if="hasNewInsights"
        class="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-pulse"
      ></span>
    </button>

    <!-- Chat Window -->
    <div
      v-else
      class="w-[calc(100vw-2rem)] sm:w-96 h-[calc(100vh-8rem)] sm:h-[600px] max-h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700"
    >
      <!-- Header -->
      <div class="glass-topbar p-4 rounded-t-2xl flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-kemet-primary/20 rounded-full flex items-center justify-center">
            <span class="material-symbols-outlined text-kemet-primary">smart_toy</span>
          </div>
          <div>
            <h3 class="text-sm font-bold text-gray-900 dark:text-white transition-colors">AI Assistant</h3>
            <p class="text-xs text-gray-600 dark:text-gray-400 transition-colors">Vehicle Analytics</p>
          </div>
        </div>
        <button
          @click="isOpen = false"
          class="p-2 hover:bg-gray-200/50 dark:hover:bg-white/10 rounded-lg transition-all"
        >
          <span class="material-symbols-outlined text-gray-600 dark:text-gray-400 text-sm">close</span>
        </button>
      </div>

      <!-- Messages -->
      <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
        <!-- Welcome Message -->
        <div v-if="messages.length === 0" class="text-center py-8">
          <div class="w-16 h-16 bg-kemet-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="material-symbols-outlined text-kemet-primary text-3xl">smart_toy</span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 transition-colors mb-2">
            Hello! I'm your AI assistant.
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-500 transition-colors">
            I analyze your vehicle data and provide personalized recommendations.
          </p>
        </div>

        <!-- Message List -->
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="[
            'flex',
            message.role === 'user' ? 'justify-end' : 'justify-start'
          ]"
        >
          <div
            :class="[
              'max-w-[80%] rounded-2xl p-3',
              message.role === 'user'
                ? 'bg-kemet-primary text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
            ]"
          >
            <p class="text-sm whitespace-pre-wrap">{{ message.content }}</p>
            <p class="text-xs mt-1 opacity-70">
              {{ formatTime(message.timestamp) }}
            </p>
          </div>
        </div>

        <!-- Loading Indicator -->
        <div v-if="isLoading" class="flex justify-start">
          <div class="bg-gray-100 dark:bg-gray-700 rounded-2xl p-3">
            <div class="flex gap-1">
              <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0s"></span>
              <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
              <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div v-if="quickActions.length > 0 && messages.length > 0" class="px-4 pb-2">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="(action, index) in quickActions"
            :key="index"
            @click="sendMessage(action)"
            class="px-3 py-1.5 text-xs glass-effect hover:bg-gray-200/50 dark:hover:bg-white/10 rounded-full text-gray-700 dark:text-gray-300 transition-all"
          >
            {{ action }}
          </button>
        </div>
      </div>

      <!-- Input -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700">
        <form @submit.prevent="handleSend" class="flex gap-2">
          <input
            v-model="inputMessage"
            type="text"
            placeholder="Ask me anything..."
            class="flex-1 kemet-input"
            :disabled="isLoading"
          />
          <button
            type="submit"
            :disabled="isLoading || !inputMessage.trim()"
            class="px-4 py-2 bg-kemet-primary text-white rounded-xl hover:bg-kemet-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <span class="material-symbols-outlined text-sm">send</span>
          </button>
        </form>
      </div>
    </div>
    </div>
  </Teleport>
</template>

<script>
import llmService from '../services/llmService';
import vehicleService from '../services/vehicleService';

export default {
  name: 'Chatbot',
  props: {
    vehicleData: {
      type: Object,
      default: () => ({})
    },
    userData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      isOpen: false,
      messages: [],
      inputMessage: '',
      isLoading: false,
      hasNewInsights: false,
      quickActions: [
        'Check battery status',
        'Analyze usage patterns',
        'Get recommendations'
      ]
    };
  },
  mounted() {
    // Charger l'historique si disponible
    const history = llmService.getHistory();
    if (history.length > 0) {
      this.messages = history.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }));
    }

    // Analyser périodiquement les données
    this.startPeriodicAnalysis();
  },
  beforeUnmount() {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
    }
  },
  methods: {
    async handleSend() {
      if (!this.inputMessage.trim() || this.isLoading) return;

      const userMessage = this.inputMessage.trim();
      this.inputMessage = '';
      
      // Ajouter le message utilisateur
      this.messages.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      });

      this.isLoading = true;
      this.scrollToBottom();

      try {
        // Obtenir les données du véhicule en temps réel
        const vehicles = vehicleService.getVehicles();
        const currentVehicle = vehicles.length > 0 ? vehicles[0] : this.vehicleData;

        // Envoyer au service LLM
        const response = await llmService.chat(userMessage, {
          userData: this.userData,
          vehicleData: currentVehicle || this.vehicleData
        });

        // Ajouter la réponse
        this.messages.push({
          role: 'assistant',
          content: response.message,
          timestamp: response.timestamp
        });

        // Si l'analyse détecte des problèmes, notifier
        if (response.analysis.insights.some(i => i.severity === 'high')) {
          this.hasNewInsights = true;
        }
      } catch (error) {
        console.error('Chatbot error:', error);
        this.messages.push({
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date()
        });
      } finally {
        this.isLoading = false;
        this.scrollToBottom();
      }
    },

    sendMessage(message) {
      this.inputMessage = message;
      this.handleSend();
    },

    scrollToBottom() {
      this.$nextTick(() => {
        if (this.$refs.messagesContainer) {
          this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight;
        }
      });
    },

    formatTime(date) {
      return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    async startPeriodicAnalysis() {
      // Analyser toutes les 5 minutes
      this.analysisInterval = setInterval(async () => {
        if (!this.isOpen) {
          const vehicles = vehicleService.getVehicles();
          const currentVehicle = vehicles.length > 0 ? vehicles[0] : this.vehicleData;
          
          if (currentVehicle) {
            const analysis = await llmService.analyzeData(this.userData, currentVehicle);
            if (analysis.insights.some(i => i.severity === 'high')) {
              this.hasNewInsights = true;
            }
          }
        }
      }, 5 * 60 * 1000); // 5 minutes
    }
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.hasNewInsights = false;
        this.scrollToBottom();
      }
    }
  }
};
</script>

<style scoped>
/* Custom scrollbar */
:deep(.overflow-y-auto)::-webkit-scrollbar {
  width: 6px;
}

:deep(.overflow-y-auto)::-webkit-scrollbar-track {
  background: transparent;
}

:deep(.overflow-y-auto)::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.dark :deep(.overflow-y-auto)::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}
</style>
