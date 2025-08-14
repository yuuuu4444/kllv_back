import EventsContent from '@/views/Events/EventsContent.vue';
import EventsSignup from '@/views/Events/EventsSignup.vue';
import EventsEdit from '@/views/Events/EventsEdit.vue';

export default [
  {
    path: '/events_content',
    name: 'EventsContent',
    component: EventsContent,
    meta: { layout: 'default' },
  },
  {
    path: '/events_content/edit/:event_no?',
    name: 'EventsEdit',
    component: EventsEdit,
    meta: { layout: 'default' },
    props: true,
  },
  {
    path: '/events_signup',
    name: 'EventsSignup',
    component: EventsSignup,
    meta: { layout: 'default' },
  },
];
