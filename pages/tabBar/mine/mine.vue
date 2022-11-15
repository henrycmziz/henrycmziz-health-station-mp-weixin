<template>
	<view class="wrap">
		<js-lang title="user.title"></js-lang>
		<view class="header">
			<view class="userinfo">
				<view class="image" @click="navTo('/pages/subcontract/mine/info')"><image :src="avatar"></image></view>
				<view class="info">
					<view class="username">{{ nickName }}</view>
				</view>
			</view>
			<!-- <view class="logout"><u-button type="success" shape="circle" size="mini" @click="logout">退出登录</u-button></view> -->
		</view>
		<view class="toolbar">
			<view class="box">
				<navigator class="item" hover-class="hover" url="/pages/subcontract/mine/info">
					<view class="icon"><u-icon class="u-icon" :style="{ color: '#ea9a44' }" name="account"></u-icon></view>
					<text class="label">个人信息</text>
				</navigator>
				<navigator class="item" hover-class="hover" url="/pages/subcontract/mine/pwd">
					<view class="icon"><u-icon class="u-icon" :style="{ color: '#a571fd' }" name="question-circle"></u-icon></view>
					<text class="label">修改密码</text>
				</navigator>
				<navigator class="item" hover-class="hover" @click="help">
					<view class="icon"><u-icon class="u-icon" :style="{ color: '#ea9a44' }" name="account"></u-icon></view>
					<text class="label">帮助中心</text>
				</navigator>
			</view>
		</view>
		<view class="u-p-t-10 u-p-b-20">
			<view class="u-m-t-20">
				<u-cell-group>
					<u-cell-item icon="heart" :iconSize="iconSize" :iconStyle="{ color: '#0a1aff' }" title="关于我们" @click="about"></u-cell-item>
					<u-cell-item icon="kefu-ermai" :iconSize="iconSize" :iconStyle="{ color: '#a571fd' }" title="意见反馈" @click="navTo('/pages/subcontract/mine/comment')"></u-cell-item>
					<u-cell-item icon="clock" :iconSize="iconSize" :iconStyle="{ color: '#ff6f27' }" title="检查更新" @click="upgrade()"></u-cell-item>
				</u-cell-group>
			</view>
			<view class="u-m-t-20">
				<u-cell-group><u-cell-item icon="setting" :iconSize="iconSize" :iconStyle="{ color: '#1a94ff' }" title="系统设置" @click="navTo('/pages/subcontract/mine/setting')"></u-cell-item></u-cell-group>
			</view>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			iconSize: 38,
			userInfo: {},
			avatar: this.$store.state.userInfo.avatar,
			nickName: this.$store.state.userInfo.nickName
		};
	},
	onShow() {
		this.avatar = this.$store.state.userInfo.avatar;
	},
	methods: {
		navTo(url) {
			uni.navigateTo({
				url: url
			});
		},
		logout() {
			this.showConfirm('确认退出登录吗?').then(res => {
				if (res.confirm) {
					this.$store.dispatch('LogOut').then(res => {
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/login/login'
							});
						}, 500);
					});
				}
			});
		},
		upgrade() {
			this.$u.toast('小程序端无需检查更新');
		},
		help() {
			this.$u.toast('帮助中心');
		},
		about() {
			this.$u.toast('关于我们');
		}
	}
};
</script>
<style lang="scss">
@import 'index.scss';
page {
	background-color: #f8f8f8;
}
</style>
