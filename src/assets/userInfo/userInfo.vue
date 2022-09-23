<template>
	<div class="finance-page">
		<div class="user-header">
			<div class="user-bg">
				<div class="bg-ball ball-1"></div>
				<div class="bg-ball ball-2"></div>
			</div>
			<el-button class="finance-btn" type="primary" size="mini" @click="alterInfo">修改个人信息</el-button>
			<div class="user-img">
				<img src="../../assets/head.png" alt />
				<div class="user-edit">
					<!-- <span @click="alertPic">更换</span> -->
				</div>
			</div>
			<div class="user-wish">
				<img src="../../assets/userInfo/icon-sun.png" alt />
				<span>hello～{{ userInfo.userName }}，祝你工作愉快每一天！</span>
			</div>
		</div>
		<div class="user-des">
			<div>
				<span>
					<img src="../../assets/userInfo/icon-company.png" />
					公司：{{ userInfo.compName }}
				</span>
				<span>
					<img src="../../assets/userInfo/icon-dept.png" />
					部门：{{ userInfo.deptName }}
				</span>
			</div>
			<div class="number-box">
				<span>
					<img src="../../assets/userInfo/icon-user.png" />
					账号：{{ userInfo.loginAccount || '-'}}
				</span>
        <span>
					<i class="el-icon-s-grid" style="font-size: 14px;"></i>
					编号：{{ userInfo.sysUserId || '-'}}
				</span>
				<span>
					<img src="../../assets/userInfo/icon-code.png" />
					工号：{{ userInfo.employeeNo || '-' }}
				</span>
				<!-- <span>
          <img src="../../assets/userInfo/icon-sex.png" />
          {{sexObj[userInfo.gender] || '-'}}
        </span> -->
				<span>
					<img src="../../assets/userInfo/icon-tel.png" />
					手机：{{ userInfo.mobileNo || '-' }}
				</span>
				<span>
					<img src="../../assets/userInfo/icon-telephone.png" />
					座机：{{ userInfo.telephone || '-' }}
				</span>
				<span>
					<img src="../../assets/userInfo/icon-email.png" />
					邮箱：{{ userInfo.email || '-' }}
				</span>
        <span>
          <i class="el-icon-share" style="font-size: 14px;"></i>
          邀请码：{{userInfo.invideCode || '-'}}
        </span>
			</div>
		</div>
		<div class="user-list">
			<div>
				<div class="list-title">所属部门</div>
				<div class="list-content" v-for="(item, index) in userInfo.departFullNames || []" :key="index">{{ item }}</div>
			</div>
			<div>
				<div class="list-title">可看角色</div>
				<div class="list-content" v-for="(item, index) in userInfo.roleNames || []" :key="index">{{ item }}</div>
			</div>
			<div>
				<div class="list-title">可看分公司</div>
				<div class="list-content list-content-companyname" v-for="(item, index) in userInfo.companyNames || []" :key="index">
					<el-tooltip :content="item" placement="top-start">
						<span>{{ item }}</span>
					</el-tooltip>
				</div>
			</div>
			<div>
				<div class="list-title">可看航线</div>
				<div class="list-content" v-for="(item, index) in userInfo.systemLineNames || []" :key="index">{{ item }}</div>
			</div>
		</div>
		<LsDialog v-if="alterDialog.show" :option="alterDialog" @close="dialogClose" />
	</div>
</template>

<script>
import LsDialog from '../baseData/commonData/taxRate/baseDialog'
import { updateInfo } from '@/api/base'
export default {
	components: {
		LsDialog
	},
	data() {
		let rules = [{ required: true, message: ' ', trigger: 'blur' }]
		let mobileRule = [
			{
				required: true,
				message: ' ',
				trigger: 'change',
				validator: (rule, value, callback) => {
					if (value === '') {
						callback(new Error('请输入手机号码'))
					} else {
						const emailrule = /^1[3-9]\d{9}$/
						if (!emailrule.test(value)) {
							callback(new Error('请输入有效手机号码'))
						} else {
							callback()
						}
					}
				}
			}
		]
		let emailRule = [
			{
				required: true,
				message: ' ',
				trigger: 'change',
				validator: (rule, value, callback) => {
					if (value === '') {
						callback(new Error('请输入邮箱'))
					} else {
						const emailrule = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/
						if (!emailrule.test(value)) {
							callback(new Error('请输入有效邮箱'))
						} else {
							callback()
						}
					}
				}
			}
		]
		let sexList = [
			{ label: '男', value: 'male' },
			{ label: '女', value: 'female' }
		]
		return {
			sexList,
			sexObj: { male: '男', female: '女' },
			alterDialog: {
				show: false,
				title: '修改个人信息',
				inputFull: true,
				formItems: [
					{ label: '性别', type: 'select', prop: 'gender', rules, selectOptions: sexList },
					{ label: '手机号码', type: 'input', prop: 'mobileNo', rules: mobileRule },
					{ label: '座机号码', type: 'input', prop: 'telephone' },
					{ label: '电子邮箱', type: 'input', prop: 'email', rules: emailRule },
          { label: 'QQ号码', type: 'input', prop: 'qq' },
					{ label: '邮件签名', type: 'richtext', prop: 'emailSign' }
				],
				form: { gender: '', telephone: '', mobileNo: '', email: '', emailSign: '', qq: '' },
				labelWidth: '80px',
				padding: '0',
				btnCfg: { text: '修改', type: 'warning' }
			}
		}
	},
	mounted() {
	},
	computed: {
		userInfo() {
			return this.$store.state.user.userInfo || {}
		}
	},
	methods: {
		alertPic() {
			alert('暂未做')
		},
		alterInfo() {
			this.alterDialog.show = true
			this.$nextTick(() => {
        let {gender='', telephone='', mobileNo='', email='', emailSign='', qq = ''} =  this.userInfo
        Object.assign(this.alterDialog.form, {
          gender, 
          telephone, 
          mobileNo, 
          email, 
          emailSign, 
          qq
        })
				// this.alterDialog.form.gender = this.userInfo.gender
				// this.alterDialog.form.telephone = this.userInfo.telephone
				// this.alterDialog.form.mobileNo = this.userInfo.mobileNo
				// this.alterDialog.form.email = this.userInfo.email
				// this.alterDialog.form.emailSign = this.userInfo.emailSign
			})
		},
		dialogClose(tag) {
			if (!tag) {
				this.alterDialog.show = false
				return
			}
			updateInfo({ ...this.alterDialog.form, employeeId: +this.userInfo.sysUserId }).then(res => {
				this.$msgSucClose('修改成功！')
				Object.assign(this.$store.state.user.userInfo, this.alterDialog.form)
				this.alterDialog.show = false
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.user-header {
	position: relative;
	overflow: hidden;
	width: 100%;
	height: 180px;
	text-align: center;
	& > div {
		position: relative;
		z-index: 1;
	}
	.user-bg {
		position: absolute;
		top: -320px;
		left: 50%;
		transform: translate(-50%, 0);
		width: 130%;
		height: 500px;
		background: #fafbfc;
		// background: #ccc;
		border-radius: 80%;
		z-index: 0;
		.bg-ball {
			position: absolute;
			left: 30%;
			top: 368px;
			width: 57px;
			height: 57px;
			background: linear-gradient(135deg, #c5c5c5 0%, #434343 100%);
			border-radius: 100%;
			opacity: 0.04;
			&.ball-2 {
				width: 182px;
				height: 182px;
				top: 203px;
				left: 66%;
			}
		}
	}
	.user-img {
		display: inline-block;
		width: 100px;
		height: 100px;
		border: 5px solid #f6f6f6;
		border-radius: 100%;
		overflow: hidden;
		margin-top: 30px;
		& > img {
			width: 100%;
			height: 100%;
		}
		.user-edit {
			position: absolute;
			width: 100%;
			height: 16px;
			line-height: 14px;
			font-size: 12px;
			bottom: 0;
			background-color: rgba(0, 0, 0, 0.3);
			& > span {
				color: #cfcfcf;
				cursor: pointer;
			}
		}
	}
	.user-wish {
		line-height: 20px;
		margin-top: 8px;
		font-size: 16px;
		color: #222;
		font-weight: bold;
		& > img {
			margin-right: 3px;
			vertical-align: middle;
		}
		& > span {
			display: inline-block;
			vertical-align: middle;
		}
	}
}
.user-des > div {
	text-align: center;
	line-height: 16px;
	margin: 8px;
	& > span {
		display: inline-block;
		margin-right: 24px;
    height: 16px;
    line-height: 16px;
		&:last-of-type(1) {
			margin: 0;
		}
	}
	img {
		vertical-align: middle;
		margin-top: -2px;
	}
}
.user-list {
	margin-top: 50px;
	overflow: hidden;
	& > div {
		float: left;
		width: 21.25%;
		margin-left: 3%;
		border-radius: 2px;
		border: 1px solid #4a4a4a;
		&:nth-last-of-type(1) {
			margin-right: 0;
		}
		& > div {
			text-align: center;
			color: #4a4a4a;
			border-top: 1px solid #e9e9e9;
			&.list-title {
				border-top: none;
				background: #4a4a4a;
				color: #ffffff;
			}
			line-height: 24px;
			height: 24px;
		}
	}
}
.user-list .list-content-companyname {
	width: 100%;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
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
.finance-btn {
	position: absolute;
	top: 20px;
	left: 20px;
}
</style>
