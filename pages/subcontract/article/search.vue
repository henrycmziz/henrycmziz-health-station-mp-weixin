<template>
	<view class="page">
		<view class="top">
			<!--搜索-->
			<search :name="searchName" :keyword.sync="keyword" :history.sync="history" :showHistory.sync="showHistory" @confirm="search" @focus="initSearch"></search>
		</view>
		<view class="content" v-if="!showHistory">
			<scroll-view class="scroll" scroll-y @scrolltolower="loadMore">
				<articleList :list="list" />
				<loading :status="hasMoreData"></loading>
				<noData v-if="showNoData" text="暂无相关文章~"></noData>
			</scroll-view>
		</view>
		<pageLoading v-if="showPageLoading"></pageLoading>
	</view>
</template>

<script>
import articleList from '@/components/article/list.vue';
import loading from './components/loading/loading.vue';
import search from './components/search/search.vue';
import noData from './components/noData/noData.vue';
import pageLoading from '@/components/loading/pageLoading.vue';
import iconfont from '@/components/iconfont/iconfont.vue';
import { getArticleList } from '@/api/article.js';

export default {
	components: { search, articleList, pageLoading, loading, noData, iconfont },
	data() {
		return {
			searchName: 'article-search',
			keyword: '',
			history: [],
			showHistory: true,
			page_index: 1,
			page_size: 3,
			list: [],
			showNoData: false,
			showPageLoading: false,
			hasMoreData: true
		};
	},
	onLoad(e) {
		let history = uni.getStorageSync(this.searchName);
		if (Array.isArray(history)) {
			this.history = history;
		}
	},
	onReady() {},
	methods: {
		/*搜索*/
		initSearch() {
			this.showHistory = true;
		},
		search(keyword) {
			if (keyword != '') {
				this.keyword = keyword;
			}
			this.showHistory = false;
			if (!this.history.includes(this.keyword)) {
				this.history.push(this.keyword);
				uni.setStorageSync(this.searchName, this.history);
			}
			this.loadData();
		},

		/*加载数据*/
		loadData() {
			this.hasMoreData = true;
			this.page_index = 1;
			this.showNoData = false;
			this.list = [];
			this.getData();
		},

		/*获取数据*/
		getData() {
			getArticleList({
				title: this.keyword,
				pageNum: this.page_index,
				pageSize: this.page_size
			})
				.then(res => {
					if (this.page_index == 1) {
						this.list = [];
					}
					if (res.total / this.page_size > this.page_index) {
						this.hasMoreData = true;
					} else {
						this.hasMoreData = false;
					}
					this.list = this.list.concat(res.rows);
					if (this.page_index == 1) {
						if (this.list.length > 0) {
							this.showNoData = false;
						} else {
							this.showNoData = true;
						}
					}
					this.showPageLoading = false;
					this.page_index += 1;
				})
				.catch(res => {});
		},

		/*加载更多*/
		loadMore() {
			if (this.hasMoreData) {
				this.getData();
			}
		}
	}
};
</script>

<style scoped lang="scss">
page {
	height: 100%;
}
.page {
	display: flex;
	flex: 1;
	flex-direction: column;
	overflow: hidden;
	height: 100%;
}
.content {
	flex: 1;
	width: 100%;
	height: 100rpx;
}

/*头部*/
.top {
	/*页面标题*/
	padding-bottom: 20rpx;
	.page-title {
		padding: 16rpx 0 6rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 90rpx;
		text-align: center;
		border-bottom: 1rpx solid #efefef;
		z-index: 9999;
		.back {
			flex-grow: 0;
			flex-shrink: 0;
			line-height: normal;
			padding-left: 30rpx;
			/deep/.icon {
				color: #c1c4c9;
				font-size: 36rpx;
			}
		}
		.logo {
			flex-grow: 1;
			flex-shrink: 1;
			line-height: normal;
			image {
				height: 50rpx;
				width: 280rpx;
				margin-left: -110rpx;
			}
		}
	}
}

.scroll {
	height: 100%;
}
</style>
