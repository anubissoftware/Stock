import type { token } from '@/schemas';
import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import Login from '@/views/LoginView.vue'
import moment from 'moment';
import { readPer } from '@/composables/permissions';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
      name: 'home',
      component: () => import('@/views/Dashboard.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      // beforeEnter: (to, from) => {
      //   const token = auth.getUser.token as token
      //   if (token !== undefined && token.expirate > moment().unix()) {
      //     return { path: '/dashboard' }
      //   }
      // }
    },
    {
      // path: "*",
      path: "/:catchAll(.*)",
      redirect: '/dashboard'
    },
    {
      path: "/dashboard/statistics",
      name: 'about',
      component: async () => import('@/views/StatisticsView.vue')
    },
    {
      path: "/dashboard/mystock",
      name: "myStock",
      component: async () => import('@/views/MyStockView.vue')
    },
    {
      path: "/dashboard/mystore",
      name: "myStore",
      component: async () => import('@/views/MyStoreView.vue')
    },
    {
      path: "/dashboard/config",
      name: 'config',
      component: async () => import('@/views/ConfigView.vue')
    },
    {
      path: "/dashboard/clients",
      name: "clients",
      component: async () => import('@/views/ClientsView.vue')
    },
    {
      path: "/dashboard/quote",
      name: "quote",
      component: async () => import('@/views/QuotationView.vue')
    },
    {
      path: "/quotations",
      name: "quotations",
      component: async () => import('@/views/ClientQuotation.vue')
    }
  ]
})

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  const path = to.path
  let isIn = false
  
  const routes = ['/dashboard']
  routes.forEach((route) => {
    if (path.includes(route)) {
      isIn = true
    }
  })
  let user = JSON.parse(localStorage.getItem('user') || '{}')
  console.log('user', user)
  const token = user.token as token
  if ((isIn) && (token == undefined || token.expirate < moment().unix())) {
    // redirect the user to the login page
    return { name: 'login' }
  }
  if (token && !readPer(to)) {
    return { name: 'home' }
  }
  return true
})


export default router
