import actions from './store'
const getActiveRule = (hash) => (location) => location.hash.startsWith(hash)
const getActiveRule2 = (hash) => (location) => hash.some(item =>  location.hash.startsWith(item))
const microApps = [
  {
    name: 'wms',
    entry: process.env.VUE_APP_SUB_WMS,
    activeRule: getActiveRule('#/wms')
  },
  {
    name: 'adm',
    entry: process.env.VUE_APP_SUB_ADM,
    activeRule: getActiveRule2(['#/permission','#/baseData','#/companyResource','#/notice'])
  }
]
const apps = microApps.map(item => {
  return {
    ...item,
    container: '#subapp-viewport', // 子应用挂载的div
    props: {
      routerBase: item.activeRule, // 下发基础路由
      getGlobalState: actions.getGlobalState, // 下发getGlobalState方法
      addGlobalTag: actions.addGlobalTag,
      setGlobalState: actions.setGlobalState
    }
  }
})

export default apps