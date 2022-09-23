<template>
  <div class="user-info">
    <div class="account-box">
      <div class="user-header">
        <img src="../assets/head.png" alt />
      </div>
      <div class="user-wish">
        <img src="../assets/userInfo/icon-sun.png" alt /> hello～{{
          userInfo.userName
        }}，祝你工作愉快每一天！
      </div>
      <div class="user-des">
        <div class="company-box">
          <p>
            <img src="../assets/userInfo/icon-company.png" />公司：{{
              userInfo.compName
            }}
          </p>
          <p>
            <img src="../assets/userInfo/icon-dept.png" /> 部门：{{
              userInfo.deptName
            }}
          </p>
        </div>
        <div class="member-box">
          <p>
            <img src="../assets/userInfo/icon-user.png" /> 账号：{{
              userInfo.loginAccount || '-'
            }}
          </p>
          <p>
            <i class="el-icon-s-grid" style="font-size: 14px"></i> 编号：{{
              userInfo.sysUserId || '-'
            }}
          </p>
          <p>
            <img src="../assets/userInfo/icon-code.png" /> 工号：{{
              userInfo.employeeNo || '-'
            }}
          </p>
          <p>
            <img src="../assets/userInfo/icon-tel.png" /> 手机：{{
              userInfo.mobileNo || '-'
            }}
          </p>
          <p>
            <img src="../assets/userInfo/icon-telephone.png" /> 座机：{{
              userInfo.telephone || '-'
            }}
          </p>
          <p>
            <img src="../assets/userInfo/icon-email.png" /> 邮箱：{{
              userInfo.email || '-'
            }}
          </p>
          <p>
            <i class="el-icon-share" style="font-size: 14px"></i> 邀请码：{{
              userInfo.invideCode || '-'
            }}
          </p>
        </div>
      </div>
      <div class="user-list">
        <div class="item-box">
          <div class="title">所属部门</div>
          <ul>
            <li
              v-for="(item, index) in userInfo.departFullNames || []"
              :key="index"
            >
              {{ item }}
            </li>
          </ul>
        </div>
        <div class="item-box">
          <div class="title">可看角色</div>
          <ul>
            <li v-for="(item, index) in userInfo.roleNames || []" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>
        <div class="item-box">
          <div class="title">可看分公司</div>
          <ul>
            <li
              v-for="(item, index) in userInfo.companyNames || []"
              :key="index"
            >
              {{ item }}
            </li>
          </ul>
        </div>
        <div class="item-box">
          <div class="title">可看航线</div>
          <ul>
            <li
              v-for="(item, index) in userInfo.systemLineNames || []"
              :key="index"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import actions from '@/store'
export default {
  name: 'UserInfo',
  data() {
    return {}
  },
  computed: {
    userInfo() {
      let base = actions.getGlobalState('userInfo') || {}
      if (!base.userName) {
        base = JSON.parse(localStorage.getItem('userInfo') || '{}')
      }
      return base
    }
  }
}
</script>

<style lang="scss" scoped>
.user-info {
  .account-box {
    text-align: center;
    .user-header {
      display: inline-block;
      width: 100px;
      height: 100px;
      border: 5px solid #f6f6f6;
      border-radius: 100%;
      overflow: hidden;
      margin: 30px auto 18px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .user-wish {
      line-height: 20px;
      font-size: 16px;
      color: #222;
      font-weight: 700;
      display: flex;
      justify-content: center;
      img {
        margin-right: 3px;
      }
    }
    .user-des {
      margin-top: 25px;
      .company-box,
      .member-box {
        display: flex;
        justify-content: center;
        p {
          margin-right: 24px;
          display: flex;
          align-items: center;
          line-height: 16px;
          img,i{
            margin-right: 5px;
            color: #000;
          }
        }
      }
      .member-box {
        margin: 8px;
      }
    }
    .user-list {
      margin-top: 50px;
      display: flex;
      justify-content: space-around;
      align-items: flex-start;
      .item-box {
        width: 20%;
        border-radius: 2px;
        border: 1px solid #4a4a4a;
        .title {
          height: 24px;
          line-height: 24px;
          background-color: #4a4a4a;
          color: #fff;
        }
        li {
          list-style: none;
          color: #4a4a4a;
          border-bottom: 1px solid #e9e9e9;
          line-height: 24px;
          height: 24px;
        }
      }
    }
  }
}
</style>
