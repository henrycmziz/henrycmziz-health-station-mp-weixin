<template>
	<view class="list" v-if="list.length > 0">
		<navigator :url="'/pages/subcontract/article/detail?id=' + item.id" class="item" v-for="(item, index) in list" :key="index" hover-class="none">
			<view class="info">
				<view class="text">
					<view class="title">{{ item.title }}</view>
					<view class="other">
						<view class="left">
							<!-- <view class="source" v-if="item.createBy">{{ item.createBy }}</view> -->
							<view class="time">{{ item.createTime.slice(0, 10) }}</view>
						</view>
						<view class="right" v-if="item.comment_count > 0">
							<!-- <image src="/static/images/icon_comment.png"></image> -->
							<text>{{ item.comment_count }}</text>
						</view>
						<view class="right view" v-else>
							<image src="/static/icon/icon_view.png"></image>
							<text>{{ item.clicks }}</text>
						</view>
					</view>
				</view>
				<view class="photo" v-if="item.thumbnail != null &item.thumbnail != ''"><image :src="baseUrl + item.thumbnail" mode="aspectFill"></image></view>
			</view>
			<view class="line"></view>
		</navigator>
	</view>
</template>

<script>
import config from '@/config';

export default {
	name: 'articleList',
	props: {
		list: {
			type: Array,
			default: function(e) {
				return [];
			}
		}
	},
	data() {
		return {
			baseUrl: config.baseUrl
		};
	}
};
</script>

<style lang="scss">
/*文章列表*/
.list {
	margin-top: 2rpx;
	.item {
		padding: 40rpx 24rpx 0 24rpx;
		.info {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding-bottom: 4rpx;
			.text {
				flex-grow: 1;
				flex-shrink: 1;
				display: flex;
				flex-direction: column;
				margin-right: 40rpx;
				.title {
					flex-grow: 1;
					flex-shrink: 1;
					font-size: 34rpx;
					line-height: 1.5;
					display: -webkit-box;
					text-overflow: ellipsis;
					word-break: break-all;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
					height: 91rpx;
					margin-bottom: 8rpx;
				}
				.other {
					flex-grow: 1;
					flex-shrink: 1;
					display: flex;
					align-items: center;
					font-size: 28rpx;
					color: #999;
					line-height: normal;
					.left {
						display: flex;
						flex-grow: 1;
						flex-shrink: 1;
						.source {
							display: -webkit-box;
							text-overflow: ellipsis;
							word-break: break-all;
							-webkit-line-clamp: 1;
							-webkit-box-orient: vertical;
							overflow: hidden;
							width: 140rpx;
							margin-right: 16rpx;
						}
					}
					.right {
						display: flex;
						flex-direction: row;
						justify-content: center;
						align-items: center;
						flex-grow: 0;
						flex-shrink: 0;
						margin-right: 5rpx;
						image {
							flex-grow: 1;
							flex-shrink: 1;
							width: 28rpx;
							height: 28rpx;
							margin-right: 12rpx;
						}
						text {
							flex-grow: 1;
							flex-shrink: 1;
							margin-top: -6rpx;
						}
					}
					.view {
						image {
							width: 40rpx;
							height: 40rpx;
							margin-right: 5rpx;
						}
					}
				}
			}
			.photo {
				image {
					height: 170rpx;
					width: 222rpx;
					border-radius: 10rpx;
				}
			}
		}
		.line {
			display: bock;
			width: 100%;
			height: 1rpx;
			margin-top: 22rpx;
			background: #e8e8e8;
		}
		&:last-child {
			.line {
				//display: none;
			}
			//padding-bottom: 30rpx;
		}
	}
}
</style>
