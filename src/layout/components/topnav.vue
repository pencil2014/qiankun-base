<template>
  <div class="top-nav">
    <div class="logo-box">
      <img src="../../assets/logo.png" :alt="title" />
    </div>
    <div class="tag-box">
      <Tags />
    </div>
    <div class="btns-box">
      <NavBtn />
    </div>
  </div>
</template>

<script>
import Tags from './tags'
import NavBtn from './navbtn'
export default {
  components: {
    Tags,
    NavBtn
  },
  data() {
    return {
      tags: [],
      title: '长帆国际物流'
    }
  }
}
</script>

<style lang="scss" scoped>
.top-nav {
  display: flex;
  height: 30px;
  background: #2d3a5d;
  .logo-box {
    display: flex;
    align-items: center;
    width: 144px;
    justify-content: space-around;
    flex-shrink: 0;
    img {
      width: 112px;
    }
  }
  .tag-box {
    flex: 1;
  }
  .btns-box {
    flex-shrink: 0;
    margin-left: 15px;
  }
}
</style>
