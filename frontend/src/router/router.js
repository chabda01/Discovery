import { createRouter, createWebHistory } from "vue-router";
import AdminLayout from "../components/layout/AdminLayout.vue";

import DashboardAdmin from "../views/admin/Dashboard.vue";
import Fleet from "../views/admin/Fleet.vue";
import FleetDetails from "../views/admin/FleetDetail.vue";
import Fota from "../views/admin/Fota.vue";
import Features from "../views/admin/Features.vue";

import MotoDashboard from '../views/client/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("../views/login.vue"),
    },
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
        {
          path: "features",
          name: "features",
          component: Features,
        },
      ],
    },
    {
      path: '/client',
      component: () => import('../components/layout/ClientLayout.vue'),
      meta: { requiresAuth: true, role: 'client' },
      children: [
        {
          path: '',
          redirect: '/client/dashboard'
        },
        {
          path: 'dashboard',
          name: 'ClientDashboard',
          component: () => import('../views/client/Dashboard.vue')
        },
        {
          path: 'features',
          name: 'ClientFeatures',
          component: () => import('../views/client/Features.vue')
        },
        {
          path: 'updates',
          name: 'ClientUpdates',
          component: () => import('../views/client/Updates.vue')
        }
      ]
    },
  ],
});

export default router;
