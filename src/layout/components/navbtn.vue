<template>
  <div class="navbar">
    <el-button v-if="host !== 'lsuat.com'" size="mini" @click="gotoBigData"
      >大禹数据平台</el-button
    >
    <el-dropdown
      size="mini"
      class="avatar-container company-container"
      trigger="click"
      @command="refreshTokenFn"
    >
      <div class="avatar-wrapper company-wrapper">
        <span class="company-name">{{ compName }}</span>
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
        <el-dropdown-item @click.native="emailBook">邮件订阅</el-dropdown-item>
        <el-dropdown-item divided @click.native="logout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <ChangePassword
      v-if="diaologOption.show"
      :option="diaologOption"
      @cancel="cancel"
      @submit="submit"
    />
    <EmailBookPop
      v-if="emailBookOption.show"
      :option="emailBookOption"
      @cancel="cancelEmail"
    />
  </div>
</template>

<script>
import sha256 from 'js-sha256'
import actions from '@/store'
import { logOut, setToken, randomString } from '@/utils'
import { refreshToken, updatePassWord } from '@/api'
import ChangePassword from '@/components/changePassword'
import EmailBookPop from '@/components/emailBookPop'
import axios from 'axios'
export default {
  components: {
    ChangePassword,
    EmailBookPop
  },
  data() {
    return {
      host: location.host,
      userInfo: {},
      state: {},
      diaologOption: {
        show: false
      },
      emailBookOption: {
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
    },
    emailBook() {
      this.emailBookOption.show = true
    },
    cancelEmail() {
      this.emailBookOption.show = false
    },
    gotoBigData() {
      // 协议会切换到https，动态获取协议再赋值
      // hash: "#/dashboard"
      // host: "localhost:7701"
      // hostname: "localhost"
      // href: "http://localhost:7701/#/dashboard"
      // origin: "http://localhost:7701"
      // pathname: "/"
      // port: "7701"
      // protocol: "http:"
      let protocol = location.protocol
      let host = location.hostname
      let ip = ''
      if (host === 'localhost') {
        host = 'www.bigdata-test.com'
        ip = '192.168.0.27:8100'
      } else if (host === 'ls.com') {
        host = 'www.bigdata-dev.com'
        ip = '192.168.0.26:8100'
      } else if (host === 'lstest.com') {
        host = 'www.bigdata-test.com'
        ip = '192.168.0.27:8100'
      } else if (host === 'lsuat.com') {
        host = 'www.bigdata-test.com'
        ip = '192.168.0.27:8100'
      } else {
        // host = 'http://bigdata.longsailing.net:7777'
        // ip = 'bigdata.longsailing.net:7777'
        host = 'bigdata.longsailing.net'
        ip = 'bigdata.longsailing.net'
      }
      // 跳转的腾讯云地址：http://81.71.10.108:8081/api-auth/oauth/authorize
      // http://192.168.1.13:9001/InvSvr
      let url = `${protocol}//${ip}/api-auth/oauth/authorize`
      axios
        .post(url, {
          clientId: 'BusinessSystem',
          clientSecret: 'admin',
          responseType: 'code',
          scope: ['all'],
          state: randomString(),
          businessToken: this.state.token
        })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$msgErrClose(res.msg)
          } else {
            window.open(
              `${protocol}//${host}/sign?token=${res.data.accessToken}&from=yw`
            )
          }
          //         开发：http://www.bigdata-dev.com/sign?token=xxx&from=yw
          // 测试：http://www.bigdata-test.com/sign?token=xxx&from=yw
          // 生产：http://bigdata.longsailing.net:7777/sign?token=xxx&from=yw
        })
        .catch((error) => {
          console.log(error)
        })
    }
  },
  mounted() {
    let userInfo = actions.getGlobalState('userInfo') || {}
    if (!userInfo.userName) {
      userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    }
    this.userInfo = userInfo
    this.state = actions.getGlobalState()
    actions.onGlobalStateChange((sata,prev) => {
      this.userInfo = state.userInfo
    })
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
    .company-name {
      font-size: 12px;
    }
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
