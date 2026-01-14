<template>
  <div class="flex h-screen w-full flex-col lg:flex-row">
    <!-- Section gauche: Visuel EV -->
    <div
      class="relative hidden h-full w-full lg:flex lg:w-1/2 overflow-hidden bg-charcoal-dark"
    >
      <div
        class="absolute inset-0 bg-cover bg-center opacity-70 mix-blend-luminosity"
        style="
          background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAg__-ZpNYAkVK6g-2nJaOr6lFoAUjT9oX_nXGZfUykd35ypgo7ah6Qw-VxkMwsx0ICfjax2uvZE787gdTuy9Vcp6rI3a193RA8oBu1hnEJYM0uoe0uAt6rzbewEfOxCR6Kbb0Oz8X9CsVoMYsr81NKgujDaNYm85DznoiwibYvkObkqohLmyf2DitcHDNsDGroieLeznzxWXBKIs08v1MLchh05NpanbM3s9kozW7D98a3KFeqQKcOOjYyRrANedsUgsQgZ-YZ07I');
        "
      ></div>

      <!-- Overlay Glow -->
      <div class="absolute inset-0 ev-glow-mask"></div>

      <!-- Branding -->
      <div
        class="relative z-10 flex flex-col justify-between p-12 h-full w-full"
      >
        <div class="flex items-center gap-3">
          <div
            class="h-10 w-10 silver-metallic-gradient rounded-lg flex items-center justify-center"
          >
            <span class="material-symbols-outlined text-charcoal-dark font-bold"
              >bolt</span
            >
          </div>
          <span class="text-2xl font-bold tracking-[0.2em] uppercase"
            >VoltaLink</span
          >
        </div>

        <div class="max-w-md">
          <h2 class="text-5xl font-bold leading-tight mb-4 text-white drop-shadow-sm">
            Precision <br/>Engineering. <br/>Infinite Range
          </h2>
          <!-- <p class="text-primary text-lg font-light leading-relaxed">
            Access your fleet telemetry and performance metrics through our high-speed neural gateway.
          </p> -->
        </div>

        <div
          class="flex ml-16 gap-24 text-sm font-medium text-primary uppercase tracking-widest"
        >
          <span class="font-bold">Performance</span>
          <span class="font-bold">Safety</span>
          <span class="font-bold">Connectivity</span>
        </div>
      </div>
    </div>

    <!-- Section droite: Formulaire de connexion -->
    <div
      class="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-24 bg-background-light dark:bg-charcoal-medium relative"
    >
      <!-- Logo Mobile -->
      <div class="lg:hidden mb-12 flex flex-col items-center gap-2">
        <div
          class="h-12 w-12 silver-metallic-gradient rounded-lg flex items-center justify-center mb-2"
        >
          <span
            class="material-symbols-outlined text-charcoal-dark font-bold text-2xl"
            >bolt</span
          >
        </div>
        <h1
          class="text-2xl font-bold tracking-[0.2em] uppercase text-charcoal-dark dark:text-white"
        >
          VoltaLink
        </h1>
      </div>

      <div class="w-full max-w-[440px] space-y-8">
        <div class="flex flex-col gap-2">
          <h2
            class="text-3xl font-bold tracking-tight text-charcoal-dark dark:text-white"
          >
            Login
          </h2>
          <p class="text-gray-500 dark:text-primary/60 text-base">
            Enter your credentials to authorize access.
          </p>
        </div>

        <!-- Message d'erreur -->
        <div
          v-if="errorMessage"
          class="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm"
        >
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div class="flex flex-col gap-2">
            <label
              class="text-sm font-semibold uppercase tracking-wider text-charcoal-dark dark:text-primary/80 px-1"
            >
              Email Address
            </label>
            <div class="relative">
              <input
                v-model="email"
                class="w-full h-14 px-4 bg-white dark:bg-charcoal-light border border-gray-200 dark:border-charcoal-light rounded-lg text-charcoal-dark dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-primary transition-all font-sans"
                placeholder="name@voltalink.com"
                type="email"
                required
              />
              <span
                class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600"
                >alternate_email</span
              >
            </div>
          </div>

          <!-- Mot de passe -->
          <div class="flex flex-col gap-2">
            <div class="flex justify-between items-center px-1">
              <label
                class="text-sm font-semibold uppercase tracking-wider text-charcoal-dark dark:text-primary/80"
              >
                Password
              </label>
              <a
                class="text-xs font-medium text-primary hover:text-white transition-colors uppercase tracking-tighter"
                href="#"
                >Forgot Key?</a
              >
            </div>
            <div class="relative">
              <input
                v-model="password"
                class="w-full h-14 px-4 bg-white dark:bg-charcoal-light border border-gray-200 dark:border-charcoal-light rounded-lg text-charcoal-dark dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-primary transition-all font-sans"
                placeholder="••••••••"
                :type="showPassword ? 'text' : 'password'"
                required
              />
              <button
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 hover:text-primary transition-colors"
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
              class="h-5 w-5 rounded border-2 border-gray-300 dark:border-charcoal-light bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0 cursor-pointer"
              id="remember"
              type="checkbox"
            />
            <label
              class="text-sm font-medium text-charcoal-dark dark:text-primary/70 cursor-pointer select-none"
              for="remember"
            >
              Keep my terminal session active
            </label>
          </div>

          <!-- Bouton de connexion -->
          <button
            :disabled="isLoading"
            class="w-full h-14 silver-metallic-gradient text-charcoal-dark font-bold text-lg rounded-lg transition-all transform active:scale-[0.98] uppercase tracking-[0.1em] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
          class="pt-6 border-t border-gray-200 dark:border-charcoal-light flex flex-col items-center gap-4"
        >
          <p class="text-sm text-gray-500 dark:text-primary/40">
            New operator?
            <a class="text-primary font-bold hover:underline" href="#"
              >Request Access</a
            >
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="absolute bottom-8 text-[10px] uppercase tracking-[0.3em] text-gray-400 dark:text-gray-600 flex gap-4"
      >
        <span>© 2026 VOLTALINK SYSTEMS</span>
        <span class="hidden sm:inline">•</span>
        <span>SECURED NODE 04</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
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
          this.$router.push("/super-admin/dashboard");
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
.silver-metallic-gradient {
  background: linear-gradient(135deg, #b0b4c0 0%, #d0d4e0 50%, #b0b4c0 100%);
  box-shadow: 0 0 15px rgba(176, 181, 191, 0.2);
}

.silver-metallic-gradient:hover {
  background: linear-gradient(135deg, #d0d4e0 0%, #ffffff 50%, #d0d4e0 100%);
}

.ev-glow-mask {
  background: radial-gradient(
    circle at center,
    rgba(176, 181, 191, 0.15) 0%,
    transparent 70%
  );
}

input:focus {
  box-shadow: 0 0 0 1px #b0b5bf !important;
}
</style>
