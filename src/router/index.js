import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useAuthStore } from '@/stores/auth';
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
      meta: { layout: 'default', requiresAuth: true },
      meta: { layout: 'default', requiresAuth: true },
    },
    {
      path: '/post_review',
      name: 'PostReview',
      component: () => import('@/views/Community/PostReview.vue'),
      meta: { layout: 'default', requiresAuth: true },
      meta: { layout: 'default', requiresAuth: true },
    },
    {
      path: '/comments_review',
      name: 'CommentsReview',
      component: () => import('@/views/Community/CommentsReview.vue'),
      meta: { layout: 'default', requiresAuth: true },
      meta: { layout: 'default', requiresAuth: true },
    },
    {
      path: '/village_chief',
      name: 'VillageChief',
      component: () => import('@/views/VillageChief/VillageChiefView.vue'),
      meta: { layout: 'default', requiresAuth: true },
      meta: { layout: 'default', requiresAuth: true },
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

// 全域前置守衛
router.beforeEach(async (to) => {
  const auth = useAuthStore();

  // 第一次進站或 F5，嘗試用 PHP Session 還原登入
  if (!auth.admin) {
    await auth.fetchMe();
  }

  // 已登入卻進到登入頁 → 導到後台首頁
  if (to.path === '/' && auth.isLoggedIn) {
    return { path: '/village_chief', replace: true };
  }

  // 需要登入但尚未登入 → 回登入頁
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { path: '/', query: { redirect: to.fullPath }, replace: true };
  }

  // 其他情況放行
  return true;
});

// 全域前置守衛
router.beforeEach(async (to) => {
  const auth = useAuthStore();

  // 第一次進站或 F5，嘗試用 PHP Session 還原登入
  if (!auth.admin) {
    await auth.fetchMe();
  }

  // 已登入卻進到登入頁 → 導到後台首頁
  if (to.path === '/' && auth.isLoggedIn) {
    return { path: '/village_chief', replace: true };
  }

  // 需要登入但尚未登入 → 回登入頁
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { path: '/', query: { redirect: to.fullPath }, replace: true };
  }

  // 其他情況放行
  return true;
});

export default router;
