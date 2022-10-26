import { initGlobalState } from 'qiankun'
import Vue from 'vue'
import { getTokenCookie } from '@/utils'

// 父应用的初始state
// Vue.observable是为了让initialState变成可响应：https://cn.vuejs.org/v2/api/#Vue-observable。
const initialState = Vue.observable({
  userInfo: {},
  token: '',
  expireTimes: 30 * 60 * 1000, // token有效期30分钟
  allMenu: [],
  tags: [{ title: '首页', code: 'Home', url: '/home' }],
  activeTag: { title: '首页', code: 'Home', url: '/home' },
  isCollapse: false,
  dictAll: [],
  appName: '',
  subRouters: {}
})

const actions = initGlobalState(initialState) || initialState

actions.onGlobalStateChange((state, prev) => {
  // state: 变更后的状态; prev 变更前的状态
  for (const key in state) {
    initialState[key] = state[key]
  }
})

actions.setGlobalState = data => {
  Object.assign(initialState, data)
}

// 定义一个获取state的方法下发到子应用
actions.getGlobalState = key => {
  // 有key，表示取globalState下的某个子级对象
  // 无key，表示取全部
  let token = localStorage.getItem('token') || getTokenCookie()
  let userInfo = localStorage.getItem('userInfo')
  if (!initialState.token) {
    initialState.token = token || ''
  }
  if (!initialState.userInfo.userName) {
    initialState.userInfo = JSON.parse(userInfo || '{}')
  }
  return key ? initialState[key] : initialState
}

actions.addGlobalTag = tag => {
  initialState.activeTag = tag
  let codes = initialState.tags.map(ele => ele.code)
  if (!codes.includes(tag.code)) {
    initialState.tags.push(tag)
  } else {
    let find = initialState.tags.find(ele => ele.code === tag.code)
    find.url = tag.url
  }
}

actions.delGlobalTag = tag => {
  let { code, title, url } = tag
  let index = initialState.tags.findIndex(
    ele => ele.code === code || ele.title === title || ele.url === url
  )
  if (index !== -1) {
    initialState.tags.splice(index, 1)
  }
}

export default actions
