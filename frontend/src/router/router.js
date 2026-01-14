import { createRouter, createWebHistory } from "vue-router";
import AdminLayout from "../components/layout/AdminLayout.vue";

import DashboardAdmin from "../views/admin/Dashboard.vue";
import Fleet from "../views/admin/Fleet.vue";
import FleetDetails from "../views/admin/FleetDetail.vue";
import Fota from "../views/admin/Fota.vue";
// import Features from "../views/Features.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/admin",
      component: AdminLayout, // 👈 LE LAYOUT
      children: [
        {
          path: "",
          name: "admin-dashboard",
          component: DashboardAdmin,
        },
        {
          path: "fleet",
          name: "fleet",
          component: Fleet,
        },
        {
          path: "fleet/:id",
          name: "fleet-details",
          component: FleetDetails,
        },
        {
          path: "fota",
          name: "fota",
          component: Fota,
        },
        // {
        //   path: "features",
        //   name: "features",
        //   component: Features,
        // },
      ],
    },
  ],
});

export default router;
