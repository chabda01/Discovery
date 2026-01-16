<template>
  <div class="flex h-screen w-full flex-col lg:flex-row overflow-hidden">
    <!-- Section gauche: Visuel EV -->
    <div
      class="relative hidden lg:flex h-full w-full lg:w-1/2 overflow-hidden bg-black"
    >
      <div
        class="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
        style="
          background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAg__-ZpNYAkVK6g-2nJaOr6lFoAUjT9oX_nXGZfUykd35ypgo7ah6Qw-VxkMwsx0ICfjax2uvZE787gdTuy9Vcp6rI3a193RA8oBu1hnEJYM0uoe0uAt6rzbewEfOxCR6Kbb0Oz8X9CsVoMYsr81NKgujDaNYm85DznoiwibYvkObkqohLmyf2DitcHDNsDGroieLeznzxWXBKIs08v1MLchh05NpanbM3s9kozW7D98a3KFeqQKcOOjYyRrANedsUgsQgZ-YZ07I');
        "
      ></div>

      <!-- Overlay Glow -->
      <div class="absolute inset-0 bg-gradient-mesh opacity-30"></div>

      <!-- Branding -->
      <div
        class="relative z-10 flex flex-col justify-between p-12 h-full w-full"
      >
        <div class="flex flex-col items-center gap-4">
          <span class="text-2xl font-bold tracking-[0.2em] uppercase text-white"
            >KemetLink</span
          >
        </div>

        <div class="max-w-md">
          <h2 class="text-5xl font-bold leading-tight mb-4 text-white drop-shadow-lg">
            Precision <br/>Engineering. <br/>Infinite Range
          </h2>
        </div>

        <div
          class="flex ml-16 gap-24 text-sm font-medium text-white/80 uppercase tracking-widest"
        >
          <span class="font-bold">Performance</span>
          <span class="font-bold">Safety</span>
          <span class="font-bold">Connectivity</span>
        </div>
      </div>
    </div>

    <!-- Section droite: Formulaire de connexion -->
    <div
      class="flex flex-1 flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 lg:px-24 bg-white dark:bg-black relative transition-colors duration-300 overflow-y-auto"
    >
      <!-- Animated Background -->
      <AnimatedBackground />
      
      <!-- Background Pattern -->
      <div class="absolute inset-0 bg-gradient-mesh opacity-20"></div>

      <!-- Theme Toggle Button -->
      <div class="absolute top-6 right-6 z-20 lg:top-8 lg:right-8">
        <ThemeToggle />
      </div>

      <!-- Logo Desktop & Mobile -->
      <div class="mb-8 lg:mb-12 flex flex-col items-center gap-3 relative z-10">
        <div
          class="h-20 w-20 lg:h-24 lg:w-24 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden shadow-lg border-2 border-gray-200 dark:border-gray-700 relative group"
        >
          <div class="absolute inset-0 bg-kemet-primary/20 dark:bg-kemet-primary/30 rounded-lg blur-md opacity-60 group-hover:opacity-80 transition-opacity"></div>
          <img 
            :src="logoImage" 
            alt="KemetLink Logo" 
            class="w-full h-full object-contain p-2.5 relative z-10"
            style="filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));"
          />
        </div>
        <h1
          class="text-2xl lg:text-3xl font-bold tracking-[0.2em] uppercase text-gray-900 dark:text-white transition-colors"
        >
          KemetLink
        </h1>
      </div>

      <div class="w-full max-w-[440px] space-y-6 sm:space-y-8 relative z-10">
        <div class="flex flex-col gap-2">
          <h2
            class="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors"
          >
            Login
          </h2>
          <p class="text-gray-700 dark:text-white/60 text-sm sm:text-base transition-colors">
            Enter your credentials to authorize access.
          </p>
        </div>

        <!-- Message d'erreur -->
        <div
          v-if="errorMessage"
          class="glass-effect border border-red-500/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm backdrop-blur-sm transition-colors"
        >
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div class="flex flex-col gap-2">
            <label
              class="text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-white/80 px-1 transition-colors"
            >
              Email Address
            </label>
            <div class="relative">
              <input
                v-model="email"
                class="kemet-input w-full h-14 px-4 pr-12 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/40"
                placeholder="name@kemeylink.com"
                type="email"
                required
              />
              <span
                class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white/40 transition-colors"
                >alternate_email</span
              >
            </div>
          </div>

          <!-- Mot de passe -->
          <div class="flex flex-col gap-2">
            <div class="flex justify-between items-center px-1">
              <label
                class="text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-white/80 transition-colors"
              >
                Password
              </label>
              <a
                class="text-xs font-medium text-kemet-primary/80 hover:text-kemet-primary transition-colors uppercase tracking-tighter"
                href="#"
                >Forgot Key?</a
              >
            </div>
            <div class="relative">
              <input
                v-model="password"
                class="kemet-input w-full h-14 px-4 pr-12 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/40"
                placeholder="••••••••"
                :type="showPassword ? 'text' : 'password'"
                required
              />
              <button
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white transition-colors"
                type="button"
              >
                <span class="material-symbols-outlined">{{
                  showPassword ? "visibility_off" : "visibility"
                }}</span>
              </button>
            </div>
          </div>

          <!-- Remember Me -->
          <div class="flex items-center gap-3 px-1">
            <input
              v-model="rememberMe"
              class="h-5 w-5 rounded border-2 border-gray-400 dark:border-white/20 bg-transparent text-kemet-primary checked:bg-kemet-primary checked:border-kemet-primary focus:ring-0 focus:ring-offset-0 cursor-pointer transition-colors"
              id="remember"
              type="checkbox"
            />
            <label
              class="text-sm font-medium text-gray-700 dark:text-white/70 cursor-pointer select-none transition-colors"
              for="remember"
            >
              Keep my terminal session active
            </label>
          </div>

          <!-- Bouton de connexion -->
          <button
            :disabled="isLoading"
            class="kemet-btn w-full h-14 text-lg uppercase tracking-[0.1em] disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
          >
            <span v-if="!isLoading">Authorize Access</span>
            <span v-else>Authorizing...</span>
            <span v-if="!isLoading" class="material-symbols-outlined"
              >arrow_forward</span
            >
          </button>
        </form>

        <div
          class="pt-6 border-t border-gray-300 dark:border-white/10 flex flex-col items-center gap-4 transition-colors"
        >
          <p class="text-sm text-gray-600 dark:text-white/50 transition-colors">
            New operator?
            <a class="text-kemet-primary font-bold hover:underline" href="#"
              >Request Access</a
            >
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="absolute bottom-8 text-[10px] uppercase tracking-[0.3em] text-gray-500 dark:text-white/30 flex gap-4 z-10 transition-colors"
      >
        <span>© 2026 KEMEYLINK SYSTEMS</span>
        <span class="hidden sm:inline">•</span>
        <span>SECURED NODE 04</span>
      </div>
    </div>
  </div>
</template>

<script>
import ThemeToggle from "../components/ThemeToggle.vue";
import AnimatedBackground from "../components/AnimatedBackground.vue";
import logoImage from "../assets/logo_KemeyLink.png";

export default {
  name: "Login",
  components: {
    ThemeToggle,
    AnimatedBackground,
  },
  data() {
    return {
      logoImage: logoImage,
      email: "",
      password: "",
      rememberMe: false,
      showPassword: false,
      isLoading: false,
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      this.isLoading = true;
      this.errorMessage = "";

      try {
        // TODO: Remplacer par votre appel API réel
        const response = await this.authenticateUser(this.email, this.password);

        // Sauvegarder le token si "Remember Me" est coché
        if (this.rememberMe) {
          localStorage.setItem("authToken", response.token);
        } else {
          sessionStorage.setItem("authToken", response.token);
        }

        // Redirection selon le rôle
        this.redirectByRole(response.role);
      } catch (error) {
        this.errorMessage =
          error.message ||
          "Authentication failed. Please check your credentials.";
      } finally {
        this.isLoading = false;
      }
    },

    async authenticateUser(email, password) {
      // SIMULATION BACKEND
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // SUPER ADMIN
          if (email === "superuser@gmail.com" && password === "super1234") {
            resolve({
              token: "super-admin-token",
              role: "super-admin",
            });
          }

          // ADMIN
          else if (email === "admin@gmail.com" && password === "admin1234") {
            resolve({
              token: "admin-token",
              role: "admin",
            });
          }

          // CLIENT
          else if (email === "client@gmail.com" && password === "client1234") {
            resolve({
              token: "client-token",
              role: "client",
            });
          }
          // MAUVAIS IDENTIFIANTS
          else {
            reject(new Error("Email ou mot de passe incorrect"));
          }
        }, 800);
      });
    },

    redirectByRole(role) {
      switch (role) {
        case "super-admin":
          this.$router.push("/super-admin");
          break;

        case "admin":
          this.$router.push({ name: "admin-dashboard" });
          break;

        case "client":
          this.$router.push("/client/dashboard");
          break;

        default:
          this.$router.push("/login");
      }
    },
  },
};
</script>

<style scoped>
input:focus {
  box-shadow: 0 0 0 2px rgba(42, 76, 65, 0.5) !important;
}
</style>
