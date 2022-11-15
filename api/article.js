import {
	request
} from '@/common/request'

// 获取小知识列表
export function getArticleList(param) {
	return request({
		'url': '/resource/article/app-list',
		'method': 'get',
		'param': param
	})
}

// 获取小知识列表
export function getArticleDetail(id) {
	return request({
		'url': '/resource/article/' + id,
		'method': 'get'
	})
}
