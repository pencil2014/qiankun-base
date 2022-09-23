import request from './request.js'

export function login(data) {
  return request({
    url: '/base/common/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/base/webapi/sysUser/info',
    method: 'post',
    data: {} // { token }
  })
}

export function logout(data) {
  return request({
    url: '/base/common/logout',
    method: 'post',
    data
  })
}

export function getMenu(data) {
  return request({
    url: '/base/webapi/menu/allMenuCheckAuthV2',
    method: 'post',
    data
  })
}

//批量已读
export function noticeWebsiteRead(data) {
  return request({
    url: '/msg/notice/website/read',
    method: 'post',
    data
  })
}
//批量删除
export function noticeWebsiteDelete(data) {
  return request({
    url: '/msg/notice/website/delete',
    method: 'post',
    data
  })
}
export function noticeWebsiteList(data) {
  return request({
    url: '/msg/notice/website/list',
    method: 'post',
    data
  })
}

export function noticeMsgUpgrade(data) {
  return request({
    url: '/msg/notice/website/msgUpgrade',
    method: 'post',
    data
  })
}

export function getDictList(data) {
	return request({
		url: '/base/webapi/dict/list',
		method: 'post',
		data
	})
}

// 刷新token
export function refreshToken(data) {
	return request({
		url: '/base/common/session/refreshToken',
		method: 'post',
		data
	})
}

// 修改密码
export function updatePassWord(data) {
	return request({
		url: '/base/webapi/sysUser/updatePassWord',
		method: 'post',
		data
	})
}

// 忘记密码-发送邮件
export function sendResetPasswordEmail(data) {
	return request({
		url: '/base/common/fgpw/sendResetPasswordEmail',
		method: 'post',
		data
	})
}

// 忘记密码-重置密码提交
export function resetPasswordByEmail(data) {
	return request({
		url: '/base/common/fgpw/resetPasswordByEmail',
		method: 'post',
		data
	})
}

// 校验激活码有效期
export function checkCodeExpired(data) {
	return request({
		url: '/base/common/fgpw/checkCodeExpired',
		method: 'post',
		data
	})
}