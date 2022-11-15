<template>
	<view>
		<view style="font-size: 26rpx;text-align: center;color: coral; padding: 20rpx 0;" @click="goToFill()">为更好地服务大家，请闲暇时填写一个小问卷哈~</view>
		<!-- 微打卡组件 -->
		<calendar :originActiveData="clockedDate" @selectDate="onSelectDate" :size="size" v-if="hackReset" />
		<view class="show-type">
			<view v-if="showType == -2"></view>
			<view v-if="showType == -1"><span>无任务~</span></view>
			<view v-if="showType == 0">
				<navigator class="item" hover-class="hover" :url="'/pages/subcontract/clock-in/task/task?clockInDate=' + currDate + '&clockInId=' + clockInId">
					<span>去打卡</span>
				</navigator>
			</view>
			<view v-if="showType == 1"><span>已打卡</span></view>
		</view>
	</view>
</template>

<script>
import calendar from '@/components/calendar/calendar.vue';
import { getClockInRecord } from '@/api/clockin.js';
import { timeFormat } from '@/common/utils.js';

export default {
	components: { calendar },
	data() {
		return {
			size: '',
			hackReset: true,
			userId: this.$store.state.userInfo.userId,
			clockInRecord: {},
			clockedDate: [],
			currDate: timeFormat(new Date(), 'date'),
			clockInId: '',
			showType: -2
		};
	},
	onLoad() {
		this.getData();
	},
	onPullDownRefresh() {
		this.getData();
	},
	onShow() {
		this.showType = -2;
		this.getData();
	},
	methods: {
		goToFill(){
			uni.navigateTo({
				url:'../../subcontract/clock-in/questionnaire/questionnaire'
			})
		},
		getData() {
			this.showType = -2;
			this.clockedDate = [];
			getClockInRecord(this.userId).then(res => {
				this.clockInRecord = res.data;
				// console.log(this.clockInRecord);
				// console.log(this.currDate);
				if (this.clockInRecord.length == 0) this.showType = undefined;
				else {
					this.clockedDate = this.clockInRecord
						.map(item => {
							if (item.isClockedIn == 1) return item.clockInTime;
						})
						.filter(res => res != undefined);
					this.clockInId = this.clockInRecord[0].clockInId;
					this.changeShowType();
				}
				this.refreshCalendar();
			});
		},
		refreshCalendar() {
			this.hackReset = false;
			this.$nextTick(() => {
				this.hackReset = true;
			});
		},
		compare(property) {
			return function(a, b) {
				const value1 = a[property];
				const value2 = b[property];
				return value1 - value2;
			};
		},
		showFull() {
			this.size = undefined;
			this.hackReset = false;
			this.$nextTick(() => {
				this.hackReset = true;
			});
		},
		changeShowType() {
			const currRecord = this.clockInRecord.filter(item => item.clockInTime == this.currDate);
			if (currRecord.length == 0) this.showType = -1;
			else this.showType = currRecord[0].isClockedIn;
		},
		onSelectDate(data) {
			this.currDate = data.currDayDetail;
			this.changeShowType();
		}
	}
};
</script>

<style>
.show-type {
	text-align: center;
	font-size: 48rpx;
}
</style>
