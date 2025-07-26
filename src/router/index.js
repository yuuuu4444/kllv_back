import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LogInView.vue';

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
      path: '/events_content',
      name: 'EventsContent',
      component: () => import('@/views/Events/EventsContent.vue'),
      meta: { layout: 'default' },
    },
    {
      path: '/events_signup',
      name: 'eventsSignup',
      component: () => import('@/views/Events/EventsSignup.vue'),
      meta: { layout: 'default' },
    },
    {
      path: '/news',
      name: 'News',
      component: () => import('@/views/News/NewsView.vue'),
      meta: { layout: 'default' },
    },
    {
      path: '/repair',
      name: 'Repair',
      component: () => import('@/views/Repair/RepairView.vue'),
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
      component: () => import('@/views/Households/Households.vue'),
      meta: { layout: 'default' },
    },
  ],
});

export default router;
