import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LogInView.vue';

import NewsRoutes from '@/router/news';
import EventsRoutes from '@/router/events';
import RepairRoutes from '@/router/repair';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
      meta: { layout: 'none' },
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('@/views/Admin/AdminView.vue'),
      meta: { layout: 'default' },
    },
    {
      path: '/post_review',
      name: 'PostReview',
      component: () => import('@/views/Community/PostReview.vue'),
      meta: { layout: 'default' },
    },
    {
      path: '/comments_review',
      name: 'CommentsReview',
      component: () => import('@/views/Community/CommentsReview.vue'),
      meta: { layout: 'default' },
    },
    {
      path: '/village_chief',
      name: 'VillageChief',
      component: () => import('@/views/VillageChief/VillageChiefView.vue'),
      meta: { layout: 'default' },
    },
    {
      path: '/households',
      name: 'Households',
      component: () => import('@/views/Households/HouseholdsView.vue'),
      meta: { layout: 'default' },
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard/Dashboard.vue'),
      meta: { layout: 'header-only' },
    },

    ...NewsRoutes,
    ...EventsRoutes,
    ...RepairRoutes,
  ],
});

export default router;
