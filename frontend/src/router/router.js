import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/login.vue'
import SuperAdminDashboard from '../views/super-admin/Dashboard.vue'
import AdminDashboard from '../views/admin/Dashboard.vue'
import MotoDashboard from '../views/client/Dashboard.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/super-admin/dashboard',
    name: 'SuperAdminDashboard',
    component: SuperAdminDashboard,
    meta: { requiresAuth: true, role: 'super_admin' }
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/client/dashboard',
    name: 'MotoDashboard',
    component: MotoDashboard,
    meta: { requiresAuth: true, role: 'client' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Protection des routes
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
  
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router