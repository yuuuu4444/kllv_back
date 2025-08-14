import NewsView from '@/views/News/NewsView.vue';
import NewsEdit from '@/views/News/NewsEdit.vue';

export default [
  {
    path: '/news',
    name: 'News',
    component: NewsView,
    meta: { layout: 'default' },
  },
  {
    path: '/news/edit/:news_no?',
    name: 'NewsEdit',
    component: NewsEdit,
    meta: { layout: 'default' },
    props: true,
  },
];
