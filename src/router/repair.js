import RepairView from '@/views/Repair/RepairView.vue';

export default [
  {
    path: '/repair',
    name: 'Repair',
    component: RepairView,
    meta: { layout: 'default', requiresAuth: true },
  },
];
