<template>
  <div class="space-y-4 sm:space-y-6 lg:space-y-8 p-4 sm:p-6 lg:p-8">
    <!-- TOP BAR -->
    <header class="glass-topbar sticky top-0 z-40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4 rounded-2xl">
      <div class="flex items-center gap-2 sm:gap-4">
        <h2 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-kemet-primary dark:from-white dark:via-kemet-primary-light dark:to-kemet-primary bg-clip-text text-transparent transition-colors">
          System Logs
        </h2>
        <div class="hidden md:flex items-center gap-2 px-3 py-1.5 glass-effect-primary rounded-full">
          <span class="material-symbols-outlined text-kemet-primary text-sm">list_alt</span>
          <span class="text-xs text-kemet-primary font-medium">Audit Trail</span>
        </div>
      </div>
      <div class="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <button
          @click="exportLogs"
          class="flex-1 sm:flex-initial px-3 sm:px-4 py-2 glass-effect hover:bg-gray-200/50 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm"
        >
          <span class="material-symbols-outlined text-sm">download</span>
          <span class="hidden sm:inline">Export</span>
        </button>
        <button
          @click="clearOldLogs"
          class="flex-1 sm:flex-initial px-3 sm:px-4 py-2 glass-effect hover:bg-red-500/20 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm"
        >
          <span class="material-symbols-outlined text-sm">delete_sweep</span>
          <span class="hidden sm:inline">Clear Old</span>
        </button>
        <ThemeToggle />
      </div>
    </header>

    <!-- STATS -->
    <section class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
      <div class="glass-card p-4 sm:p-6 rounded-2xl">
        <p class="text-[10px] sm:text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold mb-2 transition-colors">Total Logs</p>
        <p class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white transition-colors">{{ stats.total }}</p>
      </div>
      <div class="glass-card p-4 sm:p-6 rounded-2xl">
        <p class="text-[10px] sm:text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold mb-2 transition-colors">Last 24h</p>
        <p class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white transition-colors">{{ stats.last24h }}</p>
      </div>
      <div class="glass-card p-4 sm:p-6 rounded-2xl">
        <p class="text-[10px] sm:text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold mb-2 transition-colors">Errors</p>
        <p class="text-2xl sm:text-3xl font-bold text-red-500">{{ stats.errors }}</p>
      </div>
      <div class="glass-card p-4 sm:p-6 rounded-2xl">
        <p class="text-[10px] sm:text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold mb-2 transition-colors">Warnings</p>
        <p class="text-2xl sm:text-3xl font-bold text-yellow-500">{{ stats.byType.warning }}</p>
      </div>
      <div class="glass-card p-4 sm:p-6 rounded-2xl">
        <p class="text-[10px] sm:text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold mb-2 transition-colors">Success</p>
        <p class="text-2xl sm:text-3xl font-bold text-green-500">{{ stats.byType.success }}</p>
      </div>
    </section>

    <!-- FILTERS -->
    <div class="glass-card p-4 sm:p-6 rounded-2xl">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2 transition-colors">Search</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search logs..."
            class="kemet-input w-full"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2 transition-colors">Type</label>
          <select v-model="filters.type" class="kemet-input w-full">
            <option value="">All Types</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="success">Success</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2 transition-colors">Status</label>
          <select v-model="filters.status" class="kemet-input w-full">
            <option value="">All Status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2 transition-colors">Date From</label>
          <input
            v-model="filters.dateFrom"
            type="date"
            class="kemet-input w-full"
          />
        </div>
      </div>
    </div>

    <!-- LOGS TABLE - Desktop -->
    <section class="glass-card rounded-2xl overflow-hidden hidden lg:block">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="glass-topbar">
            <tr>
              <th class="text-left text-sm font-semibold text-gray-600 dark:text-slate-400 px-6 py-4 transition-colors">Timestamp</th>
              <th class="text-left text-sm font-semibold text-gray-600 dark:text-slate-400 px-6 py-4 transition-colors">Type</th>
              <th class="text-left text-sm font-semibold text-gray-600 dark:text-slate-400 px-6 py-4 transition-colors">Action</th>
              <th class="text-left text-sm font-semibold text-gray-600 dark:text-slate-400 px-6 py-4 transition-colors">User</th>
              <th class="text-left text-sm font-semibold text-gray-600 dark:text-slate-400 px-6 py-4 transition-colors">IP Address</th>
              <th class="text-left text-sm font-semibold text-gray-600 dark:text-slate-400 px-6 py-4 transition-colors">Status</th>
              <th class="text-left text-sm font-semibold text-gray-600 dark:text-slate-400 px-6 py-4 transition-colors">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredLogs.length === 0">
              <td colspan="7" class="px-6 py-12 text-center">
                <span class="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-600 mb-4 block">description</span>
                <p class="text-gray-600 dark:text-gray-400">No logs found</p>
              </td>
            </tr>
            <tr
              v-for="log in filteredLogs"
              :key="log.id"
              class="group hover:bg-gray-100/50 dark:hover:bg-white/5 transition-all duration-200 glass-effect"
            >
              <td class="px-6 py-4 text-gray-600 dark:text-slate-400 text-sm font-mono transition-colors">
                {{ formatDateTime(log.timestamp) }}
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'kemet-badge text-xs font-bold uppercase',
                    getTypeClass(log.type)
                  ]"
                >
                  {{ log.type }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-900 dark:text-white font-medium transition-colors">
                {{ log.action }}
              </td>
              <td class="px-6 py-4 text-gray-700 dark:text-gray-300 transition-colors">
                {{ log.user }}
              </td>
              <td class="px-6 py-4 text-gray-600 dark:text-slate-400 text-sm font-mono transition-colors">
                {{ log.ip }}
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'kemet-badge',
                    log.status === 'success' ? 'bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-red-500/20 text-red-600 dark:text-red-400'
                  ]"
                >
                  {{ log.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-600 dark:text-slate-400 text-sm transition-colors max-w-md truncate">
                {{ log.details }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="glass-topbar px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 dark:border-gray-700">
        <span class="text-xs text-gray-600 dark:text-gray-400 transition-colors">
          Showing {{ currentPageStart }}-{{ currentPageEnd }} of {{ totalLogs }}
        </span>
        <div class="flex gap-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="h-8 w-8 flex items-center justify-center rounded glass-effect hover:bg-gray-200/50 dark:hover:bg-white/10 disabled:opacity-30 transition-all"
          >
            <span class="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="currentPage = page"
            :class="currentPage === page ? 'glass-effect-primary text-kemet-primary dark:text-white' : 'glass-effect text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-white/10'"
            class="h-8 px-3 flex items-center justify-center rounded text-xs font-bold transition-all"
          >
            {{ page }}
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="h-8 w-8 flex items-center justify-center rounded glass-effect hover:bg-gray-200/50 dark:hover:bg-white/10 disabled:opacity-30 transition-all"
          >
            <span class="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </section>

    <!-- LOGS CARDS - Mobile -->
    <section class="lg:hidden space-y-4">
      <div
        v-for="log in filteredLogs"
        :key="log.id"
        class="glass-card rounded-2xl p-4 sm:p-6 space-y-3"
      >
        <div class="flex items-start justify-between gap-2">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span
                :class="[
                  'kemet-badge text-xs font-bold uppercase',
                  getTypeClass(log.type)
                ]"
              >
                {{ log.type }}
              </span>
              <span
                :class="[
                  'kemet-badge text-xs',
                  log.status === 'success' ? 'bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-red-500/20 text-red-600 dark:text-red-400'
                ]"
              >
                {{ log.status }}
              </span>
            </div>
            <p class="text-gray-900 dark:text-white font-semibold transition-colors mb-1">{{ log.action }}</p>
            <p class="text-xs text-gray-600 dark:text-slate-400 font-mono transition-colors">{{ formatDateTime(log.timestamp) }}</p>
          </div>
        </div>
        
        <div class="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-gray-600 dark:text-slate-400 text-sm">person</span>
            <span class="text-sm text-gray-700 dark:text-gray-300 transition-colors">{{ log.user }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-gray-600 dark:text-slate-400 text-sm">dns</span>
            <span class="text-xs text-gray-600 dark:text-slate-400 font-mono transition-colors">{{ log.ip }}</span>
          </div>
          <div v-if="log.details" class="pt-2">
            <p class="text-xs text-gray-600 dark:text-slate-400 transition-colors">{{ log.details }}</p>
          </div>
        </div>
      </div>
      
      <div v-if="filteredLogs.length === 0" class="glass-card rounded-2xl p-12 text-center">
        <span class="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-600 mb-4 block">description</span>
        <p class="text-gray-600 dark:text-gray-400">No logs found</p>
      </div>

      <!-- Mobile Pagination -->
      <div class="glass-card rounded-2xl p-4 flex items-center justify-between">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="h-10 px-4 flex items-center justify-center rounded-lg glass-effect hover:bg-gray-200/50 dark:hover:bg-white/10 disabled:opacity-30 transition-all text-sm font-medium"
        >
          <span class="material-symbols-outlined text-sm mr-1">chevron_left</span>
          Previous
        </button>
        <span class="text-xs text-gray-600 dark:text-gray-400 transition-colors">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="h-10 px-4 flex items-center justify-center rounded-lg glass-effect hover:bg-gray-200/50 dark:hover:bg-white/10 disabled:opacity-30 transition-all text-sm font-medium"
        >
          Next
          <span class="material-symbols-outlined text-sm ml-1">chevron_right</span>
        </button>
      </div>
    </section>
  </div>
</template>

<script>
import logService from '../../services/logService';
import ThemeToggle from '../../components/ThemeToggle.vue';

export default {
  name: 'SystemLogs',
  components: {
    ThemeToggle,
  },
  data() {
    return {
      logs: [],
      stats: {
        total: 0,
        last24h: 0,
        errors: 0,
        byType: {
          info: 0,
          warning: 0,
          error: 0,
          success: 0
        }
      },
      filters: {
        search: '',
        type: '',
        status: '',
        dateFrom: '',
        dateTo: ''
      },
      currentPage: 1,
      itemsPerPage: 20
    };
  },
  computed: {
    filteredLogs() {
      const filtered = logService.getLogs(this.filters);
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return filtered.slice(start, end);
    },
    totalLogs() {
      return logService.getLogs(this.filters).length;
    },
    totalPages() {
      return Math.ceil(this.totalLogs / this.itemsPerPage);
    },
    currentPageStart() {
      return (this.currentPage - 1) * this.itemsPerPage + 1;
    },
    currentPageEnd() {
      return Math.min(this.currentPage * this.itemsPerPage, this.totalLogs);
    },
    visiblePages() {
      const pages = [];
      const maxVisible = 5;
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(this.totalPages, start + maxVisible - 1);
      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    }
  },
  mounted() {
    this.loadData();
  },
  watch: {
    filters: {
      handler() {
        this.currentPage = 1;
      },
      deep: true
    }
  },
  methods: {
    loadData() {
      this.logs = logService.getLogs();
      this.stats = logService.getStats();
    },
    getTypeClass(type) {
      const classes = {
        info: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
        warning: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
        error: 'bg-red-500/20 text-red-600 dark:text-red-400',
        success: 'bg-green-500/20 text-green-600 dark:text-green-400'
      };
      return classes[type] || classes.info;
    },
    formatDateTime(date) {
      return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    exportLogs() {
      const logs = logService.getLogs(this.filters);
      const csv = [
        ['Timestamp', 'Type', 'Action', 'User', 'IP', 'Status', 'Details'],
        ...logs.map(log => [
          this.formatDateTime(log.timestamp),
          log.type,
          log.action,
          log.user,
          log.ip,
          log.status,
          log.details
        ])
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logs_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    },
    clearOldLogs() {
      if (confirm('Are you sure you want to clear logs older than 30 days?')) {
        const remaining = logService.clearOldLogs(30);
        this.loadData();
        alert(`Cleared old logs. ${remaining} logs remaining.`);
      }
    }
  }
};
</script>
