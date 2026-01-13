<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 flex flex-col bg-background-light dark:bg-background-dark border-r border-premium-gray">
      <div class="p-6 flex items-center gap-3">
        <div class="h-10 w-10 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(31,102,173,0.3)]">
          <span class="material-symbols-outlined text-white text-2xl">bolt</span>
        </div>
        <div>
          <h1 class="text-white text-lg font-bold tracking-tight">VoltaLink</h1>
          <p class="text-xs text-premium-gray uppercase tracking-widest font-semibold">Console v2.4</p>
        </div>
      </div>

      <nav class="flex-1 mt-6 px-3 space-y-1">
        <a class="flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors hover:bg-primary/10" href="#">
          <span class="material-symbols-outlined text-primary">dashboard</span>
          <span class="text-white">Dashboard</span>
        </a>
        <a class="flex items-center gap-3 px-4 py-3 rounded text-sm font-medium active-nav" href="#">
          <span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1">group</span>
          <span class="text-white">User Management</span>
        </a>
        <a class="flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors hover:bg-primary/10" href="#">
          <span class="material-symbols-outlined">hub</span>
          <span>Network Nodes</span>
        </a>
        <a class="flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors hover:bg-primary/10" href="#">
          <span class="material-symbols-outlined">analytics</span>
          <span>Analytics</span>
        </a>
        
        <div class="pt-4 pb-2 px-4">
          <p class="text-[10px] font-bold text-premium-gray uppercase tracking-[0.2em]">Configuration</p>
        </div>
        
        <a class="flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors hover:bg-primary/10" href="#">
          <span class="material-symbols-outlined">settings</span>
          <span>System Settings</span>
        </a>
        <a class="flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors hover:bg-primary/10" href="#">
          <span class="material-symbols-outlined">security</span>
          <span>Access Control</span>
        </a>
      </nav>

      <div class="p-4 border-t border-premium-gray">
        <div class="flex items-center gap-3 p-2 rounded bg-brushed-steel/50">
          <div class="h-8 w-8 rounded-full bg-cover bg-center" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDc9NrkfQ_c40tXcOg48Fr7tDsqE04njm_XglwPEgKspNTxoVSgdJtGB8E6e_qcS78IR8aLWEUKqOkQK1ZR_6tpGPxIhngoO1YcVDej22loSDrBB1gfSBOcvP4HGUn0gaZ1Hb7EPDajd627kR0mHH8751gI2LTh5_lC2ZvWtEqSdE0n-PmW9qgG_XzcwYmw_lupSIpsdeMJq2T2BZWt9vJTgtggFlqNxOUhVN47L2Bg7cs_eOjOG9zv4zO0P0uxjLgg4B0580zYUW4')"></div>
          <div class="overflow-hidden">
            <p class="text-xs font-bold text-white truncate">Marcus Thorne</p>
            <p class="text-[10px] text-premium-gray truncate">Super Admin</p>
          </div>
          <span @click="logout" class="material-symbols-outlined text-sm ml-auto cursor-pointer hover:text-red-500 transition-colors">logout</span>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-8">
      <!-- Header Section -->
      <header class="flex flex-wrap items-center justify-between gap-6 mb-10">
        <div>
          <h2 class="text-white text-4xl font-black tracking-[-0.03em] leading-tight">User & Admin Management</h2>
          <p class="text-metallic-silver/60 mt-1 max-w-xl">Provision access levels, monitor authentication cycles, and manage the platform's hierarchical governance.</p>
        </div>
        <button @click="showAddUserModal = true" class="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 shadow-[4px_4px_0px_#144a80] transition-transform active:translate-x-0.5 active:translate-y-0.5">
          <span class="material-symbols-outlined">person_add</span>
          Add New Admin
        </button>
      </header>

      <!-- Control Bar -->
      <div class="bg-brushed-steel dark:bg-[#1a1c1e] p-4 rounded-xl metallic-border flex flex-wrap items-center gap-4 mb-6 shadow-xl">
        <!-- Search -->
        <div class="flex-1 min-w-[300px]">
          <div class="relative group">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-premium-gray group-focus-within:text-primary transition-colors">search</span>
            <input 
              v-model="searchQuery"
              class="w-full bg-background-dark border-premium-gray rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-premium-gray/50 transition-all" 
              placeholder="Filter by identity or email sequence..." 
              type="text"
            />
          </div>
        </div>

        <!-- Filters -->
        <div class="flex items-center gap-2 bg-background-dark p-1 rounded-lg border border-premium-gray/30">
          <button 
            @click="selectedRole = 'all'"
            :class="selectedRole === 'all' ? 'bg-primary text-white' : 'text-metallic-silver hover:bg-white/5'"
            class="px-4 py-1.5 text-xs font-bold rounded"
          >
            All Roles
          </button>
          <button 
            @click="selectedRole = 'admin'"
            :class="selectedRole === 'admin' ? 'bg-primary text-white' : 'text-metallic-silver hover:bg-white/5'"
            class="px-4 py-1.5 text-xs font-bold rounded"
          >
            Admin
          </button>
          <button 
            @click="selectedRole = 'operator'"
            :class="selectedRole === 'operator' ? 'bg-primary text-white' : 'text-metallic-silver hover:bg-white/5'"
            class="px-4 py-1.5 text-xs font-bold rounded"
          >
            Operator
          </button>
          <button 
            @click="selectedRole = 'viewer'"
            :class="selectedRole === 'viewer' ? 'bg-primary text-white' : 'text-metallic-silver hover:bg-white/5'"
            class="px-4 py-1.5 text-xs font-bold rounded"
          >
            Viewer
          </button>
        </div>

        <div class="h-8 w-[1px] bg-premium-gray/30"></div>
        
        <button class="flex items-center gap-2 px-4 py-2 text-xs font-bold text-metallic-silver hover:text-white transition-colors">
          <span class="material-symbols-outlined text-sm">filter_list</span>
          Advanced Filters
        </button>
      </div>

      <!-- Data Grid -->
      <div class="bg-background-dark rounded-xl metallic-border overflow-hidden shadow-2xl relative">
        <!-- Table Header -->
        <div class="grid grid-cols-12 bg-brushed-steel border-b border-premium-gray brushed-texture">
          <div class="col-span-3 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/70">User Name</div>
          <div class="col-span-3 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/70">Email Architecture</div>
          <div class="col-span-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/70 text-center">Security Role</div>
          <div class="col-span-3 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/70">System Heartbeat</div>
          <div class="col-span-1 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/70 text-right">Actions</div>
        </div>

        <!-- Table Body -->
        <div class="divide-y divide-premium-gray/20">
          <div 
            v-for="user in filteredUsers" 
            :key="user.id"
            class="grid grid-cols-12 hover:bg-white/[0.02] transition-colors items-center group"
          >
            <div class="col-span-3 px-6 py-5 flex items-center gap-3">
              <div 
                :class="getRoleBadgeClass(user.role)"
                class="h-9 w-9 rounded flex items-center justify-center border"
              >
                <span :class="getRoleTextClass(user.role)" class="font-bold">{{ user.initials }}</span>
              </div>
              <span class="text-white font-semibold text-sm">{{ user.name }}</span>
            </div>

            <div class="col-span-3 px-6 py-5">
              <span class="text-metallic-silver/70 text-sm font-mono">{{ user.email }}</span>
            </div>

            <div class="col-span-2 px-6 py-5 flex justify-center">
              <span 
                :class="getRolePillClass(user.role)"
                class="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter"
              >
                {{ user.role }}
              </span>
            </div>

            <div class="col-span-3 px-6 py-5">
              <div class="flex flex-col">
                <span class="text-metallic-silver text-sm">{{ user.lastLogin.date }}</span>
                <span class="text-premium-gray text-[10px] font-mono">{{ user.lastLogin.time }}</span>
              </div>
            </div>

            <div class="col-span-1 px-6 py-5 text-right">
              <button class="material-symbols-outlined text-premium-gray hover:text-white transition-colors cursor-pointer">
                settings_ethernet
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="bg-brushed-steel/30 px-6 py-4 flex items-center justify-between border-t border-premium-gray/20">
          <span class="text-xs text-premium-gray">
            Displaying <span class="text-white font-bold">{{ currentPageStart }}-{{ currentPageEnd }}</span> of 
            <span class="text-white font-bold">{{ totalUsers }}</span> identities in system
          </span>
          <div class="flex gap-2">
            <button 
              @click="prevPage"
              :disabled="currentPage === 1"
              class="h-8 w-8 flex items-center justify-center rounded border border-premium-gray/50 text-metallic-silver hover:bg-white/5 disabled:opacity-30"
            >
              <span class="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button 
              v-for="page in visiblePages" 
              :key="page"
              @click="currentPage = page"
              :class="currentPage === page ? 'border-primary bg-primary/10 text-white' : 'border-premium-gray/50 text-metallic-silver hover:bg-white/5'"
              class="h-8 px-3 flex items-center justify-center rounded border text-xs font-bold"
            >
              {{ page }}
            </button>
            <button 
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="h-8 w-8 flex items-center justify-center rounded border border-premium-gray/50 text-metallic-silver hover:bg-white/5 disabled:opacity-30"
            >
              <span class="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <!-- System Status Summary -->
      <div class="mt-8 grid grid-cols-4 gap-6">
        <div class="bg-brushed-steel/40 p-5 rounded-lg metallic-border">
          <p class="text-[10px] uppercase tracking-widest text-premium-gray font-bold mb-1">Total Privileged Nodes</p>
          <div class="flex items-end justify-between">
            <span class="text-2xl font-black text-white">42</span>
            <span class="text-[10px] text-emerald-500 font-bold">+2 this week</span>
          </div>
        </div>
        <div class="bg-brushed-steel/40 p-5 rounded-lg metallic-border">
          <p class="text-[10px] uppercase tracking-widest text-premium-gray font-bold mb-1">Active Sessions</p>
          <div class="flex items-end justify-between">
            <span class="text-2xl font-black text-white">12</span>
            <div class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse mb-2"></div>
          </div>
        </div>
        <div class="bg-brushed-steel/40 p-5 rounded-lg metallic-border">
          <p class="text-[10px] uppercase tracking-widest text-premium-gray font-bold mb-1">Failed Auth attempts</p>
          <div class="flex items-end justify-between">
            <span class="text-2xl font-black text-white">0</span>
            <span class="text-[10px] text-premium-gray font-bold">All clear</span>
          </div>
        </div>
        <div class="bg-brushed-steel/40 p-5 rounded-lg metallic-border">
          <p class="text-[10px] uppercase tracking-widest text-premium-gray font-bold mb-1">Database Sync</p>
          <div class="flex items-end justify-between">
            <span class="text-2xl font-black text-white">99.9%</span>
            <span class="material-symbols-outlined text-primary text-xl">sync_saved_locally</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'SuperAdminDashboard',
  data() {
    return {
      searchQuery: '',
      selectedRole: 'all',
      currentPage: 1,
      itemsPerPage: 5,
      showAddUserModal: false,
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
        admin: 'bg-primary/20 border-primary/30',
        operator: 'bg-emerald-500/20 border-emerald-500/30',
        viewer: 'bg-amber-500/20 border-amber-500/30'
      }
      return classes[role] || classes.viewer
    },
    getRoleTextClass(role) {
      const classes = {
        admin: 'text-primary',
        operator: 'text-emerald-500',
        viewer: 'text-amber-500'
      }
      return classes[role] || classes.viewer
    },
    getRolePillClass(role) {
      const classes = {
        admin: 'bg-primary/10 text-primary border-primary/20',
        operator: 'bg-white/5 text-metallic-silver border-premium-gray/30',
        viewer: 'bg-white/5 text-metallic-silver border-premium-gray/30'
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
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.brushed-texture {
  background-image: linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 4px 100%;
}

.metallic-border {
  border: 1px solid #494c4f;
}

.active-nav {
  background: linear-gradient(90deg, rgba(31, 102, 173, 0.2) 0%, rgba(31, 102, 173, 0) 100%);
  border-left: 3px solid #1f66ad;
}
</style>