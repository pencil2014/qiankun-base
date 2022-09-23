<template>
  <div id="app" v-loading="isLoading">
    <router-view v-if="['Login','Forget'].includes($route.name)" />
    <Layout v-else />
  </div>
</template>
<script>
import Layout from '@/layout/index.vue'
export default {
  components: {
    Layout
  },
  data () {
    return {
      isLoading: false
    }
  }
}
</script>

<style lang="scss">
*{
  margin: 0;
  padding: 0;
}
html {
  height: 100%;
  box-sizing: border-box;
}
body {
  font-size: 12px;
  color: #4a4a4a;
  height: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  font-family: 'Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif';
  margin: 0;
  background-color: #f5f7f9;
}
#app {
  height: 100%;
}
.el-menu.el-menu--popup.el-menu--popup-right-start {
  li {
    font-size: 12px;
    height: 24px;
    line-height: 24px;
  }
}
</style>
