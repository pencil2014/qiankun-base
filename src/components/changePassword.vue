<template>
  <div class="change-pwd">
    <el-dialog
      title="修改密码"
      :visible.sync="option.show"
      :close-on-click-modal="false"
      width="40%"
    >
      <div class="tips">
        <h3>设置密码</h3>
        <p>密码需至少包含数字、字母或特殊字符的两种，且长度在8-16位之间</p>
      </div>
      <el-form
        ref="form"
        :model="form"
        :inline="false"
        :rules="rules"
        size="mini"
      >
        <el-form-item label="原密码" prop="passWordOld">
          <el-input :type="pwdType[1]" v-model.trim="form.passWordOld">
            <i slot="suffix" @click="togglePwdType(1)">
              <svg-icon
                :icon-class="pwdType[1] == 'password' ? 'eye' : 'eye-open'"
              />
            </i>
          </el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="passWordNew">
          <el-input
            :type="pwdType[2]"
            v-model.trim="form.passWordNew"
            maxlength="16"
          >
            <i slot="suffix" @click="togglePwdType(2)">
              <svg-icon
                :icon-class="pwdType[2] == 'password' ? 'eye' : 'eye-open'"
              />
            </i>
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="passWordSure">
          <el-input
            :type="pwdType[3]"
            v-model.trim="form.passWordSure"
            maxlength="16"
          >
            <i slot="suffix" @click="togglePwdType(3)">
              <svg-icon
                :icon-class="pwdType[3] == 'password' ? 'eye' : 'eye-open'"
              />
            </i>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="submit" size="mini">修改</el-button>
        <el-button @click="cancel" size="mini">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    let validator = (rule, value, callback) => {
      value = value.trim()
      var regx =
        /^(?!([a-zA-Z]+|\d+|[`~!@#$%^&*()_+={};:'"|,<.>?]+)$)[a-zA-Z\d`~!@#$%^&*()_+={};:'"|,<.>?]{8,16}$/
      if (value.match(regx) == null) {
        return callback(new Error('密码格式错误！'))
      }
      return callback()
    }
    return {
      form: {
        passWordOld: '',
        passWordNew: '',
        passWordSure: ''
      },
      rules: {
        passWordOld: {
          required: true,
          message: '原密码不能为空',
          trigger: 'change'
        },
        passWordNew: {
          required: true,
          message: '',
          trigger: 'change',
          validator
        },
        passWordSure: {
          required: true,
          message: '',
          trigger: 'change',
          validator
        }
      },
      pwdType: { 1: 'password', 2: 'password', 3: 'password' }
    }
  },
  methods: {
    togglePwdType(index) {
      this.pwdType[index] =
        this.pwdType[index] == 'password' ? 'text' : 'password'
    },
    cancel() {
      this.$emit('cancel')
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let { passWordNew, passWordSure } = this.form
          if (passWordNew !== passWordSure) {
            return this.$msgErrClose('新密码输入不一致！')
          }
          this.$emit('submit', this.form)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.change-pwd {
  font-size: 12px;
  .tips {
    h3 {
      color: #222;
      font-weight: bold;
      padding-bottom: 8px;
    }
    p {
      color: #969696;
      padding-bottom: 16px;
    }
  }
  i {
    cursor: pointer;
  }
  :deep(.el-form-item) {
    margin-bottom: 10px;
    .el-form-item__label {
      line-height: 20px;
      font-size: 12px;
      user-select: none;
    }
    .el-form-item__error {
      padding-top: 0;
      transform: scale(0.8);
    }
  }
}
</style>
