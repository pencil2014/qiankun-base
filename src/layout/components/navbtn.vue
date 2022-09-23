<template>
  <div class="navbar">
    <el-dropdown
      size="mini"
      class="avatar-container company-container"
      trigger="click"
      @command="refreshTokenFn"
    >
      <div class="avatar-wrapper company-wrapper">
        <span>{{ compName }}</span>
        <i class="el-icon-caret-bottom" />
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown company-dropdown">
        <el-scrollbar>
          <div style="max-height: 80vh">
            <el-dropdown-item
              v-for="company in userInfo.companyList"
              :key="company.companyCode"
              :command="company"
            >
              <span>
                {{ company.name }}
                <i
                  class="el-icon"
                  :class="
                    company.companyCode === userInfo.settleCompanyCode
                      ? 'el-icon-check'
                      : ''
                  "
                ></i>
              </span>
            </el-dropdown-item>
          </div>
        </el-scrollbar>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown size="mini" class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <div class="name__container">
          <img src="../../assets/head.png" class="user-avatar" />{{
            userInfo.userName
          }}
        </div>
        <i class="el-icon-caret-bottom" />
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <el-dropdown-item @click.native="goHome">首页</el-dropdown-item>
        <el-dropdown-item @click.native="goUser">个人信息</el-dropdown-item>
        <el-dropdown-item @click.native="showPwd">修改密码</el-dropdown-item>
        <el-dropdown-item divided @click.native="logout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <ChangePassword
      v-if="diaologOption.show"
      :option="diaologOption"
      @cancel="cancel"
      @submit="submit"
    />
  </div>
</template>

<script>
import sha256 from 'js-sha256'
import actions from '@/store'
import { logOut, setToken } from '@/utils'
import { refreshToken, updatePassWord } from '@/api'
import ChangePassword from '@/components/changePassword'
export default {
  components: {
    ChangePassword
  },
  data() {
    return {
      userInfo: {},
      state: {},
      diaologOption: {
        show: false
      }
    }
  },
  computed: {
    compName() {
      let comp = this.userInfo.companyList?.find(
        (v) => v.companyCode === this.userInfo.settleCompanyCode
      )
      return comp && comp.name
    }
  },
  methods: {
    goUser() {
      this.routerGo({ title: '个人信息', url: '/userInfo', code: 'UserInfo' })
    },
    goHome() {
      this.routerGo({ title: '首页', url: '/home', code: 'Home' })
    },
    routerGo({ title, url, code }) {
      this.state.activeTag = { title, url, code }
      let codes = this.state.tags.map((ele) => ele.code)
      if (!codes.includes(code)) {
        this.state.tags.push({
          title,
          code,
          url
        })
      }
      this.$router.push({ name: code })
    },
    logout() {
      logOut()
    },
    refreshTokenFn(company) {
      if (company.companyCode === this.userInfo.settleCompanyCode) {
        return
      }
      refreshToken({ companyCode: company.companyCode }).then((res) => {
        // 重新存储token和失效时间
        let token = res.data?.token || ''
        let expired_time = Math.round(new Date().getTime()) + this.expireTimes
        localStorage.setItem('token', token)
        localStorage.setItem('expired_time', expired_time) // 过期时间
        localStorage.setItem('isLogin', true) // 过期时间
        setToken(token)
        let { companyCode, companyName } = company
        Object.assign(
          this.userInfo,
          {
            settleCompanyCode: companyCode,
            settleCompanyName: companyName
          },
          company
        )
        localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
        actions.setGlobalState({
          token,
          userInfo: this.userInfo
        })
      })
    },
    showPwd() {
      this.diaologOption.show = true
    },
    cancel() {
      this.diaologOption.show = false
    },
    submit(form) {
      let { passWordOld, passWordNew } = form
      let data = {
        orgLoginPassWord: sha256(passWordOld),
        newloginPassWord: sha256(passWordNew)
      }
      updatePassWord(data)
        .then((res) => {
          if (res.code === 0) {
            this.cancel()
            this.$msgSucClose('已成功设置新密码，您可以使用新密码登录系统！')
          }
        })
        .catch(() => {})
        .finally(() => {})
    }
  },
  mounted() {
    let userInfo = actions.getGlobalState('userInfo') || {}
    if (!userInfo.userName) {
      userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    }
    this.userInfo = userInfo
    this.state = actions.getGlobalState()
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  align-items: center;
  height: 30px;
  margin-right: 10px;
  .avatar-wrapper {
    display: flex;
    align-items: center;
    color: #fff;
    margin-left: 10px;
    cursor: pointer;
    .name__container {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #fff;
      img {
        width: 24px;
        height: 24px;
        margin-right: 5px;
      }
    }
  }
}
.user-dropdown {
  text-align: center;
}
 :deep(.company-dropdown) {
  .el-dropdown-menu__item {
    text-align: left;
  }
  .el-icon-check {
    color: #46a6ff;
    padding-left: 4px;
    font-weight: bold;
  }
}
</style>
