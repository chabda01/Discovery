<template>
  <div class="space-y-4 sm:space-y-6 lg:space-y-8 p-3 sm:p-4 lg:p-6 xl:p-8">
    <!-- Header Section -->
    <header class="glass-topbar flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 lg:gap-6 px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 rounded-2xl">
        <div class="flex-1 min-w-0">
        <h2 class="text-gray-900 dark:text-white text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black tracking-[-0.03em] leading-tight transition-colors break-words">User & Admin Management</h2>
        <p class="text-gray-600 dark:text-slate-400 mt-1 max-w-xl text-xs sm:text-sm lg:text-base transition-colors break-words">Provision access levels, monitor authentication cycles, and manage the platform's hierarchical governance.</p>
      </div>
      <div class="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        <ThemeToggle />
      </div>
      </header>

      <!-- Control Bar -->
    <div class="glass-card flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl w-full overflow-hidden">
        <!-- Search -->
        <div class="w-full min-w-0">
          <div class="relative group">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400 group-focus-within:text-kemet-primary transition-colors pointer-events-none">search</span>
            <input 
              v-model="searchQuery"
            class="kemet-input w-full pl-10 pr-3 min-w-0"
              placeholder="Filter by identity or email..." 
              type="text"
            />
          </div>
        </div>

        <!-- Filters Row -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
          <!-- Filters -->
          <div class="flex items-center gap-1.5 sm:gap-2 glass-effect p-1 rounded-lg overflow-x-auto flex-1 min-w-0">
            <button 
              @click="selectedRole = 'all'"
            :class="selectedRole === 'all' ? 'glass-effect-primary text-kemet-primary dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-white/10'"
            class="px-2.5 sm:px-3 lg:px-4 py-1.5 text-[10px] sm:text-xs font-bold rounded transition-all whitespace-nowrap flex-shrink-0"
            >
              All Roles
            </button>
            <button 
              @click="selectedRole = 'admin'"
            :class="selectedRole === 'admin' ? 'glass-effect-primary text-kemet-primary dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-white/10'"
            class="px-2.5 sm:px-3 lg:px-4 py-1.5 text-[10px] sm:text-xs font-bold rounded transition-all whitespace-nowrap flex-shrink-0"
            >
              Admin
            </button>
            <button 
              @click="selectedRole = 'operator'"
            :class="selectedRole === 'operator' ? 'glass-effect-primary text-kemet-primary dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-white/10'"
            class="px-2.5 sm:px-3 lg:px-4 py-1.5 text-[10px] sm:text-xs font-bold rounded transition-all whitespace-nowrap flex-shrink-0"
            >
              Operator
            </button>
            <button 
              @click="selectedRole = 'viewer'"
            :class="selectedRole === 'viewer' ? 'glass-effect-primary text-kemet-primary dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-white/10'"
            class="px-2.5 sm:px-3 lg:px-4 py-1.5 text-[10px] sm:text-xs font-bold rounded transition-all whitespace-nowrap flex-shrink-0"
            >
              Viewer
            </button>
          </div>

          <div class="hidden sm:block h-8 w-[1px] bg-gray-300 dark:bg-gray-700 flex-shrink-0"></div>
          
          <button class="flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 lg:px-4 py-2 text-[10px] sm:text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap flex-shrink-0">
            <span class="material-symbols-outlined text-xs sm:text-sm">filter_list</span>
            <span class="hidden sm:inline">Advanced Filters</span>
            <span class="sm:hidden">Filters</span>
          </button>
        </div>
      </div>

      <!-- Data Grid - Desktop -->
    <div class="glass-card rounded-xl overflow-hidden hidden lg:block w-full">
        <!-- Table Header -->
      <div class="grid grid-cols-12 glass-topbar border-b border-gray-200 dark:border-gray-700 min-w-full">
        <div class="col-span-3 px-3 xl:px-6 py-3 xl:py-4 text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 min-w-0">User Name</div>
        <div class="col-span-3 px-3 xl:px-6 py-3 xl:py-4 text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 min-w-0">Email Architecture</div>
        <div class="col-span-2 px-3 xl:px-6 py-3 xl:py-4 text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 text-center min-w-0">Security Role</div>
        <div class="col-span-3 px-3 xl:px-6 py-3 xl:py-4 text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 min-w-0">System Heartbeat</div>
        <div class="col-span-1 px-3 xl:px-6 py-3 xl:py-4 text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 text-right min-w-0">Actions</div>
        </div>

        <!-- Table Body -->
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <div 
            v-for="user in paginatedUsers" 
            :key="user.id"
          class="grid grid-cols-12 hover:bg-gray-100/50 dark:hover:bg-white/5 transition-colors items-center group glass-effect min-w-full"
          >
            <div class="col-span-3 px-3 xl:px-6 py-3 xl:py-5 flex items-center gap-2 xl:gap-3 min-w-0">
              <div 
                :class="getRoleBadgeClass(user.role)"
                class="h-8 w-8 xl:h-9 xl:w-9 rounded flex items-center justify-center border flex-shrink-0"
              >
                <span :class="getRoleTextClass(user.role)" class="font-bold text-xs xl:text-sm">{{ user.initials }}</span>
              </div>
            <span class="text-gray-900 dark:text-white font-semibold text-xs xl:text-sm transition-colors truncate min-w-0">{{ user.name }}</span>
            </div>

            <div class="col-span-3 px-3 xl:px-6 py-3 xl:py-5 min-w-0">
            <span class="text-gray-600 dark:text-gray-400 text-xs xl:text-sm font-mono transition-colors truncate block">{{ user.email }}</span>
            </div>

            <div class="col-span-2 px-3 xl:px-6 py-3 xl:py-5 flex justify-center min-w-0">
              <span 
                :class="getRolePillClass(user.role)"
              class="kemet-badge inline-flex items-center px-2 xl:px-2.5 py-0.5 rounded text-[9px] xl:text-[10px] font-bold uppercase tracking-tighter whitespace-nowrap"
              >
                {{ user.role }}
              </span>
            </div>

            <div class="col-span-3 px-3 xl:px-6 py-3 xl:py-5 min-w-0">
              <div class="flex flex-col">
              <span class="text-gray-700 dark:text-gray-300 text-xs xl:text-sm transition-colors truncate">{{ user.lastLogin.date }}</span>
              <span class="text-gray-500 dark:text-gray-500 text-[9px] xl:text-[10px] font-mono transition-colors truncate">{{ user.lastLogin.time }}</span>
              </div>
            </div>

            <div class="col-span-1 px-3 xl:px-6 py-3 xl:py-5 text-right min-w-0">
            <button class="material-symbols-outlined text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer text-base xl:text-lg">
                settings_ethernet
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
      <div class="glass-topbar px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border-t border-gray-200 dark:border-gray-700">
        <span class="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 transition-colors text-center sm:text-left break-words">
          Displaying <span class="text-gray-900 dark:text-white font-bold transition-colors">{{ currentPageStart }}-{{ currentPageEnd }}</span> of 
          <span class="text-gray-900 dark:text-white font-bold transition-colors">{{ totalUsers }}</span> identities
          </span>
          <div class="flex gap-1.5 sm:gap-2 flex-wrap justify-center">
            <button 
              @click="prevPage"
              :disabled="currentPage === 1"
            class="h-7 sm:h-8 w-7 sm:w-8 flex items-center justify-center rounded glass-effect hover:bg-gray-200/50 dark:hover:bg-white/10 disabled:opacity-30 transition-all flex-shrink-0"
            >
              <span class="material-symbols-outlined text-xs sm:text-sm">chevron_left</span>
            </button>
            <button 
              v-for="page in visiblePages" 
              :key="page"
              @click="currentPage = page"
            :class="currentPage === page ? 'glass-effect-primary text-kemet-primary dark:text-white' : 'glass-effect text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-white/10'"
            class="h-7 sm:h-8 px-2 sm:px-3 flex items-center justify-center rounded text-[10px] sm:text-xs font-bold transition-all flex-shrink-0"
            >
              {{ page }}
            </button>
            <button 
              @click="nextPage"
              :disabled="currentPage === totalPages"
            class="h-7 sm:h-8 w-7 sm:w-8 flex items-center justify-center rounded glass-effect hover:bg-gray-200/50 dark:hover:bg-white/10 disabled:opacity-30 transition-all flex-shrink-0"
            >
              <span class="material-symbols-outlined text-xs sm:text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Data Grid - Mobile Cards -->
      <div class="lg:hidden space-y-3 sm:space-y-4 w-full">
        <div
          v-for="user in paginatedUsers"
          :key="user.id"
          class="glass-card rounded-xl p-3 sm:p-4 space-y-3 w-full overflow-hidden"
        >
          <div class="flex items-center justify-between gap-2 w-full">
            <div class="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div
                :class="getRoleBadgeClass(user.role)"
                class="h-9 w-9 sm:h-10 sm:w-10 rounded flex items-center justify-center border flex-shrink-0"
              >
                <span :class="getRoleTextClass(user.role)" class="font-bold text-xs sm:text-sm">{{ user.initials }}</span>
              </div>
              <div class="flex-1 min-w-0 overflow-hidden">
                <p class="text-gray-900 dark:text-white font-semibold text-xs sm:text-sm transition-colors truncate">{{ user.name }}</p>
                <p class="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 font-mono transition-colors truncate">{{ user.email }}</p>
              </div>
            </div>
            <span
              :class="getRolePillClass(user.role)"
              class="kemet-badge inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[9px] sm:text-[10px] font-bold uppercase flex-shrink-0"
            >
              {{ user.role }}
            </span>
          </div>
          <div class="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-1">
            <p class="text-[10px] sm:text-xs text-gray-600 dark:text-slate-400 transition-colors">Last Login</p>
            <p class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 transition-colors truncate">{{ user.lastLogin.date }}</p>
            <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500 font-mono transition-colors truncate">{{ user.lastLogin.time }}</p>
          </div>
        </div>
        
        <!-- Mobile Pagination -->
        <div class="glass-card rounded-xl p-3 sm:p-4 flex items-center justify-between gap-2 w-full">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="h-9 sm:h-10 px-3 sm:px-4 flex items-center justify-center rounded-lg glass-effect hover:bg-gray-200/50 dark:hover:bg-white/10 disabled:opacity-30 transition-all text-xs sm:text-sm font-medium flex-shrink-0"
          >
            <span class="material-symbols-outlined text-xs sm:text-sm mr-1">chevron_left</span>
            <span class="hidden sm:inline">Previous</span>
            <span class="sm:hidden">Prev</span>
          </button>
          <span class="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 transition-colors text-center flex-1">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="h-9 sm:h-10 px-3 sm:px-4 flex items-center justify-center rounded-lg glass-effect hover:bg-gray-200/50 dark:hover:bg-white/10 disabled:opacity-30 transition-all text-xs sm:text-sm font-medium flex-shrink-0"
          >
            <span class="hidden sm:inline">Next</span>
            <span class="sm:hidden">Next</span>
            <span class="material-symbols-outlined text-xs sm:text-sm ml-1">chevron_right</span>
          </button>
        </div>
      </div>

      <!-- System Status Summary -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 w-full">
      <div class="glass-card p-3 sm:p-4 lg:p-5 rounded-lg min-w-0 overflow-hidden">
        <p class="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold mb-1 sm:mb-2 transition-colors break-words">Total Privileged Nodes</p>
          <div class="flex items-end justify-between gap-1">
          <span class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white transition-colors flex-shrink-0">42</span>
          <span class="text-[9px] sm:text-[10px] text-green-500 font-bold flex-shrink-0">+2 this week</span>
        </div>
      </div>
      <div class="glass-card p-3 sm:p-4 lg:p-5 rounded-lg min-w-0 overflow-hidden">
        <p class="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold mb-1 sm:mb-2 transition-colors break-words">Active Sessions</p>
          <div class="flex items-end justify-between gap-1">
          <span class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white transition-colors flex-shrink-0">12</span>
          <div class="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-green-500 animate-pulse mb-1 sm:mb-2 flex-shrink-0"></div>
        </div>
      </div>
      <div class="glass-card p-3 sm:p-4 lg:p-5 rounded-lg min-w-0 overflow-hidden">
        <p class="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold mb-1 sm:mb-2 transition-colors break-words">Failed Auth attempts</p>
          <div class="flex items-end justify-between gap-1">
          <span class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white transition-colors flex-shrink-0">0</span>
          <span class="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 font-bold transition-colors flex-shrink-0">All clear</span>
        </div>
      </div>
      <div class="glass-card p-3 sm:p-4 lg:p-5 rounded-lg min-w-0 overflow-hidden">
        <p class="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold mb-1 sm:mb-2 transition-colors break-words">Database Sync</p>
          <div class="flex items-end justify-between gap-1">
          <span class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white transition-colors flex-shrink-0">99.9%</span>
          <span class="material-symbols-outlined text-kemet-primary text-base sm:text-lg lg:text-xl flex-shrink-0">sync_saved_locally</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ThemeToggle from '../../components/ThemeToggle.vue';

export default {
  name: 'SuperAdminDashboard',
  components: {
    ThemeToggle,
  },
  data() {
    return {
      searchQuery: '',
      selectedRole: 'all',
      currentPage: 1,
      itemsPerPage: 5,
      users: [
        {
          id: 1,
          name: 'Alex Rivera',
          initials: 'AR',
          email: 'alex.r@voltalink.com',
          role: 'admin',
          lastLogin: { date: 'Oct 24, 2023', time: '09:15:42 AM GMT-4' }
        },
        {
          id: 2,
          name: 'Jordan Smith',
          initials: 'JS',
          email: 'j.smith@voltalink.com',
          role: 'operator',
          lastLogin: { date: 'Oct 23, 2023', time: '04:45:11 PM GMT-4' }
        },
        {
          id: 3,
          name: 'Casey Chen',
          initials: 'CC',
          email: 'casey.c@voltalink.com',
          role: 'viewer',
          lastLogin: { date: 'Oct 22, 2023', time: '11:20:05 AM GMT-4' }
        },
        {
          id: 4,
          name: 'Morgan Taylor',
          initials: 'MT',
          email: 'm.taylor@voltalink.com',
          role: 'operator',
          lastLogin: { date: 'Oct 21, 2023', time: '08:30:59 AM GMT-4' }
        },
        {
          id: 5,
          name: 'Riley Vogt',
          initials: 'RV',
          email: 'r.vogt@voltalink.com',
          role: 'admin',
          lastLogin: { date: 'Oct 20, 2023', time: '02:10:33 PM GMT-4' }
        }
      ]
    }
  },
  computed: {
    filteredUsers() {
      let filtered = this.users

      // Filtrer par rôle
      if (this.selectedRole !== 'all') {
        filtered = filtered.filter(user => user.role === this.selectedRole)
      }

      // Filtrer par recherche
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(user => 
          user.name.toLowerCase().includes(query) || 
          user.email.toLowerCase().includes(query)
        )
      }

      return filtered
    },
    totalUsers() {
      return this.filteredUsers.length
    },
    totalPages() {
      return Math.ceil(this.totalUsers / this.itemsPerPage)
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredUsers.slice(start, end)
    },
    currentPageStart() {
      return (this.currentPage - 1) * this.itemsPerPage + 1
    },
    currentPageEnd() {
      return Math.min(this.currentPage * this.itemsPerPage, this.totalUsers)
    },
    visiblePages() {
      const pages = []
      for (let i = 1; i <= Math.min(3, this.totalPages); i++) {
        pages.push(i)
      }
      return pages
    }
  },
  methods: {
    getRoleBadgeClass(role) {
      const classes = {
        admin: 'bg-kemet-primary/20 border-kemet-primary/30',
        operator: 'bg-green-500/20 border-green-500/30',
        viewer: 'bg-yellow-500/20 border-yellow-500/30'
      }
      return classes[role] || classes.viewer
    },
    getRoleTextClass(role) {
      const classes = {
        admin: 'text-kemet-primary',
        operator: 'text-green-500',
        viewer: 'text-yellow-500'
      }
      return classes[role] || classes.viewer
    },
    getRolePillClass(role) {
      const classes = {
        admin: 'bg-kemet-primary/10 text-kemet-primary border-kemet-primary/20',
        operator: 'bg-gray-200/50 dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600',
        viewer: 'bg-gray-200/50 dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
      }
      return classes[role] || classes.viewer
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },
    logout() {
      localStorage.removeItem('authToken')
      sessionStorage.removeItem('authToken')
      this.$router.push('/')
    }
  }
}
</script>
