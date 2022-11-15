<template>
	<view class="container"><web-view :src="url"></web-view></view>
</template>
<script>
import config from '@/config';

export default {
	components: {},
	data() {
		return {
			url: '',
			uid: this.$store.state.userInfo.userId,
			qid: 1
		};
	},
	computed: {},
	onLoad() {
		this.url = config.frontUrl + '/questionnaire/fill-in?qid=' + this.qid + '&uid=' + this.uid;
		console.log(this.url);
	},
	onShow() {},
	methods: {
		sumbit(res) {}
	}
};
</script>
<style lang="scss" scoped></style>
