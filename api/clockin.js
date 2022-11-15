import {
	request
} from '@/common/request'

// 获取打卡记录
export function getClockInRecord(id) {
	return request({
		'url': '/patient/clock-in/' + id + '/detail',
		'method': 'get'
	})
}

// 获取打卡记录
export function getClockIn(params) {
	return request({
		'url': '/patient/clock-in/app',
		'method': 'get',
		'params': params
	})
}

// 获取打卡记录
export function clockIn(pid, data) {
	return request({
		'url': '/patient/clock-in/' + pid + '/finish',
		'method': 'put',
		'param': data
	})
}
