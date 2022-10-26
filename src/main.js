import Vue from 'vue'
import { registerMicroApps, start, setDefaultMountApp, runAfterFirstMounted, addGlobalUncaughtErrorHandler   } from 'qiankun'
import microApps from './micro-app'
import App from './App.vue'
import router from './router'
import store from './store'
import { getTokenCookie } from '@/utils'
import { getInfo, getDictList } from '@/api'
import 'default-passive-events'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/style/common.css'
import '@/icons'
Vue.use(ElementUI)

Vue.config.productionTip = false

// 全局方法
Vue.prototype.$msgSucClose = (message, duration) =>
  ElementUI.Message({
    type: 'success',
    message,
    showClose: true,
    duration: duration || 3000
  })
Vue.prototype.$msgErrClose = (message, duration) =>
  ElementUI.Message({
    type: 'error',
    message,
    showClose: true,
    duration: duration || 3000
  })
Vue.prototype.$msgWarnClose = (message, duration) =>
  ElementUI.Message({
    type: 'warning',
    message,
    showClose: true,
    duration: duration || 3000
  })
Vue.prototype.$confirmWarn = (message, callback, callback2) =>
  ElementUI.MessageBox.confirm(message.body || message, message.title || '', {
    confirmButtonText: message.confirm || '确定',
    cancelButtonText: message.cancel || '取消',
    type: 'warning'
  })
    .then((val) => val && callback())
    .catch(() => {
      callback2 && callback2()
    })

const instance = new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')

function loader(loading) {
  if (instance && instance.$children) {
    // instance.$children[0] 是App.vue，此时直接改动App.vue的isLoading
    instance.$children[0].isLoading = loading
  }
}

// 给子应用配置加上loader方法
const apps = microApps.map((item) => {
  return {
    ...item,
    loader
  }
})
// 添加全局的未捕获异常处理器。
addGlobalUncaughtErrorHandler((event) => {
  ElementUI.Message({
    type: 'warning',
    message: event.message || event.reason.message,
    showClose: true,
    duration: 3000
  })
  instance.$children[0].isLoading = false
})
// 路由拦截处理404
// const childrenPath = ['wms'] // 子系统分配的路由
// router.beforeEach((to, from, next) => {
//   if (to.name) {
//     // 有 name 属性，说明是主应用的路由
//     next();
//   }
//    else if (childrenPath.some((item) => to.path.includes(item))) {
//     next();
//   }
//   else {
//     next({ name: '404' })
//   }
// });

registerMicroApps(apps, {
  beforeLoad: (app) => {
    console.log('before load app.name====>>>>>', app.name)
  },
  beforeMount: [
    (app) => {
      store.setGlobalState({
        appName: app.name
      })
      console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name)
    }
  ],
  afterMount: [
    (app) => {
      console.log('[LifeCycle] after mount %c%s', 'color: green;', app.name)
    }
  ],
  afterUnmount: [
    (app) => {
      console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name)
    }
  ]
})

function getUserInfo (token) {
  getInfo(token).then(res => {
    let userInfo = res.data
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    store.setGlobalState({
      userInfo
    })
  }).catch(() => {})
  .finally(() => {})
}

function getDict() {
  getDictList()
    .then((res) => {
      let dictAll = res.data
      localStorage.setItem('dictAll', JSON.stringify(dictAll))
      store.setGlobalState({
        dictAll
      })
    })
    .catch(() => {})
}
let userInfo = localStorage.getItem('userInfo')
let token = localStorage.getItem('token') || getTokenCookie()
let url = '/web-main/#/home'
if (token) {
  url = '/web-main/' + (location.hash === '#/' ? '#/home' : location.hash)
  if (!userInfo) {
    getUserInfo(token)
    getDict()
  }
} else {
  sessionStorage.setItem('lastUrlNoLogin', location.href)
  url = '/web-main/#/login'
}
setDefaultMountApp(url)
start({
  prefetch: 'all'
})
// 第一个微应用 mount 后
// runAfterFirstMounted(()=>{})
