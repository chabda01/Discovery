import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router.js";
import themeService from "./services/themeService.js";

import "./assets/tailwind.css"; // ✅ IMPORTANT

// Initialiser le thème AVANT de monter l'app pour éviter le flash
themeService.init();

const app = createApp(App);
app.use(router);
app.mount("#app");
