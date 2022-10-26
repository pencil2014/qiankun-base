import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/components/login.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/forget',
    name: 'Forget',
    component: () => import('@/components/forget.vue'),
    meta: {
      title: '忘记密码'
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/userInfo',
    name: 'UserInfo',
    component: () => import('@/views/userInfo.vue'),
    meta: {
      title: '个人信息'
    }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404.vue'),
    meta: {
      title: '404'
    }
  }
]

let router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: routes
})

export default router
