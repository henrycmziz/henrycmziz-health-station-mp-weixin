<template>
	<block>
		<!-- components/dkCalendar/dk-calendar.wxml -->
		<!-- 微打卡 -->
		<view class="dkDate-sm" v-if="size == 'm'">
			<view class="row1" @tap="goDateDK">
				<view v-for="(row1, row1Index) in row1" :key="row1.row1Index">{{ row1 }}</view>
				<view><image src="/static/img/calendar/more.png"></image></view>
			</view>
			<view class="row2">
				<view @tap="changeCurrDay" :data-day="row2" :data-click="row2Index > 3" v-for="(row2, row2Index) in row2" :key="row2.row2Index">
					<text :class="row2Index > 3 ? 'gray' : ''">{{ row2 }}</text>

					<view v-if="currDay == row2" class="yellow"></view>
				</view>
				<view><text class="gray">...</text></view>
			</view>
			<view class="row3">
				<view v-for="(row3, row3Index) in row3" :key="row3.row3Index"><image v-if="row3" src="/static/img/calendar/active.png"></image></view>
				<view></view>
			</view>
		</view>
		<!-- 月打卡日历 -->
		<view class="dkDate" v-if="!size">
			<view class="pnBox">
				<image @tap="preDate" src="/static/img/calendar/pre.png" class="pre" v-if="isPre"></image>
				<image @tap="preDate" src="/static/img/calendar/pre_gray.png" class="pre" v-if="!isPre"></image>
				<text>{{ chooseYear }}年 {{ chooseMonth }}月</text>
				<image @tap="nextDate" src="/static/img/calendar/next.png" class="next" v-if="isNext"></image>
				<image @tap="nextDate" src="/static/img/calendar/next_gray.png" class="next" v-if="!isNext"></image>
			</view>
			<view class="row1 gray-p" @tap="goDateDK">
				<view v-for="(row1, row1Index) in row1" :key="row1.row1Index">{{ row1 }}</view>
			</view>
			<view class="row2">
				<view @tap="changeCurrDay" :data-day="row2" :data-click="checkedColor.gray(chooseYear, chooseMonth, row2)" v-for="(row2, row2Index) in row2" :key="row2.row2Index">
					<text :class="checkedColor.gray(chooseYear, chooseMonth, row2) ? 'gray-p' : ''">{{ row2 }}</text>

					<!-- 黄色标记 -->
					<view v-if="checkedColor.yellow(currDayDetail, chooseYear, chooseMonth, row2)" class="yellow"></view>

					<!-- 打卡标记 -->
					<image v-if="row3[row2Index]" src="/static/img/calendar/active.png"></image>
					<view v-if="!row3[row2Index]"></view>
				</view>
			</view>
			<!-- 灰色检查 -->
		</view>
	</block>
</template>
<script module="checkedColor" lang="wxs">
var gray = function(year,month,day){
  var inputDate = year+'/'+month+'/'+day
  var currYear = getDate().getFullYear()
  var currMonth = getDate().getMonth()+1
  var currDay = getDate().getDate()
  // console.log(currYear,currMonth,currDay)
  if(year>currYear) return true
  else if(year==currYear&&month>currMonth) return true
  else if(year==currYear&&month==currMonth&&day>currDay) return true
  else return false
}
var yellow = function(detail,year,month,day){
  // console.log(detail,year,month,day)
  var newMonth = ''
  var newDay = ''
  var currDateDetail =''
  if(month<10)
    newMonth ='0'+month
  else
    newMonth=month
  if(day<10)
    newDay = '0'+day
  else
    newDay=day
  currDateDetail= year+'/'+newMonth+'/'+newDay;
  // console.log(detail,currDateDetail)
  if(!detail||!day) return false
  else if(detail==currDateDetail) return true
  else return false
}
module.exports={
  gray:gray,
  yellow:yellow
}
</script>
<script>
export default {
	name: 'my-calendar',
	data() {
		return {
			week: ['日', '一', '二', '三', '四', '五', '六'],
			row1: [],
			row2: [],
			row3: [],
			currDay: 0,
			currDayDetail: '',
			//具体的哪年哪月哪日
			chooseYear: '',
			chooseMonth: '',
			currDayTag: 0,
			//大日历需要算上空白
			currYear: '',
			currMonth: '',
			activeData: [],
			isNext: true,
			isPre: true,
			row2Index: 0
		};
	},
	/**
	 * 组件的属性列表
	 */
	props: {
		originActiveData: {
			type: Array,
			default: ''
		},
		//m为小号，不填默认大号
		size: {
			type: String,
			default: ''
		}
	},
	/**
	 * 组件的方法列表
	 */
	methods: {
		// 顶部上下月点击
		preDate() {
			if (!this.isPre) {
				return;
			}

			let month = this.chooseMonth;
			let year = this.chooseYear;
			month--;

			if (month == 0) {
				year--;
				month = 12;
			}

			// this.setData({
			// 	chooseMonth: month,
			// 	chooseYear: year
			// });
			this.chooseMonth = month;
			this.chooseYear = year;
			this.getInit();
		},

		nextDate() {
			if (!this.isNext) {
				return;
			}

			let month = this.chooseMonth;
			let year = this.chooseYear;
			month++;

			if (month > 12) {
				year++;
				month = 1;
			}

			// this.setData({
			// 	chooseMonth: month,
			// 	chooseYear: year
			// });
			this.chooseMonth = month;
			this.chooseYear = year;
			this.getInit();
		},

		//检查日期
		checkedDate() {
			let year = this.chooseYear;
			let month = this.chooseMonth;
			let currYear = this.currYear;
			let currMonth = this.currMonth; //限制日期-上

			if (year == 2021 && month == 1) {
				// this.setData({
				// 	isPre: false
				// });
				this.isPre = false;
			} else {
				// this.setData({
				// 	isPre: true
				// });
				this.isPre = true;
			} //限制日期-下

			if (year == currYear && month == currMonth) {
				// this.setData({
				// 	isNext: false
				// });
				this.isNext = false;
			} else {
				// this.setData({
				// 	isNext: true
				// });
				this.isNext = true;
			}
		},

		// 去打卡详情页
		goDateDK() {
			// wx.navigateTo({
			//   url: '../../pages/dateDetail/dateDetail',
			// })
			// uni.showToast({
			// 	title: '跳转其他页面'
			// });
		},

		//获取本月天数-提供年月
		getCurrDayTotal(year, month) {
			var total = new Date(year, month, 0);
			return total.getDate();
		},

		// 初始化微打卡
		getInitSm() {
			// 当前天数
			const currDay = new Date().getDate();
			// 当前年
			const currYear = new Date().getFullYear();
			// 当前月数
			const currMonth = new Date().getMonth() + 1;
			// 本月总天数
			const currDayTotal = this.getCurrDayTotal(currYear, currMonth);
			// 当前星期几
			const currWeek = new Date().getDay();
			// 行数据
			let row1Arr = [];
			let row2Arr = [];
			let dtodArr = [];
			row1Arr.push(this.week[currWeek]);
			row2Arr.push(currDay);
			dtodArr.push(`${currYear}/${currMonth < 10 ? '0' + currMonth : currMonth}/${currDay < 10 ? '0' + currDay : currDay}`); // 向前

			let createWeek = currWeek;
			let createDay = currDay;
			let createYear = currYear;
			let createMonth = currMonth;

			for (let i = 0; i < 3; i++) {
				createWeek--;
				createDay--;

				if (createWeek < 0) {
					createWeek = this.week.length - 1;
				}

				if (createDay < 1) {
					createDay = currDayTotal; //年月相关

					createMonth--;

					if (createMonth == 0) {
						createMonth = 12;
						createYear--;
					}
				}

				row1Arr.unshift(this.week[createWeek]);
				row2Arr.unshift(createDay);
				dtodArr.unshift(`${createYear}/${createMonth < 10 ? '0' + createMonth : createMonth}/${createDay < 10 ? '0' + createDay : createDay}`);
			} // 向后

			createWeek = currWeek;
			createDay = currDay;
			createYear = currYear;
			createMonth = currMonth;

			for (let i = 0; i < 3; i++) {
				createWeek++;
				createDay++;

				if (createWeek > 6) {
					createWeek = 0;
				}

				if (createDay > currDayTotal) {
					createDay = 1; //年月相关

					createMonth++;

					if (createMonth == 13) {
						createMonth = 1;
						createYear++;
					}
				}

				row1Arr.push(this.week[createWeek]);
				row2Arr.push(createDay);
				dtodArr.push(`${createYear}/${createMonth < 10 ? '0' + createMonth : createMonth}/${createDay < 10 ? '0' + createDay : createDay}`);
			} //完成天数数据row3对比

			let row3Arr = [];
			let hasSame = false;

			for (let i = 0; i < dtodArr.length; i++) {
				hasSame = false;

				for (let j = 0; j < this.activeData.length; j++) {
					if (dtodArr[i] == this.activeData[j]) {
						hasSame = true;
					}
				}

				if (hasSame) {
					row3Arr[i] = true;
				} else {
					row3Arr[i] = false;
				}
			}

			console.log(row3Arr);
			// this.setData({
			// 	row1: row1Arr,
			// 	row2: row2Arr,
			// 	row3: row3Arr,
			// 	currDay: currDay
			// });
			this.row1 = row1Arr;
			this.row2 = row2Arr;
			this.row3 = row3Arr;
			this.currDay = currDay;
			// console.log(this.data.activeData)
		},

		// 初始化默认打卡
		getInit() {
			// 选择的日历
			const chooseDate = `${this.chooseYear}/${this.chooseMonth}/01`;
			// 当前月天数
			const currDay = new Date().getDate();
			// 选择年
			const chooseYear = new Date(chooseDate).getFullYear();
			// 选择月数
			const chooseMonth = new Date(chooseDate).getMonth() + 1;
			// 选择月总天数
			const chooseDayTotal = this.getCurrDayTotal(chooseYear, chooseMonth);
			//选择月一号是星期几
			const chooseOneToWeek = new Date(`${this.chooseYear}/${this.chooseMonth}/01`).getDay();
			// 行数据
			let row1Arr = [];
			let row2Arr = [];
			let currDayTag = 0;
			let dtodArr = [];
			// 行一
			row1Arr = this.week;
			// 行二
			// 向后补充天数
			for (let i = 1; i <= chooseDayTotal; i++) {
				row2Arr.push(i);
			} // 向前补充齐

			console.log('选择月的1号是星期', chooseOneToWeek);

			for (let i = 1; i < chooseOneToWeek + 1; i++) {
				row2Arr.unshift('');
			}

			currDayTag = currDay + chooseOneToWeek; // 行三对比-打钩

			for (let i = 0; i < row2Arr.length; i++) {
				let hasSame = false;

				if (!row2Arr[i]) {
					dtodArr.push(false);
					continue;
				}

				for (let j = 0; j < this.activeData.length; j++) {
					let newDate = `${this.chooseYear}/${this.chooseMonth < 10 ? '0' + this.chooseMonth : this.chooseMonth}/${row2Arr[i] < 10 ? '0' + row2Arr[i] : row2Arr[i]}`;

					if (newDate == this.activeData[j]) {
						hasSame = true;
					}
				}

				if (hasSame) {
					dtodArr.push(true);
				} else {
					dtodArr.push(false);
				}
			}
			// console.log(dtodArr)

			// this.setData({
			// 	row1: row1Arr,
			// 	row2: row2Arr,
			// 	currDayTag: currDayTag,
			// 	row3: dtodArr
			// });
			this.row1 = row1Arr;
			this.row2 = row2Arr;
			this.currDayTag = currDayTag;
			this.row3 = dtodArr;

			if (!this.currDay) {
				// this.setData({
				// 	currDay: currDay,
				// 	currDayDetail: `${this.chooseYear}/${this.chooseMonth < 10 ? '0' + this.chooseMonth : this.chooseMonth}/${currDay < 10 ? '0' + currDay : currDay}`
				// });
				this.currDay = currDay;
				this.currDayDetail = `${this.chooseYear}/${this.chooseMonth < 10 ? '0' + this.chooseMonth : this.chooseMonth}/${currDay < 10 ? '0' + currDay : currDay}`;
			}

			this.checkedDate(); // console.log('当前',this.data.currYear,'选',this.data.chooseYear,this.data.currMonth,this.data.chooseMonth)
		},

		// 改变日期
		changeCurrDay(e) {
			// 基础过滤
			let day = e.currentTarget.dataset.day;
			let isClick = !e.currentTarget.dataset.click;
			console.log(day, isClick);

			if (!day) {
				return;
			} //灰色过滤

			if (!isClick) {
				return;
			} // 精确微型日历-向上退月

			if (this.size == 'm') {
				let today = new Date().getDate();

				if (day > today) {
					let month = this.chooseMonth - 1;
					let year = this.chooseYear;

					if (month == 0) {
						this.chooseYear = year - 1;
						this.chooseMonth = 12;
						// this.setData({
						// 	chooseYear: year - 1,
						// 	chooseMonth: 12
						// });
					} else {
						this.chooseMonth = month;
						// this.setData({
						// 	chooseMonth: month
						// });
					}
				}
			} // console.log(e.currentTarget.dataset)
			//输出使用-，其余全用/

			let currDayDetail = `${this.chooseYear}/${this.chooseMonth < 10 ? '0' + this.chooseMonth : this.chooseMonth}/${day < 10 ? '0' + day : day}`;
			let pushCurrDayDetail = `${this.chooseYear}-${this.chooseMonth < 10 ? '0' + this.chooseMonth : this.chooseMonth}-${day < 10 ? '0' + day : day}`;
			this.$emit('selectDate', {
				// detail: {
				currDayDetail: pushCurrDayDetail
				// }
			});
			// this.setData({
			// 	currDay: day,
			// 	currDayDetail: currDayDetail
			// });
			this.currDay = day;
			this.currDayDetail = currDayDetail;
			// console.log(this.data.currDay,this.data.currDayDetail)
		},

		// 日期格式化v2
		getFormatDate(date) {
			date = new Date(date);

			const formatNumber = n => {
				n = n.toString();
				return n[1] ? n : '0' + n;
			};

			const year = date.getFullYear();
			const month = date.getMonth() + 1;
			const day = date.getDate();
			return [year, month, day].map(formatNumber).join('/');
		}
	},
	// computed() {
	// 	activeData(){
	// 		console.log('innn====================')
	// 	return this.originActiveData.map(currentValue => {
	// 		that.activeData.push(that.getFormatDate(currentValue))
	// 	})
	// 	}
	// },
	beforeMount: function() {
		let that = this; // 在组件实例进入页面节点树时执行

		this.originActiveData.map(currentValue => {
			that.activeData.push(that.getFormatDate(currentValue));
		});
		// this.setData({
		// 	activeData: this.activeData;
		// });
		this.activeData = this.activeData;
		console.log('选中日期:', this.activeData);

		//初始化当前年月
		// this.setData({
		// 	currYear: new Date().getFullYear(),
		// 	chooseYear: new Date().getFullYear(),
		// 	currMonth: new Date().getMonth() + 1,
		// 	chooseMonth: new Date().getMonth() + 1
		// });
		this.currYear = new Date().getFullYear();
		this.chooseYear = new Date().getFullYear();
		this.currMonth = new Date().getMonth() + 1;
		this.chooseMonth = new Date().getMonth() + 1;

		if (this.size == 'm') {
			this.getInitSm();
		} else {
			this.getInit();
		}
	},
	destroyed: function() {
		// 在组件实例被从页面节点树移除时执行
	}
};
</script>
<style>
.dkDate-sm {
	/* height: 234rpx; */
	background: #f8f8f8;
	border-radius: 16rpx;
	padding: 40rpx 0;
}

.dkDate {
	/* height: 494rpx; */
	background: #f8f8f8;
	box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.04);
	border-radius: 16rpx;
	padding-bottom: 40rpx;
}

.row1,
.row2,
.row3 {
	display: flex;
	justify-content: space-around;
	align-items: center;
	font-size: 28rpx;
	font-weight: 500;
	color: #333333;
}

.row1 view,
.row2 view,
.row3 view {
	width: 12.5%;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
}

.row1 image {
	width: 48rpx;
	height: 48rpx;
}

.row2 {
	margin-top: 30rpx;
}

.row2 view {
	height: 64rpx;
}

.row2 text {
	position: relative;
	z-index: 2;
}

.row3 image {
	width: 32rpx;
	height: 32rpx;
}

.yellow {
	width: 64rpx !important;
	height: 64rpx !important;
	/* background: #fadc1e; */
	background: #0189fe;
	border-radius: 50%;
	position: absolute !important;
	left: calc(50% - 32rpx);
}

.gray {
	color: #bbbbbb !important;
}

/* 灰+ */
.gray-p {
	color: #999999 !important;
}

.pnBox {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 30rpx 0;
	margin: 0 40rpx;
	border-bottom: 2rpx solid rgba(0, 0, 0, 0.1);
	margin-bottom: 40rpx;
}

.pnBox .pre,
.pnBox .next {
	width: 14rpx;
	height: 24rpx;
	/* 增大点击范围 */
	padding: 10rpx 24rpx;
}

.pnBox text {
	font-size: 32rpx;
	font-weight: 500;
	color: #afafaf;
}

/* 大日历修改 */
.dkDate .row2,
.dkDate .row3 {
	flex-wrap: wrap;
	justify-content: flex-start;
}
.dkDate .row2 text {
	padding: 14rpx 0 6rpx 0;
}
.dkDate .row2 view {
	flex-direction: column;
	height: 86rpx;
	justify-content: flex-start;
}
.dkDate .row2 image {
	width: 32rpx;
	height: 32rpx;
}
.dkDate .row1 view,
.dkDate .row2 view,
.dkDate .row3 view {
	width: 14.285%;
}
.dkDate .yellow {
	/* background: rgba(250, 220, 30, 0.3) !important; */
	background: rgba(1, 137, 254, 0.3) !important;
}
</style>
