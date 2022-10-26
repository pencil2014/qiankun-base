import actions from '@/store'
import Cookies from 'js-cookie'
const TokenKey = 'X-TOKEN'
import { logout } from '@/api'

export function getToken() {
  let token = actions.getGlobalState('token')
  if (!token) {
    token = localStorage.getItem('token') || getTokenCookie()
  }
  return token
}

export function validUsername(str) {
  const valid_map = ['admin']
  return valid_map.indexOf(str.trim()) >= 0
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        time = parseInt(time)
      } else {
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

export function logOut() {
  logout({ sysCode: 'wms,adm,sw' })
    .then(() => {
      localStorage.removeItem('token')
      setToken(undefined)
      actions.setGlobalState({
        userInfo: {},
        token: '',
        allMenu: [],
        tags: [{ title: '首页', code: 'Home', url: '/home' }],
        activeTag: { title: '首页', code: 'Home', url: '/home' },
        isCollapse: false
      })
      sessionStorage.removeItem('store')
      history.pushState(null, '', '/web-main/#/login')
    })
    .catch(() => {})
}

export function getTokenCookie() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setTokenTime(time) {
  return Cookies.set(TokenKeyTime, time)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

/**
 * 随机生成16位
 */
 export function randomString(e) {
  e = e || 16;
  let t = "ABCDEFGHIJKLMNOPQRSTUVWWXYZabcdefghijklmnopqrstuvwwxyz0123456789",
    a = t.length,
    n = "";
  for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n
 }