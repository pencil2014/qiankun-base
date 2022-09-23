<template>
  <div class="menu-box" v-loading="loading">
    <div wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="state.activeTag && state.activeTag.code"
        mode="vertical"
        :collapse="state.isCollapse"
        :collapse-transition="false"
      >
        <el-menu-item index="Home" @click="goSub(homePage)">
          <i class="el-icon-dashboard"></i>
          <span>首页</span>
        </el-menu-item>
        <div v-for="(item, index) in allMenu" :key="index">
          <SidebarItem :subMenu="item" />
        </div>
      </el-menu>
    </div>
  </div>
</template>

<script>
import actions from '@/store'
import { getMenu } from '@/api'
import SidebarItem from './sidebarItem.vue'
import settings from '@/settings'
export default {
  inject: ['scrollToTag'],
  components: {
    SidebarItem
  },
  data() {
    return {
      loading: false,
      token: '',
      icons: {
        Home: 'el-icon-dashboard',
        Plan: 'el-icon-plan',
        ManagementDuty: 'el-icon-duty-manager',
        SeaShipping: 'el-icon-sea-shipping',
        AirTransport: 'el-icon-air-transport',
        Railway: 'el-icon-railway',
        CustomsDeclaration: 'el-icon-sea-shipping',
        Take: 'el-icon-take',
        Put: 'el-icon-put',
        Finance: 'el-icon-finance',
        WorkException: 'el-icon-work-exception',
        WarehouseIndex: 'el-icon-warehouse-index',
        SwCms: 'el-icon-swcms',
        CRM: 'el-icon-crm',
        AuditIndex: 'el-icon-audit-index',
        Cosco: 'el-icon-online-rob-tank',
        BKG: 'el-icon-predict-manage',
        CompanyResource: 'el-icon-company-source',
        Permission: 'el-icon-permission',
        BaseData: 'el-icon-data-base',
        Wms: 'el-icon-wms'
      },
      allMenu: [],
      activeIndex: 'Home',
      state: {},
      homePage: {
        resourceCode: 'Home',
        resourceName: '首页',
        resourceUrl: '/home',
        subResource: []
      }
    }
  },
  created() {
    this.token =
      actions.getGlobalState('token') || localStorage.getItem('token') || ''
    if (this.token) {
      this.getAllMenu()
    }
  },
  methods: {
    goSub(item) {
      let { resourceName: title, resourceUrl: url, resourceCode: code } = item
      this.state.activeTag = { title, url, code }
      let codes = this.state.tags.map((ele) => ele.code)
      if (!codes.includes(code)) {
        this.state.tags.push({
          title,
          code,
          url
        })
      }
      this.scrollToTag()
      history.pushState(null, '', `/web-main/#${url}`)
    },
    getAllMenu() {
      this.loading = true
      getMenu({ token: this.token, sysCode: 'wms,adm' })
        .then((res) => {
          if (res.code === 0) {
            let allMenu = res.data
            allMenu = this.generateMenusFrontWebMain(allMenu)
            this.allMenu = allMenu
            localStorage.setItem('allMenu', JSON.stringify(allMenu))
            // 默认首页
            let home = {
              title: '首页',
              code: 'Home',
              url: '/home'
            }
            let tags = [{ ...home }]
            let activeTag = { ...home }
            let hash = location.hash.replace('#', '')
            if (!['/home', '/userInfo', '/404'].includes(hash)) {
              let find = this.searchTree(allMenu)
              let {
                resourceName: title,
                resourceCode: code,
                resourceUrl: url
              } = find
              activeTag = { title, code, url }
              tags.push({ title, code, url })
            } else {
              if (hash === '/userInfo') {
                let title = '个人信息'
                let url = '/userInfo'
                let code = 'UserInfo'
                activeTag = {
                  title,
                  url,
                  code
                }
                tags.push({ title, code, url })
              } else if (hash === '/404') {
                tags = [{ ...home }]
                activeTag = {}
              }
            }
            actions.setGlobalState({
              allMenu,
              activeTag,
              tags
            })
          }
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    searchTree(allMenu) {
      let hash = location.hash.replace('#', '')
      return this.recursionGet(allMenu, hash)
    },
    // 递归获取菜单
    recursionGet(allMenu, url) {
      let value = null
      for (let index = 0; index < allMenu.length; index += 1) {
        let sub = allMenu[index].subResource
        if (sub.length) {
          let res = this.recursionGet(sub, url)
          if (res) return res
        } else {
          if (allMenu[index].resourceUrl === url) {
            value = allMenu[index]
            break
          }
        }
      }
      return value
    },
    generateMenusFrontWebMain(menus, isSubMenu) {
      let menusFront = []
      menus.forEach(menu => {
        if (settings.menusNotShow.concat(['page-show', 'tab-', 'btn-']).every(item => !menu.resourceCode.startsWith(item))) {
          menusFront.push(menu)
        }
        if (menu.subResource.length) {
          menu.subResource = this.generateMenusFrontWebMain(menu.subResource, true)
        }
      })
      return menusFront
    }
  },
  mounted() {
    this.state = actions.getGlobalState()
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/icon.css';
.menu-box {
  height: 100%;
  transition: width 0.28s;
  width: 144px;
  background-color: #fff;
  position: relative;
  :deep(.el-menu) {
    .is-active > .el-submenu__title {
      font-weight: 700;
      color: #222;
    }
    .el-submenu__title,
    .el-menu-item {
      font-size: 12px;
      height: 32px;
      line-height: 32px;
      margin: 0 -15px;
      display: flex;
      align-items: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .el-menu-item {
      padding: 0;
      min-width: none;
    }
    i {
      width: 14px;
      height: 14px;
      font-size: 14px;
      margin-right: 4px;
      margin-left: -2px;
      &.el-submenu__icon-arrow {
        font-size: 12px;
      }
    }
    .el-scrollbar {
      height: 100%;
    }
    .is-horizontal {
      display: none;
    }
    .el-menu{
      .el-menu{
        li{
          padding-left: 50px !important;
        }
      }
    }
  }
}
</style>
