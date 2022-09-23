import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component:() => import('@/components/login.vue')
  },
  {
    path: '/forget',
    name: 'Forget',
    component:() => import('@/components/forget.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home.vue')
  },
  {
    path: '/userInfo',
    name: 'UserInfo',
    component: () => import('@/views/userInfo.vue')
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404.vue')
  }
]

let router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: routes
})

export default router
