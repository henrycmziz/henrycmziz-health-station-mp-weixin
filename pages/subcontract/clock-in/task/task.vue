<template>
	<view style="root">
		<view class="page">
			<view class="section">
				<view class="section-title">打卡说明</view>
				<view>{{ plan.remark }}</view>
			</view>

			<view class="section">
				<view class="section-title">视频</view>
				<video
					class="video"
					v-for="(item, index) in videos"
					:key="index"
					:id="item.id"
					:src="item.src"
					:title="item.name"
					@play="playing"
					enable-play-gesture="true"
					:poster="item.poster"
				></video>
			</view>
			<!-- <video class="video" id="demoVideo" src="http://116.62.205.26/prod-api/profile/video/20220227/077888d2-12c6-4299-af97-556b2f442d1f.mp4"></video> -->
		</view>
		<view class="clock-in-btn"><button class="btn" @click="clockIn" v-if="!isClockIn">打卡</button></view>
	</view>

	<!-- tab栏 -->
	<!-- <view class="center-cut-menu">
		<scroll-view scroll-x="true" scroll-with-animation="true" class="scroll-view" :scroll-left="scrollLeft">
			<view class="scroll-item" v-for="(item, index) in list" :key="index" @click="changeMenu(index)">
				<text class="item-text" :class="curIndex == index ? 'active' : ''">{{ item.name }}</text>
			</view>
		</scroll-view>
	</view> -->

	<!-- 左滑右滑 -->
	<!-- <view class="text-area" @touchstart="start" @touchend="end"></view> -->
</template>

<script>
import { getClockIn, clockIn } from '@/api/clockin.js';

export default {
	data() {
		return {
			// tab栏 属性
			// list: [
			// 	{
			// 		id: 1,
			// 		name: '星期一'
			// 	},
			// 	{
			// 		id: 2,
			// 		name: '星期二'
			// 	},
			// 	{
			// 		id: 3,
			// 		name: '星期三'
			// 	},
			// 	{
			// 		id: 4,
			// 		name: '星期四'
			// 	},
			// 	{
			// 		id: 5,
			// 		name: '星期五'
			// 	},
			// 	{
			// 		id: 6,
			// 		name: '星期六'
			// 	}
			// ],
			// contentScrollW: 0, // 导航区宽度
			// curIndex: 0, // 当前选中
			// scrollLeft: 0, // 横向滚动条位置

			userId: this.$store.state.userInfo.userId,
			clockInDate: '',
			clockInId: '',
			plan: {},
			videos: [],
			// baseUrl: 'http://localhost/dev-api'
			baseUrl: 'http://116.62.205.26/prod-api'
		};
	},
	// mounted() {
	// 	// 获取标题区域宽度，和每个子元素节点的宽度
	// 	this.getScrollW();
	// },
	onLoad(option) {
		this.clockInDate = option.clockInDate;
		this.clockInId = option.clockInId;
		this.getPlan();
	},
	methods: {
		getPlan() {
			getClockIn({ id: this.clockInId, clockInTime: this.clockInDate }).then(res => {
				this.plan = res.data;
				if (this.plan.videoInfos != null) {
					this.plan.videoInfos.forEach((item, index) => {
						this.videos.push({ id: 'video' + index, src: this.baseUrl + item.videoUrl, name: item.fileName, poster: this.baseUrl + item.videoThumbnailUrl });
					});
				}
			});
		},
		clockIn() {
			uni.showModal({
				title: '确定打卡',
				editable: true,
				placeholderText: '说些感想吧...',
				success: function(res) {
					if (res.confirm) {
						let that = this;
						clockIn(this.userId, {
							id: this.plan.clockInDetailId,
							clockInTime: this.clockInDate,
							comment: res.content
						}).then(res => {
							that.$u.toast('打卡成功');
							setTimeout(() => {
								// let pages = getCurrentPages(); //当前页面栈
								// let beforePage = pages[pages.length - 2]; //指定调用页面为上个页面
								// beforePage.$vm.getData(); //getData 是你要调用上个页面的方法，$vm 是必须要有的
								// uni.$emit('refreshData');
								// uni.switchTab({
								// 	url: '/pages/tabBar/clock-in/clock-in'
								// });
								uni.navigateBack({
									success: () => {
										let page = getCurrentPages().pop();
										if (page) {
											page.onLoad(page.options); //执行上个页面的方法
										}
									}
								});
							}, 1000);
						});
					} else if (res.cancel) {
						// console.log('用户点击取消');
					}
				}.bind(this)
			});
		},
		playing(e) {
			// 获取当前视频id
			let currentId = e.currentTarget.id;
			// 获取json对象并遍历, 停止非当前视频
			let videos = this.videos;
			for (let i = 0; i < videos.length; i++) {
				let temp = videos[i].id;
				if (temp !== currentId) {
					uni.createVideoContext(temp).pause();
				}
			}
		}

		// tab栏 方法
		// // 获取标题区域宽度，和每个子元素节点的宽度以及元素距离左边栏的距离
		// getScrollW() {
		// 	let query = uni.createSelectorQuery().in(this);
		// 	query
		// 		.select('.scroll-view')
		// 		.boundingClientRect(data => {
		// 			// 拿到 scroll-view 组件宽度
		// 			this.contentScrollW = data.width;
		// 		})
		// 		.exec();

		// 	query
		// 		.selectAll('.scroll-item')
		// 		.boundingClientRect(data => {
		// 			let dataLen = data.length;
		// 			for (let i = 0; i < dataLen; i++) {
		// 				//  scroll-view 子元素组件距离左边栏的距离
		// 				this.list[i].left = data[i].left;
		// 				//  scroll-view 子元素组件宽度
		// 				this.list[i].width = data[i].width;
		// 			}
		// 		})
		// 		.exec();
		// },

		// // 选择标题
		// changeMenu(index) {
		// 	this.curIndex = index;

		// 	// 效果一(当前点击子元素靠左展示)  局限性：子元素宽度相同
		// 	// this.scrollLeft = index * this.list[index].width

		// 	// 效果一(当前点击子元素靠左展示)  子元素宽度不相同也可实现
		// 	// this.scrollLeft = 0;
		// 	// for (let i = 0; i < index; i++) {
		// 	//     this.scrollLeft += this.list[i].width
		// 	// };

		// 	// 效果二(当前点击子元素靠左留一展示)  局限性：子元素宽度相同
		// 	// this.scrollLeft = (index - 1)  * this.list[index].width

		// 	// 效果二(当前点击子元素靠左留一展示)  子元素宽度不相同也可实现
		// 	// this.scrollLeft = 0;
		// 	// for (let i = 0; i < index - 1; i++) {
		// 	// 	this.scrollLeft += this.list[i].width
		// 	// };

		// 	// 效果三(当前点击子元素居中展示)  不受子元素宽度影响
		// 	this.scrollLeft = this.list[index].left - this.contentScrollW / 2 + this.list[index].width / 2;
		// },

		// 左滑右滑
		// start(e) {
		// 	this.startData.clientX = e.changedTouches[0].clientX;
		// 	this.startData.clientY = e.changedTouches[0].clientY;
		// },
		// end(e) {
		// 	// console.log(e)
		// 	const subX = e.changedTouches[0].clientX - this.startData.clientX;
		// 	const subY = e.changedTouches[0].clientY - this.startData.clientY;
		// 	if (subY > 50 || subY < -50) {
		// 		console.log('上下滑');
		// 	} else {
		// 		if (subX > 100) {
		// 			console.log('右滑');
		// 		} else if (subX < -100) {
		// 			console.log('左滑');
		// 		} else {
		// 			console.log('无效');
		// 		}
		// 	}
		// },
	}
};
</script>

<style>
.root {
	background-color: #f1f1f1;
}
.page {
	padding: 10rpx 20rpx;
	margin-bottom: 180rpx;
}
.page video {
	border-radius: 20rpx;
	width: 100%;
}
/* .text-area {
	width: 100%;
	background-color: aquamarine;
} */
</style>

<style lang="scss" scoped>
.section {
	background: #fff;
	border-radius: 20rpx;
	padding: 20rpx;
	margin-bottom: 10rpx;

	.section-title {
		font-size: 36rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}
}
// 打卡按钮
.clock-in-btn {
	position: fixed;
	bottom: 0;
	width: 100%;
	background: #fff;
	box-shadow: 0 0 8px 4px rgba(0, 0, 0, 0.1);

	.btn {
		margin: 20rpx auto;
		width: 200rpx;
		height: 88rpx;
		color: #ffffff;
		border: 2rpx solid linear-gradient(45deg, #4eb55a, #9fc656);
		background: #4eb55a;
	}
}
</style>

<!-- <style lang="scss">
.center-cut-menu {
	width: 100%;
	height: 100rpx;
	box-sizing: border-box;

	.scroll-view {
		height: 100rpx;
		white-space: nowrap;

		.scroll-item {
			height: 100rpx;
			padding: 0 20rpx;
			display: inline-block;
			text-align: center;

			.item-text {
				font-size: 30rpx;
				line-height: 100rpx;

				&.active {
					color: #1468ff;
				}
			}
		}
	}
}
</style> -->
