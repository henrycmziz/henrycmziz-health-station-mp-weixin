import {
	request,
	upload
} from '@/common/request'

// 修改用户
export function updateUser(param) {
	return request({
		'url': '/system/user/profile',
		'method': 'PUT',
		'param': param
	})
}

// 用户头像上传
export function uploadAvatar(path) {
	return upload({
		url: '/system/user/profile/avatar',
		path: path,
		name: 'avatarfile'
	})
}

// 用户密码重置
export function resetUserPwd(param) {
	return request({
		'url': '/system/user/profile/updatePwd',
		'method': 'PUT',
		'param': param
	})
}
