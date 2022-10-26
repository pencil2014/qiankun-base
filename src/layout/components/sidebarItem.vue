<template>
  <div>
    <el-submenu v-if="subMenu.subResource.length" :index="subMenu.resourceCode">
      <template slot="title">
        <i
          :class="icons[subMenu.resourceCode]"
          v-if="icons[subMenu.resourceCode]"
        ></i>
        <span>{{ subMenu.resourceName }}</span>
      </template>
      <div v-for="(item, index) in subMenu.subResource" :key="index">
        <sidebar-item :subMenu="item" />
      </div>
    </el-submenu>
    <el-menu-item :index="subMenu.resourceCode" v-else @click="goSub(subMenu)">
      <i
        :class="icons[subMenu.resourceCode]"
        v-if="icons[subMenu.resourceCode]"
      ></i>
      <span>{{ subMenu.resourceName }}</span>
    </el-menu-item>
  </div>
</template>

<script>
import actions from '@/store'
export default {
  name: 'sidebar-item',
  props: {
    subMenu: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
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
      state: {}
    }
  },
  methods: {
    goSub(item) {
      let { resourceName: title, routeCode: url, resourceCode: code } = item // let { resourceName: title, resourceUrl: url, resourceCode: code } = item
      this.state.activeTag = { title, url, code }
      let codes = this.state.tags.map((ele) => ele.code)
      if (!codes.includes(code)) {
        this.state.tags.push({
          title,
          code,
          url
        })
      }
      history.pushState(null, '', `/web-main/#${url}`)
    }
  },
  mounted() {
    this.state = actions.getGlobalState()
  }
}
</script>
