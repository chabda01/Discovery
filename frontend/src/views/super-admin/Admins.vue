<template>
  <div class="flex h-screen overflow-hidden bg-dark-bg text-white relative">
    <div class="absolute inset-0 bg-gradient-mesh opacity-20"></div>
    
    <main class="flex-1 flex flex-col overflow-y-auto relative z-10">
      <!-- TOP BAR -->
      <header class="sticky top-0 z-40 flex items-center justify-between px-8 py-4 bg-dark-card/30 backdrop-blur-xl shadow-elevation-1">
        <div class="flex items-center gap-4">
          <h2 class="text-2xl font-bold bg-gradient-to-r from-white via-kemet-primary-light to-kemet-primary bg-clip-text text-transparent">
            Admin Management
          </h2>
          <div class="hidden md:flex items-center gap-2 px-3 py-1.5 bg-kemet-primary/10 backdrop-blur-sm rounded-full shadow-inner-glow">
            <span class="material-symbols-outlined text-kemet-primary text-sm">shield</span>
            <span class="text-xs text-kemet-primary font-medium">Super Admin Panel</span>
          </div>
        </div>
        <button
          @click="showCreateModal = true"
          class="px-5 py-2.5 bg-gradient-kemet hover:shadow-glow text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-elevation-2"
        >
          <span class="material-symbols-outlined">person_add</span>
          Create Admin
        </button>
      </header>

      <!-- CONTENT -->
      <div class="p-8 space-y-8">
        <!-- STATS -->
        <section class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="group relative bg-dark-card/40 backdrop-blur-md p-6 rounded-2xl shadow-elevation-2 hover:shadow-glow transition-all duration-300 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-kemet-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="absolute top-0 right-0 w-32 h-32 bg-kemet-primary/10 rounded-full blur-3xl"></div>
            <div class="relative flex items-start justify-between mb-3">
              <p class="text-slate-400 text-sm font-medium">Total Admins</p>
              <div class="p-2.5 bg-kemet-primary/20 backdrop-blur-sm rounded-xl shadow-glow-sm">
                <span class="material-symbols-outlined text-kemet-primary">group</span>
              </div>
            </div>
            <p class="relative text-4xl font-bold text-white">{{ stats.total }}</p>
          </div>

          <div class="group relative bg-dark-card/40 backdrop-blur-md p-6 rounded-2xl shadow-elevation-2 hover:shadow-glow transition-all duration-300 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-kemet-success/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="relative flex items-start justify-between mb-3">
              <p class="text-slate-400 text-sm font-medium">Active</p>
              <div class="p-2.5 bg-kemet-success/20 backdrop-blur-sm rounded-xl shadow-glow-sm">
                <span class="material-symbols-outlined text-kemet-success">check_circle</span>
              </div>
            </div>
            <p class="relative text-4xl font-bold text-white">{{ stats.active }}</p>
          </div>

          <div class="group relative bg-dark-card/40 backdrop-blur-md p-6 rounded-2xl shadow-elevation-2 hover:shadow-glow transition-all duration-300 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-kemet-warning/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="relative flex items-start justify-between mb-3">
              <p class="text-slate-400 text-sm font-medium">Suspended</p>
              <div class="p-2.5 bg-kemet-warning/20 backdrop-blur-sm rounded-xl shadow-glow-sm">
                <span class="material-symbols-outlined text-kemet-warning">block</span>
              </div>
            </div>
            <p class="relative text-4xl font-bold text-white">{{ stats.suspended }}</p>
          </div>

          <div class="group relative bg-dark-card/40 backdrop-blur-md p-6 rounded-2xl shadow-elevation-2 hover:shadow-glow transition-all duration-300 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-kemet-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="relative flex items-start justify-between mb-3">
              <p class="text-slate-400 text-sm font-medium">Countries</p>
              <div class="p-2.5 bg-kemet-accent/20 backdrop-blur-sm rounded-xl shadow-glow-sm">
                <span class="material-symbols-outlined text-kemet-accent">public</span>
              </div>
            </div>
            <p class="relative text-4xl font-bold text-white">{{ Object.keys(stats.byCountry).length }}</p>
          </div>
        </section>

        <!-- FILTERS -->
        <div class="flex gap-4 items-center">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search admins..."
            class="flex-1 px-4 py-3 bg-dark-card/40 backdrop-blur-md shadow-elevation-1 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:shadow-glow transition-all"
          />
          <select
            v-model="filterStatus"
            class="px-4 py-3 bg-dark-card/40 backdrop-blur-md shadow-elevation-1 rounded-xl text-white focus:outline-none focus:shadow-glow transition-all"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <!-- ADMIN LIST -->
        <section class="bg-dark-card/40 backdrop-blur-md rounded-2xl shadow-elevation-2 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-dark-card/50">
                <tr>
                  <th class="text-left text-sm font-semibold text-slate-400 px-6 py-4">Admin</th>
                  <th class="text-left text-sm font-semibold text-slate-400 px-6 py-4">Email</th>
                  <th class="text-left text-sm font-semibold text-slate-400 px-6 py-4">Country</th>
                  <th class="text-left text-sm font-semibold text-slate-400 px-6 py-4">Status</th>
                  <th class="text-left text-sm font-semibold text-slate-400 px-6 py-4">Last Login</th>
                  <th class="text-left text-sm font-semibold text-slate-400 px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="admin in filteredAdmins"
                  :key="admin.id"
                  class="group hover:bg-dark-hover/30 transition-all duration-200"
                >
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-gradient-kemet rounded-full flex items-center justify-center shadow-glow-sm">
                        <span class="text-white font-bold text-sm">{{ admin.name.charAt(0) }}</span>
                      </div>
                      <div>
                        <p class="text-white font-medium">{{ admin.name }}</p>
                        <p class="text-xs text-slate-400">ID: {{ admin.id }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-slate-300">{{ admin.email }}</td>
                  <td class="px-6 py-4">
                    <span class="px-3 py-1 bg-kemet-primary/10 text-kemet-primary-light rounded-lg text-sm font-medium">
                      {{ admin.country }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span
                      :class="[
                        'px-3 py-1 rounded-lg text-sm font-medium backdrop-blur-sm',
                        admin.status === 'active' ? 'bg-kemet-success/20 text-kemet-success' : 'bg-kemet-warning/20 text-kemet-warning'
                      ]"
                    >
                      {{ admin.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-slate-400 text-sm">
                    {{ admin.lastLogin ? formatDate(admin.lastLogin) : 'Never' }}
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex gap-2">
                      <button
                        @click="editAdmin(admin)"
                        class="p-2 hover:bg-kemet-primary/10 rounded-lg transition-all group/btn"
                        title="Edit"
                      >
                        <span class="material-symbols-outlined text-slate-400 group-hover/btn:text-kemet-primary text-sm">edit</span>
                      </button>
                      <button
                        @click="toggleAdminStatus(admin)"
                        class="p-2 hover:bg-kemet-warning/10 rounded-lg transition-all group/btn"
                        :title="admin.status === 'active' ? 'Suspend' : 'Activate'"
                      >
                        <span class="material-symbols-outlined text-slate-400 group-hover/btn:text-kemet-warning text-sm">
                          {{ admin.status === 'active' ? 'block' : 'check_circle' }}
                        </span>
                      </button>
                      <button
                        @click="confirmDelete(admin)"
                        class="p-2 hover:bg-kemet-danger/10 rounded-lg transition-all group/btn"
                        title="Delete"
                      >
                        <span class="material-symbols-outlined text-slate-400 group-hover/btn:text-kemet-danger text-sm">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
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

    <!-- CREATE/EDIT MODAL -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="bg-dark-card/90 backdrop-blur-xl rounded-2xl shadow-elevation-3 p-8 max-w-2xl w-full mx-4">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-white">
            {{ editingAdmin ? 'Edit Admin' : 'Create New Admin' }}
          </h3>
          <button
            @click="closeModal"
            class="p-2 hover:bg-dark-hover rounded-lg transition-colors"
          >
            <span class="material-symbols-outlined text-slate-400">close</span>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <input
                v-model="formData.name"
                type="text"
                placeholder="John Doe"
                class="w-full px-4 py-3 bg-dark-bg/50 backdrop-blur-sm shadow-elevation-1 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:shadow-glow transition-all"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                v-model="formData.email"
                type="email"
                placeholder="admin@example.com"
                class="w-full px-4 py-3 bg-dark-bg/50 backdrop-blur-sm shadow-elevation-1 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:shadow-glow transition-all"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Country</label>
              <select
                v-model="formData.country"
                class="w-full px-4 py-3 bg-dark-bg/50 backdrop-blur-sm shadow-elevation-1 rounded-xl text-white focus:outline-none focus:shadow-glow transition-all"
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
              <label class="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input
                v-model="formData.password"
                type="password"
                placeholder="••••••••"
                class="w-full px-4 py-3 bg-dark-bg/50 backdrop-blur-sm shadow-elevation-1 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:shadow-glow transition-all"
                :required="!editingAdmin"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-3">Permissions</label>
            <div class="grid grid-cols-3 gap-3">
              <label
                v-for="perm in ['fleet', 'fota', 'features', 'analytics', 'users', 'settings']"
                :key="perm"
                class="flex items-center gap-2 p-3 bg-dark-bg/30 rounded-lg cursor-pointer hover:bg-dark-hover/30 transition-all"
              >
                <input
                  type="checkbox"
                  :value="perm"
                  v-model="formData.permissions"
                  class="w-4 h-4 text-kemet-primary bg-dark-bg rounded focus:ring-kemet-primary"
                />
                <span class="text-sm text-slate-300 capitalize">{{ perm }}</span>
              </label>
            </div>
          </div>

          <div class="flex gap-4 pt-4">
            <button
              type="submit"
              class="flex-1 px-6 py-3 bg-gradient-kemet hover:shadow-glow text-white rounded-xl font-semibold transition-all duration-300 shadow-elevation-2"
            >
              {{ editingAdmin ? 'Update Admin' : 'Create Admin' }}
            </button>
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-3 bg-dark-hover hover:bg-dark-border text-slate-300 rounded-xl font-medium transition-all"
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

export default {
  name: 'AdminsManagement',

  data() {
    return {
      admins: [],
      stats: {},
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
