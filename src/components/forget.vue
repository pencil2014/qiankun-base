<template>
  <div class="finance-page reset-page" v-if="showPage">
    <div class="user-header">
      <div class="user-bg">
        <div class="bg-ball ball-1"></div>
        <div class="bg-ball ball-2"></div>
      </div>
      <img v-if="!isReset" src="../assets/forget/img-email.png" alt />
      <img v-else src="../assets/forget/img-lock.png" alt />
      <div class="user-wish">{{ isReset ? '设置密码' : '邮箱验证' }}</div>
    </div>
    <div class="bg-ball ball-3"></div>
    <div class="bg-ball ball-4"></div>
    <div v-if="!isReset" class="middle-title">
      如果您忘记密码，可通过登录账号、公司邮箱重设登录密码
    </div>
    <div v-else class="middle-title">
      密码需至少包含数字、字母或特殊字符的两种，且长度在8-16位之间
    </div>
    <el-form
      v-if="!isReset"
      ref="emailForm"
      :model="emailForm"
      :rules="emailRules"
    >
      <el-form-item label="登录账户" prop="username">
        <el-input v-model="emailForm.username" placeholder="请输入登录账号" />
      </el-form-item>
      <el-form-item label="邮箱地址" prop="email">
        <el-input v-model="emailForm.email" placeholder="请输入邮箱地址" />
      </el-form-item>
      <el-button
        :loading="loading"
        type="primary"
        @click="handleEmail"
        style="height: 32px; background: #3e80f5; border: none"
        >确定验证</el-button
      >
    </el-form>
    <el-form
      v-else
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      label-position="right"
    >
      <el-form-item label="新密码" prop="passWordNew">
        <el-input
          :type="pwdType[1]"
          v-model="loginForm.passWordNew"
          placeholder="请输入新密码"
          @input="passWordNewInput"
        >
          <i slot="suffix" @click="togglePwdType(1)">
            <svg-icon
              :icon-class="pwdType[1] == 'password' ? 'eye' : 'eye-open'"
            />
          </i>
        </el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="passWordSure">
        <el-input
          :type="pwdType[2]"
          v-model="loginForm.passWordSure"
          placeholder="请再次输入新密码"
          @input="passWordSureInput"
        >
          <i slot="suffix" @click="togglePwdType(2)">
            <svg-icon
              :icon-class="pwdType[2] == 'password' ? 'eye' : 'eye-open'"
            />
          </i>
        </el-input>
      </el-form-item>
      <el-button
        :loading="loading"
        type="primary"
        @click="handleRest"
        style="height: 32px; background: #3e80f5; border: none"
        >完成设置</el-button
      >
    </el-form>
    <el-button class="back-btn" size="mini" @click="back">取消</el-button>
    <!-- style="background:#3E80F5;border:none;" -->
  </div>
</template>

<script>
import {
  sendResetPasswordEmail,
  resetPasswordByEmail,
  checkCodeExpired
} from '@/api'
export default {
  name: 'forget',
  data() {
    let validator = (rule, value, callback) => {
      value = value.trim()
      var regx =
        /^(?!([a-zA-Z]+|\d+|[`~!@#$%^&*()_+={};:'"|,<.>?]+)$)[a-zA-Z\d`~!@#$%^&*()_+={};:'"|,<.>?]{8,16}$/ // /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\W_]{8,16}$/
      if (value.match(regx) == null) {
        return callback(new Error('密码格式错误！'))
      }
      return callback()
    }
    let rules = { required: true, trigger: 'blur', message: ' ' }
    return {
      emailForm: { username: '', email: '' },
      loginForm: { tokenCode: '', passWordNew: '', passWordSure: '' },
      emailRules: { username: rules, email: rules },
      loginRules: { passWordNew: {...rules, validator}, passWordSure: {...rules, validator} },
      loading: false,
      pwdType: { 1: 'password', 2: 'password' },
      redirect: undefined,
      forgetView: 'default',
      code: '',
      isReset: false,
      showPage: false
    }
  },
  created() {
    this.isReset = this.$route.query.forgetView == 'reset'
    this.code = this.$route.query.code || this.code
    this.checkCodeExpired()
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    checkCodeExpired() {
      let data = {
        tokenCode: this.code
      }
      checkCodeExpired(data)
        .then((res) => {
          if (res.data === 'expired') {
            window.alert('激活链接已过期，请重新申请')
            window.location.href = 'about:blank'
            window.close()
          } else {
            this.showPage = true
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    togglePwdType(index) {
      this.pwdType[index] =
        this.pwdType[index] == 'password' ? 'text' : 'password'
    },
    // 确认验证
    handleEmail() {
      this.$refs.emailForm.validate((valid) => {
        if (!valid) return
        this.loading = true
        sendResetPasswordEmail({
          loginAccount: this.emailForm.username,
          email: this.emailForm.email
        })
          .then((res) => {
            this.loading = false
            this.rubbishConfirm()
          })
          .catch((err) => {
            console.log(err)
            this.loading = false
          })
      })
    },
    passWordNewInput() {
      if (this.loginForm.passWordNew.length > 16) {
        this.$msgErrClose('最多输入16位')
        this.loginForm.passWordNew = this.loginForm.passWordNew.substring(0, 16)
      }
    },
    passWordSureInput() {
      if (this.loginForm.passWordSure.length > 16) {
        this.$msgErrClose('最多输入16位')
        this.loginForm.passWordSure = this.loginForm.passWordSure.substring(
          0,
          16
        )
      }
    },
    // 重置密码
    handleRest() {
      let sha256 = require('js-sha256').sha256
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          if (this.loginForm.passWordNew !== this.loginForm.passWordSure) {
            return this.$msgErrClose('两次密码输入不一致！')
          }
          this.loading = true
          resetPasswordByEmail({
            tokenCode: this.code,
            newPassWord: sha256(this.loginForm.passWordNew)
          })
            .then((res) => {
              this.$msgSucClose('设置成功，请登录！')
              setTimeout(() => {
                this.loading = false
                this.back()
              }, 1600)
            })
            .catch((err) => {
              console.log(err)
              this.loading = false
            })
        }
      })
    },
    rubbishConfirm() {
      const h = this.$createElement
      this.$msgbox({
        message: h('div', { style: 'font-size:12px;text-align:center' }, [
          h('i', {
            class: 'el-icon-success',
            style: 'font-size: 30px;color:#13ce66;margin-top:20px'
          }),
          h(
            'div',
            { style: 'font-weight: bold;color:#222222;padding:8px 0' },
            '发送成功！'
          ),
          h('div', { style: 'color: #4A4A4A;line-height:18px;width:260px' }, [
            h('span', `已发送至您公司邮箱${this.emailForm.email}请点击`),
            h(
              'a',
              {
                style: 'color: #3E80F5',
                attrs: { href: 'https://exmail.qq.com/login' }
              },
              '登录该邮箱'
            ),
            h('span', '根据邮件提示操作。')
          ])
        ]),
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: '关闭',
        showClose: false,
        customClass: 'forget-message-box'
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.finance-page.reset-page {
  position: relative;
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
  border: 8px solid #f6f7f9;
}
.user-header {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 268px;
  text-align: center;
  & > div {
    position: relative;
    z-index: 1;
  }
  .user-bg {
    position: absolute;
    top: -332px;
    left: 50%;
    transform: translate(-50%, 0);
    width: 140%;
    height: 600px;
    background: #fafbfc;
    // background: #ccc;
    border-radius: 80%;
    z-index: 0;
  }
  img {
    position: relative;
    z-index: 1;
    margin-top: 83px;
  }
  .user-wish {
    line-height: 20px;
    margin-top: 20px;
    font-size: 22px;
    color: #222;
    font-weight: bold;
  }
}
.bg-ball {
  position: absolute;
  width: 57px;
  height: 57px;
  background: linear-gradient(135deg, #c5c5c5 0%, #434343 100%);
  border-radius: 100%;
  opacity: 0.04;
  &.ball-1 {
    left: 33%;
    bottom: 68px;
  }
  &.ball-2 {
    width: 182px;
    height: 182px;
    bottom: 188px;
    left: 66%;
  }
  &.ball-3 {
    width: 360px;
    height: 360px;
    left: -60px;
    bottom: -220px;
  }
  &.ball-4 {
    width: 100px;
    height: 100px;
    bottom: 200px;
    right: 100px;
  }
}
.middle-title {
  text-align: center;
  padding: 24px;
  font-size: 14px;
  color: #969696;
}
.el-form {
  width: 410px;
  margin-left: 50%;
  transform: translate(-50%, 0);
  .el-button {
    width: 100%;
    margin-top: 30px;
    padding: 8px 20px;
  }
}
 :deep(.el-form-item) {
  margin-bottom: 8px;
  & > label,
  & > div {
    line-height: 32px;
  }
  .el-input.el-input--mini,
  .el-input__inner {
    height: 28px;
    line-height: 28px;
  }
  .el-input__suffix {
    width: 32px;
    cursor: pointer;
  }
  .el-form-item__error {
    text-align: right;
    right: 0;
    font-size: 12px;
    bottom: 2px;
  }
}
.back-btn {
  position: absolute;
  right: 20px;
  top: 20px;
  font-size: 12px;
  height: 20px;
  padding: 3px 7px;
}
.money-box-border-bottom {
  border-bottom: 1px solid #fcfcfc;
}
.user-info-main {
  padding: 20px 16px 8px;
}
.el-form-item-text {
  font-size: 12px;
  /* height: 28px; */
  padding-top: 3px;
  line-height: 14px;
  min-width: 165px;
}
</style>
