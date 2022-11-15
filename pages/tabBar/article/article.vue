<template>
	<view class="page">
		<view class="top">
			<!-- 搜索 -->
			<view class="search" :style="showNavFloat ? 'display:none' : ''">
				<navigator class="input" :url="'/pages/subcontract/article/search?'" hover-class="none">
					<iconfont type="search"></iconfont>
					<text>请输入关键词</text>
				</navigator>
			</view>
		</view>

		<view class="content">
			<scroller @init="initScroller" @down="refreshData" @up="getData" :up="optUp" @scroll="navFloatShow(scroller)" :fixed="false">
				<articleList :list="articleList"></articleList>
			</scroller>
		</view>
		<pageLoading v-if="showPageLoading"></pageLoading>
	</view>
</template>

<script>
import scroller from '@/components/scroller/scroller.vue';
import articleList from '@/components/article/list.vue';
import pageLoading from '@/components/loading/pageLoading.vue';
import iconfont from '@/components/iconfont/iconfont.vue';
import { getArticleList } from '@/api/article.js';

export default {
	components: { articleList, pageLoading, scroller, iconfont },
	data() {
		return {
			scroller: {},
			optUp: { auto: true, onScroll: true, page: { size: 6 }, empty: { tip: '暂无小知识~' } },
			currentSliderIndex: 0,
			articleList: [],
			showNoData: false,
			showPageLoading: true,
			showNavFloat: false
		};
	},
	onShow() {
		this.loadData();
	},
	onShareAppMessage() {
		return {
			path: '/pages/article/index',
			success: function(e) {},
			title: '小智康复驿站'
		};
	},
	onPullDownRefresh() {
		this.loadData();
	},
	methods: {
		/*初始化滚动*/
		initScroller(scroller) {
			this.scroller = scroller;
		},

		/*刷新数据*/
		refreshData() {
			this.scroller.resetUpScroll();
		},

		/*加载数据*/
		loadData() {
			this.articleList = [];
			this.scroller.resetUpScroll();
		},

		/*获取数据*/
		getData() {
			getArticleList({
				pageNum: this.scroller.num,
				pageSize: this.scroller.size
			})
				.then(res => {
					if (this.scroller.num == 1) {
						this.articleList = [];
					}
					this.articleList = this.articleList.concat(res.rows);
					this.scroller.endByPage(res.rows.length, res.total / this.scroller.size);
					this.showPageLoading = false;
					uni.stopPullDownRefresh();
					uni.hideLoading();
				})
				.catch(res => {
					this.scroller.endErr();
				});
		},

		/*滚动时导航栏浮动*/
		navFloatShow(scroller) {
			if (scroller) {
				if (scroller.scrollTop > 60) {
					if (!this.showNavFloat) {
						this.showNavFloat = true;
					}
				} else {
					if (this.showNavFloat) {
						this.showNavFloat = false;
					}
				}
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
	/*搜索*/
	.search {
		padding: 24rpx 24rpx 0 24rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.logo {
			height: 60rpx;
			width: 474rpx;
			margin-right: 30rpx;
		}
		.input {
			margin-left: 0 !important;
			display: flex;
			align-items: center;
			height: 70rpx;
			width: 100%;
			background: #f5f5f5;
			border-radius: 34rpx 34rpx 34rpx 34rpx;
			/deep/ .icon {
				margin-left: 28rpx;
				color: #aaaaaa;
				font-size: 32rpx;
				line-height: 1;
			}
			text {
				margin-left: 14rpx;
				font-size: 30rpx;
				color: #aaaaaa;
				line-height: 1;
			}
		}
	}
}

.scroll {
	height: 100%;
}

/deep/ .no-data {
	margin-top: 200rpx;
}
</style>
