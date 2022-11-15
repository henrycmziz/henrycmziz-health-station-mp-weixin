<template>
	<view class="container">
		<web-view v-if="info.articleFrom == 1" :src="info.articleUrl"></web-view>
		<view class="content" v-if="info.articleFrom == 0">
			<view class="detail">
				<view class="title">{{ info.title }}</view>
				<view class="info">
					<view class="article-date">
						<!-- <text class="article" v-if="info.articleUrl" @tap="copyText(info.articleUrl)">{{ info.article }}</text> -->
						<!-- <text class="article" v-else>{{ info.article }}</text> -->
						<text class="date hidden">{{ info.createTime.slice(0, 10) }}</text>
					</view>
					<view class="clicks">阅读 {{ info.clicks }}</view>
				</view>
				<view class="main-text"><mp-html :content="info.article" /></view>
			</view>
		</view>
		<pageLoading v-if="showPageLoading"></pageLoading>
	</view>
</template>

<script>
import pageLoading from '@/components/loading/pageLoading.vue';
import iconfont from '@/components/iconfont/iconfont.vue';
import loading from './components/loading/loading.vue';
import { getArticleDetail } from '@/api/article.js';

export default {
	components: { pageLoading, loading, iconfont },
	data() {
		return {
			id: 0,
			info: {},
			showPageLoading: true
		};
	},
	onLoad(e) {
		if (e.id > 0) {
			this.id = e.id;
		}
		this.getData();
	},
	onPullDownRefresh() {
		this.getData();
	},
	methods: {
		/*获取文章详情*/
		getData() {
			getArticleDetail(this.id).then(res => {
				this.info = res.data;
				uni.setNavigationBarTitle({
					title: this.info.title
				});
				this.showPageLoading = false;
			});
		}
	}
};
</script>

<style scoped lang="scss">
.detail {
	padding: 40rpx 32rpx;
	background: #fff;
	.title {
		font-size: 44rpx;
		color: #262626;
		line-height: 70rpx;
		font-weight: bold;
	}
	.info {
		margin-top: 32rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		.article-date {
			.article {
				color: #666;
			}
			.date {
				color: #999;
				margin-left: 24rpx;
			}
		}
		.clicks {
			color: #999;
		}
	}
	.main-text {
		margin-top: 56rpx;
		overflow: hidden;
		color: #262626;
		.wxParse {
			color: #262626;
		}
	}
}
</style>
