<template>
  <div class="app-layout">
    <div class="top-nav">
      <TopNav />
    </div>
    <div class="cnt-box">
      <div class="left-menu" :class="{ 'collapse-menu': state.isCollapse }">
        <SideBar />
      </div>
      <div class="hamburger" @click="toggleMenu">
        <i class="el-icon-arrow-right" v-if="isActive"></i>
        <i class="el-icon-arrow-left" v-else></i>
      </div>
      <div class="main-box">
        <!-- <el-scrollbar style="height: 100%"> -->
          <router-view />
          <div id="subapp-viewport"></div>
        <!-- </el-scrollbar> -->
      </div>
    </div>
  </div>
</template>

<script>
import actions from '@/store'
import TopNav from './components/topnav'
import SideBar from './components/sidebar'
export default {
  components: {
    TopNav,
    SideBar
  },
  provide () {
    return {
      scrollToTag: this.scrollToTag
    }
  },
  data() {
    return {
      isActive: false,
      state: {},
      token: ''
    }
  },
  created() {
    this.token = localStorage.getItem('token')
  },
  methods: {
    toggleMenu() {
      this.isActive = !this.isActive
      this.state.isCollapse = !this.state.isCollapse
    },
    scrollToTag () {
      this.$nextTick(()=> {
        let tag = document.getElementsByClassName('tag-active')[0]
        let warp = document.getElementsByClassName('tag-srollbar-cnt')[0].getElementsByClassName('el-scrollbar__wrap')[0]
        let { clientWidth, offsetLeft } = tag
        let tagLeft = clientWidth + offsetLeft
        let warpLeft = warp.clientWidth + warp.scrollLeft
        if (tagLeft > warpLeft) {
          warp.scrollLeft += tagLeft - warpLeft
        }
        if (offsetLeft < warp.scrollLeft) {
          warp.scrollLeft = offsetLeft
        }
      })
    }
  },
  mounted() {
    let store = sessionStorage.getItem('store')
    if (store) {
      actions.setGlobalState(JSON.parse(store))
    }
    this.state = actions.getGlobalState()
  }
}
</script>
<style lang="scss" scoped>
.app-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
  .cnt-box {
    flex: 1;
    overflow: auto;
    display: flex;
    justify-content: stretch;
    align-items: center;
    .left-menu {
      height: 100%;
      width: 144px;
      overflow-x: hidden;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 6px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 6px;
        position: relative;
        display: block;
        width: 0;
        height: 0;
        cursor: pointer;
        border-radius: inherit;
        background-color: rgba(144, 147, 153, 0.3);
        transition: 0.3s background-color;
      }
      &.collapse-menu {
        width: 40px;
        :deep(li) {
          width: 40px;
          height: 32px;
          text-align: center;
          .el-submenu__icon-arrowm,
          span {
            display: none;
          }
        }
      }
    }
    .main-box {
      flex: 1;
      background-color: #fff;
      margin: 10px 10px 10px 0;
      height: calc(100% - 20px);
      padding: 0;
      overflow: auto;
      :deep(.el-scrollbar__wrap) {
        overflow-x: hidden;
      }
    }
    .hamburger {
      display: inline-block;
      vertical-align: middle;
      color: #fff;
      line-height: 80px;
      height: 80px;
      width: 10px;
      background-color: #222;
      z-index: 3;
      border-radius: 0 4px 4px 0;
      cursor: pointer;
      &.is-active {
        transform: rotate(180deg);
      }
    }
  }
}
:deep(.el-tabs__item) {
  font-size: 12px;
}
:deep(.el-table) {
  font-size: 12px;
  .cell {
    line-height: 16px;
  }
  .el-table__header {
    th {
      background-color: #f8f9fd;
      text-align: center;
      color: #909399;
      padding: 5px 0;
      line-height: 16px;
    }
  }
  .el-table__body td {
    padding: 5px 0;
    color: #4a4a4a;
    height: 16px;
    .el-button {
      padding: 0;
      font-size: 12px;
    }
  }
  .el-table__cell {
    padding: 0;
    line-height: 16px;
  }
}
:deep(.el-button--mini) {
  font-size: 12px;
  height: 20px;
  padding: 3px 7px;
}
:deep(.el-input--mini .el-input__inner) {
  height: 20px;
  line-height: 20px;
}
:deep(.el-dialog) {
  border-radius: 4px;
  overflow: hidden;
  .el-dialog__header {
    padding: 0 10px;
    background: #2d3a5d;
    border-radius: 4px 4px 0px 0px;
    .el-dialog__title {
      font-size: 12px;
      color: #fff;
    }
    .el-dialog__headerbtn {
      top: 4px;
      right: 10px;
      padding: 0;
      background: transparent;
      border: none;
      outline: none;
      cursor: pointer;
      font-size: 16px;
    }
  }
  .el-dialog__body {
    font-size: 12px;
  }
}
:deep(a:link) {
  color: #3e80f5;
}
:deep(a:visited) {
  color: #3e80f5;
}
:deep(a:hover) {
  color: #3e80f5;
}
:deep(a:active) {
  color: #3e80f5;
}
</style>
>
