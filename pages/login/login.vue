<template>
	<view class="wrap">
		<view class="logo">小 智 康 复 驿 站</view>
		<view class="form">
			<view class="form-call">
				<iconfont type="user-01"></iconfont>
				<input class="u-input" type="text" v-model="loginForm.username" maxlength="32" placeholder="请输入用户名" />
			</view>
			<view class="form-call">
				<iconfont type="password-o"></iconfont>
				<input class="u-input" type="text" v-model="loginForm.password" maxlength="32" placeholder="请输入密码" :password="!showPassword" />
				<image class="u-icon-right" :src="'/static/icon/login/eye_' + (showPassword ? 'open' : 'close') + '.png'" @click="showPass()"></image>
			</view>
			<div style="padding:15rpx 0 0;margin-top: 40rpx;"><u-checkbox v-model="rememberMe" active-color="#5473e8">记住密码</u-checkbox></div>
		</view>
		<view class="button" @click="submit('1')"><text>登录</text></view>
	</view>
</template>
<script>
import { checkPwd } from '@/common/validate.js';
import { getCodeImg } from '@/api/login';
import { updateUser } from '@/api/user.js';

export default {
	data() {
		return {
			codeUrl: '',
			captchaOnOff: false,
			showPassword: false,
			rememberMe: uni.getStorageSync('rememberMe'),
			loginForm: {
				username: this.$store.state.userInfo.userName,
				password: '',
				code: '',
				uuid: ''
			},
			register: false,
			userExtend2: ''
		};
	},
	onLoad() {
		// #ifdef APP-PLUS
		// 获取客户端标识
		let pinf = plus.push.getClientInfo();
		if (pinf && pinf.clientid) uni.setStorageSync('cid', pinf.clientid);
		else {
			var obtainingCIDTimer = setInterval(function() {
				pinf = plus.push.getClientInfo();
				if (pinf.clientid) {
					uni.setStorageSync('cid', pinf.clientid);
					clearInterval(obtainingCIDTimer);
				}
			}, 50);
		}
		setTimeout(() => {
			console.log('cid', uni.getStorageSync('cid'));
		}, 500);
		// #endif
		// this.getCode();
		if (uni.getStorageSync('rememberMe')) this.loginForm.password = uni.getStorageSync('password');
	},
	methods: {
		showPass() {
			this.showPassword = !this.showPassword;
		},
		// getCode() {
		// 	getCodeImg().then(res => {
		// 		this.captchaOnOff = res.captchaOnOff === undefined ? true : res.captchaOnOff;
		// 		if (this.captchaOnOff) {
		// 			this.codeUrl = 'data:image/gif;base64,' + res.img;
		// 			this.loginForm.uuid = res.uuid;
		// 		}
		// 	});
		// },
		submit() {
			if (!this.loginForm.username) {
				this.toast('请填写用户名');
				return;
			}
			if (!this.loginForm.password) {
				this.toast('请填写密码');
				return;
			}
			this.toast('登录中...');
			this.$store
				.dispatch('Login', this.loginForm)
				.then(() => {
					uni.setStorageSync('rememberMe', this.rememberMe);
					if (this.rememberMe) uni.setStorageSync('password', this.loginForm.password);
					this.$store.dispatch('GetInfo').then(res => {
						let param = {
							userExtend2: uni.getStorageSync('cid')
						};
						updateUser(param).then(res => {
							uni.reLaunch({
								url: '/pages/tabBar/clock-in/clock-in'
							});
						});
					});
				})
				.catch(() => {
					if (this.captchaOnOff) {
						this.getCode();
					}
				});
		}
	}
};
</script>
<style lang="scss">
.logo {
	font: 64rpx '微软雅黑';
	margin: 50px auto;
	font-weight: 500;
	text-align: center;
	color: #16a085;
	// animation: bounce 2s;
}

.form {
	display: flex;
	flex-direction: column;
	padding: 40rpx 70rpx 40rpx 70rpx;
}

.form-call {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding-top: 10rpx;
	height: 120rpx;
	font-weight: normal;
	color: #333333;
	border-bottom: 0.5px solid #e2e2e2;
}

.form-call .u-input {
	flex: 1;
	font-size: 39rpx;
	text-align: left;
	margin-left: 16rpx;
}

.form-call .u-icon-right {
	padding: 10px;
	color: #aaaaaa;
	width: 50rpx;
	height: 40rpx;
}

.button {
	color: #ffffff;
	font-size: 32rpx;
	width: 80%;
	height: 80rpx;
	background: #497bff;
	box-shadow: 0rpx 0rpx 13rpx 0rpx rgba(15, 168, 250, 0.4);
	border-radius: 30rpx;
	line-height: 80rpx;
	text-align: center;
	margin: 50rpx auto 0;
}
</style>
