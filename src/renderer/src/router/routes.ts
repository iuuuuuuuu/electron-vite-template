import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'middle',
    component: () => import('@renderer/pages/middle.vue')
  },
  {
    path: '/main',
    name: 'main',
    component: () => import('@renderer/pages/main/main.vue'),
    children: [
      {
        path: '/main/home',
        name: 'home',
        meta: {
          title: '首页'
        },
        component: () => import('@renderer/pages/main/home.vue')
      }
    ]
  }
]

export default routes
