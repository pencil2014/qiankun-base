<template>
  <div class="login-container">
    <div class="login-form-container">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        label-position="right"
      >
        <div class="title-container">
          <img class="login-logo" src="../assets/login/login-logo.png" />
          <h3 class="title">登录</h3>
        </div>
        <el-form-item prop="username">
          <span class="svg-container">
            <img src="../assets/login/login-user.png" />
          </span>
          <el-input
            ref="username"
            v-model.trim="loginForm.username"
            placeholder="用户名"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <img src="../assets/login/login-password.png" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model.trim="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
        </el-form-item>

        <div class="tips">
          <a class="forget-password" href="" @click.prevent="goForget"
            >忘记密码？</a
          >
        </div>

        <el-button
          :loading="loading"
          type="primary"
          style="
            width: 100%;
            height: 50px;
            margin-bottom: 22px;
            font-size: 18px;
            background: rgb(38, 60, 146);
            border: none;
          "
          @click.native.prevent="handleLogin"
          >登录</el-button
        >
      </el-form>
    </div>
  </div>
</template>

<script>
import sha256 from 'js-sha256'
import actions from '@/store'
import { login, getInfo, getDictList } from '@/api'
import { setToken, getTokenCookie } from '@/utils'
export default {
  name: 'login',
  data() {
    return {
      loginForm: {
        username: '', // 'op',
        password: '' // '123456'
      },
      loginRules: {
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      expireTimes: '',
      token: ''
    }
  },
  created() {
    let token = getTokenCookie()
    if (token && token !== 'undefined') {
      let expired_time = Math.round(new Date().getTime()) + this.expireTimes
      this.token = token
      localStorage.setItem('token', token)
      localStorage.setItem('expired_time', expired_time) // 过期时间
      localStorage.setItem('isLogin', true) // 过期时间
      setToken(token)
      actions.setGlobalState({
        token
      })
      this.getUserInfo()
      this.getDict()
    }
  },
  methods: {
    goForget () {
      this.$router.push({ name: 'Forget' })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          let { username, password } = this.loginForm
          let data = {
            username,
            password: sha256(password)
          }
          login(data)
            .then((res) => {
              if (res.code === 0) {
                let token = res.data?.token || ''
                let expired_time =
                  Math.round(new Date().getTime()) + this.expireTimes
                this.token = token
                localStorage.setItem('token', token)
                localStorage.setItem('expired_time', expired_time) // 过期时间
                localStorage.setItem('isLogin', true) // 过期时间
                setToken(token)
                actions.setGlobalState({
                  token
                })
                this.getUserInfo()
                this.getDict()
              }
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    },
    getUserInfo() {
      getInfo(this.token)
        .then((res) => {
          if (res.code === 0) {
            let userInfo = res.data
            localStorage.setItem('userInfo', JSON.stringify(userInfo))
            actions.setGlobalState({
              userInfo
            })
            // let url = sessionStorage.getItem('lastUrlNoLogin')
            // if (url && !url.includes('/login')) {
            //   location.href = url
            // } else {
            //   this.$router.push({ name: 'Home' })
            // }
            this.$router.push({ name: 'Home' })
          }
        })
        .catch(() => {})
        .finally(() => {})
    },
    getDict() {
      getDictList()
        .then((res) => {
          let dictAll = res.data
          localStorage.setItem('dictAll', JSON.stringify(dictAll))
          actions.setGlobalState({
            dictAll
          })
        })
        .catch(() => {})
    }
  },
  mounted() {
    this.expireTimes = actions.getGlobalState('expireTimes')
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      // color: $light_gray;
      color: #4a4a4a;
      height: 47px;
      // caret-color: $cursor;

      &:-webkit-autofill {
        // box-shadow: 0 0 0px 1000px $bg inset !important;
        box-shadow: 0 0 0px 1000px #fff inset !important;
        // -webkit-text-fill-color: $cursor !important;
        -webkit-text-fill-color: #4a4a4a !important;
      }
    }
  }

  .el-form-item {
    // border: 1px solid rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.1);
    // background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  // background-color: $bg;
  background: url('../assets/login/login-bg.webp');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  overflow: hidden;
  position: relative;

  .login-form-container {
    width: 480px;
    height: 420px;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -240px;
    margin-top: -210px;
    background: #fff;
    border-radius: 3px;
  }

  .login-form {
    position: relative;
    max-width: 100%;
    padding: 30px 30px;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 22px; // 10px;
    position: relative;
    min-height: 12px; // 16px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
    .forget-password {
      position: absolute;
      right: 0;
      // opacity: 0.4;
      color: rgb(38, 60, 146);
      font-size: 12px;
    }
  }

  .svg-container {
    // padding: 6px 5px 6px 15px;
    padding: 7px 8px 7px 8px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .login-logo {
      width: 226px;
      height: 43px;
      display: block;
      margin: 0 auto;
    }

    .title {
      font-size: 32px;
      // color: $light_gray;
      color: #222;
      // margin: 0px auto 40px auto;
      margin: 30px auto 10px;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .el-form-item {
    margin-bottom: 22px;
  }

  .login-container-modal {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: #fff;
  }
}
</style>
