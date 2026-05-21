import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/app/layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('@/pages/chat') }],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/error-not-found'),
  },
]

export default routes
