<template>
  <div class="space-y-4 sm:space-y-6 lg:space-y-8 p-4 sm:p-6 lg:p-8">
      <!-- TOP BAR -->
    <header class="glass-topbar sticky top-0 z-40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4 rounded-2xl">
        <div class="flex items-center gap-2 sm:gap-4">
        <h2 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-kemet-primary dark:from-white dark:via-kemet-primary-light dark:to-kemet-primary bg-clip-text text-transparent transition-colors">
            Admin Management
          </h2>
        <div class="hidden md:flex items-center gap-2 px-3 py-1.5 glass-effect-primary rounded-full">
            <span class="material-symbols-outlined text-kemet-primary text-sm">shield</span>
            <span class="text-xs text-kemet-primary font-medium">Super Admin Panel</span>
          </div>
        </div>
      <div class="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <button
          @click="showCreateModal = true"
          class="kemet-btn flex items-center gap-2 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2.5 flex-1 sm:flex-initial"
        >
          <span class="material-symbols-outlined text-lg sm:text-xl">person_add</span>
          <span class="hidden sm:inline">Create Admin</span>
          <span class="sm:hidden">Create</span>
        </button>
        <ThemeToggle />
      </div>
      </header>

      <!-- CONTENT -->
    <div class="space-y-4 sm:space-y-6 lg:space-y-8">
        <!-- STATS -->
        <section class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        <div class="glass-card group relative p-4 sm:p-6 rounded-2xl transition-all duration-300 overflow-hidden">
            <div class="relative flex items-start justify-between mb-3">
            <p class="text-gray-600 dark:text-slate-400 text-xs sm:text-sm font-medium transition-colors">Total Admins</p>
            <div class="p-2 sm:p-2.5 glass-card-primary rounded-xl">
                <span class="material-symbols-outlined text-kemet-primary text-lg sm:text-xl">group</span>
            </div>
          </div>
          <p class="relative text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white transition-colors">{{ stats.total }}</p>
          </div>

        <div class="glass-card group relative p-4 sm:p-6 rounded-2xl transition-all duration-300 overflow-hidden">
            <div class="relative flex items-start justify-between mb-3">
            <p class="text-gray-600 dark:text-slate-400 text-xs sm:text-sm font-medium transition-colors">Active</p>
            <div class="p-2 sm:p-2.5 glass-card-primary rounded-xl">
              <span class="material-symbols-outlined text-green-500 text-lg sm:text-xl">check_circle</span>
            </div>
          </div>
          <p class="relative text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white transition-colors">{{ stats.active }}</p>
          </div>

        <div class="glass-card group relative p-4 sm:p-6 rounded-2xl transition-all duration-300 overflow-hidden">
            <div class="relative flex items-start justify-between mb-3">
            <p class="text-gray-600 dark:text-slate-400 text-xs sm:text-sm font-medium transition-colors">Suspended</p>
            <div class="p-2 sm:p-2.5 glass-card-primary rounded-xl">
              <span class="material-symbols-outlined text-yellow-500 text-lg sm:text-xl">block</span>
            </div>
          </div>
          <p class="relative text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white transition-colors">{{ stats.suspended }}</p>
          </div>

        <div class="glass-card group relative p-4 sm:p-6 rounded-2xl transition-all duration-300 overflow-hidden">
            <div class="relative flex items-start justify-between mb-3">
            <p class="text-gray-600 dark:text-slate-400 text-xs sm:text-sm font-medium transition-colors">Countries</p>
            <div class="p-2 sm:p-2.5 glass-card-primary rounded-xl">
              <span class="material-symbols-outlined text-kemet-primary text-lg sm:text-xl">public</span>
            </div>
          </div>
          <p class="relative text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white transition-colors">{{ stats.byCountry ? Object.keys(stats.byCountry).length : 0 }}</p>
          </div>
        </section>

        <!-- FILTERS -->
        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search admins..."
          class="kemet-input flex-1"
          />
          <select
            v-model="filterStatus"
          class="kemet-input"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <!-- ADMIN LIST - Desktop Table -->
      <section class="glass-card rounded-2xl overflow-hidden hidden lg:block">
          <div class="overflow-x-auto">
            <table class="w-full">
            <thead class="glass-topbar">
                <tr>
                <th class="text-left text-sm font-semibold text-gray-600 dark:text-slate-400 px-6 py-4 transition-colors">Admin</th>
                <th class="text-left text-sm font-semibold text-gray-600 dark:text-slate-400 px-6 py-4 transition-colors">Email</th>
                <th class="text-left text-sm font-semibold text-gray-600 dark:text-slate-400 px-6 py-4 transition-colors">Country</th>
                <th class="text-left text-sm font-semibold text-gray-600 dark:text-slate-400 px-6 py-4 transition-colors">Status</th>
                <th class="text-left text-sm font-semibold text-gray-600 dark:text-slate-400 px-6 py-4 transition-colors">Last Login</th>
                <th class="text-left text-sm font-semibold text-gray-600 dark:text-slate-400 px-6 py-4 transition-colors">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredAdmins.length === 0">
                  <td colspan="6" class="px-6 py-12 text-center">
                    <span class="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-600 mb-4 block">group_off</span>
                    <p class="text-gray-600 dark:text-gray-400">No admins found</p>
                  </td>
                </tr>
                <tr
                  v-for="admin in filteredAdmins"
                  :key="admin.id"
                class="group hover:bg-gray-100/50 dark:hover:bg-white/5 transition-all duration-200 glass-effect"
                >
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                    <div class="w-10 h-10 glass-card-primary rounded-full flex items-center justify-center">
                      <span class="text-kemet-primary dark:text-white font-bold text-sm">{{ admin.name.charAt(0) }}</span>
                      </div>
                      <div>
                      <p class="text-gray-900 dark:text-white font-medium transition-colors">{{ admin.name }}</p>
                      <p class="text-xs text-gray-600 dark:text-slate-400 transition-colors">ID: {{ admin.id }}</p>
                      </div>
                    </div>
                  </td>
                <td class="px-6 py-4 text-gray-700 dark:text-gray-300 transition-colors">{{ admin.email }}</td>
                  <td class="px-6 py-4">
                  <span class="kemet-badge bg-kemet-primary/10 text-kemet-primary">
                      {{ admin.country }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span
                      :class="[
                      'kemet-badge',
                      admin.status === 'active' ? 'bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                      ]"
                    >
                      {{ admin.status }}
                    </span>
                  </td>
                <td class="px-6 py-4 text-gray-600 dark:text-slate-400 text-sm transition-colors">
                    {{ admin.lastLogin ? formatDate(admin.lastLogin) : 'Never' }}
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex gap-2">
                      <button
                        @click="editAdmin(admin)"
                      class="p-2 glass-effect hover:bg-gray-200/50 dark:hover:bg-white/10 rounded-lg transition-all"
                        title="Edit"
                      >
                      <span class="material-symbols-outlined text-gray-600 dark:text-gray-400 hover:text-kemet-primary text-sm transition-colors">edit</span>
                      </button>
                      <button
                        @click="toggleAdminStatus(admin)"
                      class="p-2 glass-effect hover:bg-gray-200/50 dark:hover:bg-white/10 rounded-lg transition-all"
                        :title="admin.status === 'active' ? 'Suspend' : 'Activate'"
                      >
                      <span class="material-symbols-outlined text-gray-600 dark:text-gray-400 hover:text-yellow-500 text-sm transition-colors">
                          {{ admin.status === 'active' ? 'block' : 'check_circle' }}
                        </span>
                      </button>
                      <button
                        @click="confirmDelete(admin)"
                      class="p-2 glass-effect hover:bg-gray-200/50 dark:hover:bg-white/10 rounded-lg transition-all"
                        title="Delete"
                      >
                      <span class="material-symbols-outlined text-gray-600 dark:text-gray-400 hover:text-red-500 text-sm transition-colors">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- ADMIN LIST - Mobile Cards -->
        <section class="lg:hidden space-y-4">
          <div
            v-for="admin in filteredAdmins"
            :key="admin.id"
            class="glass-card rounded-2xl p-4 sm:p-6 space-y-4"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 glass-card-primary rounded-full flex items-center justify-center">
                  <span class="text-kemet-primary dark:text-white font-bold">{{ admin.name.charAt(0) }}</span>
                </div>
                <div>
                  <p class="text-gray-900 dark:text-white font-semibold transition-colors">{{ admin.name }}</p>
                  <p class="text-xs text-gray-600 dark:text-slate-400 transition-colors">ID: {{ admin.id }}</p>
                </div>
              </div>
              <span
                :class="[
                  'kemet-badge text-xs',
                  admin.status === 'active' ? 'bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                ]"
              >
                {{ admin.status }}
              </span>
            </div>
            
            <div class="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-gray-600 dark:text-slate-400 text-sm">email</span>
                <span class="text-sm text-gray-700 dark:text-gray-300 transition-colors">{{ admin.email }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-gray-600 dark:text-slate-400 text-sm">public</span>
                <span class="kemet-badge bg-kemet-primary/10 text-kemet-primary text-xs">{{ admin.country }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-gray-600 dark:text-slate-400 text-sm">schedule</span>
                <span class="text-xs text-gray-600 dark:text-slate-400 transition-colors">
                  {{ admin.lastLogin ? formatDate(admin.lastLogin) : 'Never' }}
                </span>
              </div>
            </div>

            <div class="flex gap-2 pt-2">
              <button
                @click="editAdmin(admin)"
                class="flex-1 p-2 glass-effect hover:bg-gray-200/50 dark:hover:bg-white/10 rounded-lg transition-all text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <span class="material-symbols-outlined text-sm mr-1">edit</span>
                Edit
              </button>
              <button
                @click="toggleAdminStatus(admin)"
                class="flex-1 p-2 glass-effect hover:bg-gray-200/50 dark:hover:bg-white/10 rounded-lg transition-all text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <span class="material-symbols-outlined text-sm mr-1">
                  {{ admin.status === 'active' ? 'block' : 'check_circle' }}
                </span>
                {{ admin.status === 'active' ? 'Suspend' : 'Activate' }}
              </button>
              <button
                @click="confirmDelete(admin)"
                class="p-2 glass-effect hover:bg-red-500/20 dark:hover:bg-red-500/20 rounded-lg transition-all text-red-600 dark:text-red-400"
              >
                <span class="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
          </div>
          
          <div v-if="filteredAdmins.length === 0" class="glass-card rounded-2xl p-12 text-center">
            <span class="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-600 mb-4 block">group_off</span>
            <p class="text-gray-600 dark:text-gray-400">No admins found</p>
          </div>
        </section>
      </div>

    <!-- CREATE/EDIT MODAL -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="glass-card-lg rounded-2xl p-4 sm:p-6 lg:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
            {{ editingAdmin ? 'Edit Admin' : 'Create New Admin' }}
          </h3>
          <button
            @click="closeModal"
            class="p-2 glass-effect hover:bg-gray-200/50 dark:hover:bg-white/10 rounded-lg transition-all"
          >
            <span class="material-symbols-outlined text-gray-700 dark:text-slate-400">close</span>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2 transition-colors">Full Name</label>
              <input
                v-model="formData.name"
                type="text"
                placeholder="John Doe"
                class="kemet-input w-full"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2 transition-colors">Email</label>
              <input
                v-model="formData.email"
                type="email"
                placeholder="admin@example.com"
                class="kemet-input w-full"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2 transition-colors">Country</label>
              <select
                v-model="formData.country"
                class="kemet-input w-full"
                required
              >
                <option value="">Select country</option>
                <option value="Benin">Benin</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Ghana">Ghana</option>
                <option value="Kenya">Kenya</option>
                <option value="South Africa">South Africa</option>
                <option value="Senegal">Senegal</option>
                <option value="Ivory Coast">Ivory Coast</option>
                <option value="Egypt">Egypt</option>
                <option value="Morocco">Morocco</option>
              </select>
            </div>

            <div v-if="!editingAdmin">
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2 transition-colors">Password</label>
              <input
                v-model="formData.password"
                type="password"
                placeholder="••••••••"
                class="kemet-input w-full"
                :required="!editingAdmin"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-3 transition-colors">Permissions</label>
            <div class="grid grid-cols-3 gap-3">
              <label
                v-for="perm in ['fleet', 'fota', 'features', 'analytics', 'users', 'settings']"
                :key="perm"
                class="flex items-center gap-2 p-3 glass-effect rounded-lg cursor-pointer hover:bg-gray-200/50 dark:hover:bg-white/10 transition-all"
              >
                <input
                  type="checkbox"
                  :value="perm"
                  v-model="formData.permissions"
                  class="w-4 h-4 text-kemet-primary bg-white dark:bg-gray-800 rounded focus:ring-kemet-primary"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300 capitalize transition-colors">{{ perm }}</span>
              </label>
            </div>
          </div>

          <div class="flex gap-4 pt-4">
            <button
              type="submit"
              class="kemet-btn flex-1"
            >
              {{ editingAdmin ? 'Update Admin' : 'Create Admin' }}
            </button>
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-3 glass-effect hover:bg-gray-200/50 dark:hover:bg-white/10 text-gray-700 dark:text-slate-300 rounded-xl font-medium transition-all"
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
import adminService from '../../services/adminService';
import ThemeToggle from '../../components/ThemeToggle.vue';

export default {
  name: 'AdminsManagement',
  components: {
    ThemeToggle,
  },

  data() {
    return {
      admins: [],
      stats: {
        total: 0,
        active: 0,
        suspended: 0,
        byCountry: {}
      },
      searchQuery: '',
      filterStatus: 'all',
      showCreateModal: false,
      editingAdmin: null,
      formData: {
        name: '',
        email: '',
        country: '',
        password: '',
        permissions: []
      }
    };
  },

  computed: {
    filteredAdmins() {
      let filtered = this.admins;

      if (this.filterStatus !== 'all') {
        filtered = filtered.filter(a => a.status === this.filterStatus);
      }

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(a =>
          a.name.toLowerCase().includes(query) ||
          a.email.toLowerCase().includes(query) ||
          a.country.toLowerCase().includes(query)
        );
      }

      return filtered;
    }
  },

  mounted() {
    this.loadData();
  },

  methods: {
    loadData() {
      this.admins = adminService.getAdmins();
      this.stats = adminService.getStats();
    },

    editAdmin(admin) {
      this.editingAdmin = admin;
      this.formData = {
        name: admin.name,
        email: admin.email,
        country: admin.country,
        permissions: [...admin.permissions]
      };
      this.showCreateModal = true;
    },

    toggleAdminStatus(admin) {
      adminService.toggleStatus(admin.id);
      this.loadData();
    },

    confirmDelete(admin) {
      if (confirm(`Are you sure you want to delete ${admin.name}?`)) {
        adminService.deleteAdmin(admin.id);
        this.loadData();
      }
    },

    handleSubmit() {
      if (this.editingAdmin) {
        adminService.updateAdmin(this.editingAdmin.id, this.formData);
      } else {
        adminService.createAdmin(this.formData);
      }

      this.loadData();
      this.closeModal();
    },

    closeModal() {
      this.showCreateModal = false;
      this.editingAdmin = null;
      this.formData = {
        name: '',
        email: '',
        country: '',
        password: '',
        permissions: []
      };
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
};
</script>
