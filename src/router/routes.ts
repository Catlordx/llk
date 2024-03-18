export const constantRoute = [
  {
    path: '/basic',
    component: () => import('../views/basic/index.vue'),
    name: 'basic',
  },
  {
    path: '/relax',
    component: () => import('../views/relax/index.vue'),
    name: 'relax',
  },
  {
    path: '/welcome',
    component: () => import('../views/welcome/index.vue'),
    name: 'welcome',
  },
]
