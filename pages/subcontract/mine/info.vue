<template>
	<view class="wrap body">
		<view class="u-m-t-50 u-flex u-flex-col u-text-center">
			<u-avatar size="150" :src="avatar" @click="chooseAvatar"></u-avatar>
		</view>
		<u-form class="form" :model="model" :rules="rules" ref="uForm">
			<u-form-item label="姓名" prop="nickName" label-width="120">{{ model.nickName }}</u-form-item>
			<u-form-item label="性别" prop="sex" label-width="120">
				<js-radio v-model="model.sex" dict-type="sys_user_sex"></js-radio>
				<u-radio-group v-model="model.sex">
					<u-radio v-for="(item, index) in sex" :key="index" :name="item.value">{{ item.name }}</u-radio>
				</u-radio-group>
			</u-form-item>
			<u-form-item label="邮箱" prop="email" label-width="120"><u-input placeholder="请输入电子邮箱" v-model="model.email" type="text"></u-input></u-form-item>
			<u-form-item label="手机" prop="phonenumber" label-width="120">
				<u-input placeholder="请输入手机号码" v-model="model.phonenumber" type="number" maxlength="11"></u-input>
			</u-form-item>
			<u-form-item label="上次登录时间" label-width="250">{{ model.loginDate }}</u-form-item>
			<u-form-item label="上次登录地址" label-width="250">{{ model.loginIp }}</u-form-item>
		</u-form>
		<view class="form-footer">
			<u-button class="btn" type="primary" @click="submit">提交</u-button>
			<div style="margin-top: 20rpx;"></div>
			<u-button class="btn" type="default" @click="cancel">关闭</u-button>
		</view>
	</view>
</template>
<script>
import config from '@/config';
import { uploadAvatar, updateUser } from '@/api/user.js';
import { commonUpload } from '@/api/business.js';

export default {
	data() {
		return {
			baseUrl: config.baseUrl,
			avatar: this.$store.state.userInfo.avatar,
			model: {},
			sex: [
				{
					name: '男',
					value: '0'
				},
				{
					name: '女',
					value: '1'
				},
				{
					name: '未知',
					value: '2'
				}
			],
			rules: {
				phonenumber: [
					{
						required: true,
						message: '请输入手机号',
						trigger: ['change', 'blur']
					},
					{
						validator: (rule, value, callback) => {
							return value == '' || this.$u.test.mobile(value);
						},
						message: '手机号码不正确',
						trigger: ['change', 'blur']
					}
				],
				email: [
					{
						type: 'email',
						message: "'请输入正确的邮箱地址",
						trigger: ['blur', 'change']
					}
				]
			}
		};
	},
	onLoad() {
		this.updateInfo();

		uni.$on('uAvatarCropper', path => {
			uploadAvatar(path).then(res => {
				this.avatar = this.baseUrl + res.imgUrl;
				this.updateInfo();
			});
		});
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	},
	methods: {
		updateInfo(){
			this.$store.dispatch('GetInfo').then(res => {
				this.model = res.user;
			});
		},
		chooseAvatar() {
			this.$u.route({
				url: '/uview-ui/components/u-avatar-cropper/u-avatar-cropper',
				params: {
					destWidth: 800, // 输出图片宽高
					rectWidth: 200, // 裁剪框的宽高
					fileType: 'jpg' // 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
				}
			});
		},
		submit() {
			this.$refs.uForm.validate(valid => {
				if (valid) {
					let form = {
						userId: this.model.userId,
						sex: this.model.sex,
						phonenumber: this.model.phonenumber,
						email: this.model.email
					};
					updateUser(form).then(res => {
						this.updateInfo();
						this.$u.toast('修改成功');
						setTimeout(() => {
							uni.navigateBack();
						}, 1000);
					});
				} else {
					this.$u.toast('您填写的信息有误，请根据提示修正。');
				}
			});
		},
		cancel() {
			uni.navigateBack();
		}
	}
};
</script>
<style lang="scss">
.body {
	padding: 0 40rpx;
}
</style>
