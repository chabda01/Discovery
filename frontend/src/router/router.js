import { createRouter, createWebHistory } from "vue-router";
import AdminLayout from "../components/layout/AdminLayout.vue";

import DashboardAdmin from "../views/admin/Dashboard.vue";
import Fleet from "../views/admin/Fleet.vue";
import FleetDetails from "../views/admin/FleetDetail.vue";
import Fota from "../views/admin/Fota.vue";
import Features from "../views/admin/Features.vue";
import SuperAdminDashboard from "../views/super-admin/Dashboard.vue";
import Admins from "../views/super-admin/Admins.vue";

import MotoDashboard from '../views/client/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("../views/login.vue"),
    },
    {
      path: "/super-admin",
      component: () => import("../components/layout/SuperAdminLayout.vue"),
      children: [
        {
          path: "",
          name: "super-admin-dashboard",
          component: SuperAdminDashboard,
        },
        {
          path: "admins",
          name: "manage-admins",
          component: Admins,
        },
        {
          path: "logs",
          name: "system-logs",
          component: () => import("../views/super-admin/Logs.vue"),
        }
      ],
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
