const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '', component: () => import('pages/Transactions.vue')},
      {path: '/test', component: () => import('pages/Test.vue')},
      {path: '/upload', component: () => import('pages/Upload.vue')},
      {path: '/items/:type', component: () => import('pages/Items')},
      {path: '/report', component: () => import('pages/Report')},
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
];

export default routes;
