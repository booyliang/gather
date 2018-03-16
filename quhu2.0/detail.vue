<template>
	<div class="activity_detail_wrap" v-if="detailData">
		<y-nav :title="detailData.activityTitle" :showLeftArrow="inApp">
			<span slot="nav-right" v-if="inApp">
				<y-button type="text" class="iconfont icon-more_line" @click.native.stop="onAction(options)"></y-button>
			</span>
		</y-nav>
		<div class="platform_activity-content" :class="{'activity-content-noApp': !inApp}">
			<div class="platform_activity-spec" v-if="inApp">
				<p class="platform_activity-name">
					<y-card-user v-if='detailData.user' :data="detailData.user" :createDate="detailData.createDate"></y-card-user>
				</p>
				<p class="platform_activity-count">
					<span>票数：<i>{{ detailData.totalCount }}</i></span>
					<span>编号：<i>{{ detailData.voteNo }}</i></span>
				</p>
			</div>
			<div class="platform_activity-content" v-if="!inApp">
				<p class="platform_activity-name">
					<img class="platform_activity-name-logo" :src="logoImg" alt="">	
				</p>	
			</div>
			<p class="platform_activity-intro" v-if="detailData.content" v-text="detailData.content"></p>
			<p class="platform_activity-intro" v-if="detailData.content1" v-text="detailData.content1"></p>
			<p class="platform_activity-intro" v-if="detailData.content2" v-text="detailData.content2"></p>
			<p class="platform_activity-img" v-if="imgs.length">
				<img v-for="(img, index) in imgs" :src="img | imageResize(6)" :key="index">
			</p>
			<div v-if="detailData.videoUrl">
				<y-video :src="detailData.videoUrl" :poster="detailData.videoThumbnailUrl"></y-video>
				<!-- <video v-else width="100%" height="10rem" :src="detailData.videoUrl" :poster="detailData.videoThumbnailUrl" controls></video> -->
			</div>
		</div>

		<div v-if="detailData" class="platform_activity-vote" :class="{'platform_activity-vote-noApp': !inApp}">
			<div class="platform_activity-vote-container" :class="{'platform_activity-vote-comment': !inApp || detailData.commentFlag !== 11}">
				<div class="tip-text" v-if="!inApp">
					<div v-html="voteDiff" class="vote-diff"></div>
					<div>马上给<span v-if='detailData.user' class="tip-nickname" v-text="detailData.user.userNickName"></span>拉票</div>
				</div>
				<div class="buttons">
					<y-button type="ghost" class="help_btn" @click.native="onShare">帮TA拉票</y-button>
					<y-button class="join_btn" :disabled="voteFlag" @click.native="voted">{{voteFlag ? '票已投完' : '投TA一票'}}</y-button>
				</div>
			</div>
		</div>

		<y-detail-action v-if="inApp && detailData.commentFlag === 11" :action-option = "['comment']" :resource-data = "detailData"></y-detail-action>
		<div class="wx-qq-share-tips" v-if="showWxQqShareTips" @click="showWxQqShareTips = false">
			<div class="tips_main">
				<img src="../../../assets/share-tips@2x.png">
			</div>
		</div>
	</div>
</template>
<script>
import YCardUser from '../components/card-user';
import DetailAction from '@/components/detail-action';
import YVideo from '@/components/video';
import Mixin from '../mixins';
import moment from 'moment';
import logoImg from '@/assets/logo_h.png';
import moreActionMixin from '../../../mixins/more-action'
export default {
	components: {
		YCardUser,
		YVideo,
		[DetailAction.name]: DetailAction
	},
	mixins: [Mixin, moreActionMixin],
	data() {
		return {
			logoImg,
			detailData: null,
			voteDisabled: false,
			showWxQqShareTips: false,
			inApp: !!this.$yryz.isNative(),
			hasVotes: 0,
			configVotes: 0,
			voteType: 1,
			actionSheets: [],
			contFlag: null,
			options: null,
			moreActionDataModelKey: 'detailData',
			moreActionMenuList: [7]
		}
	},
	computed: {
		imgs() {
			if (!this.detailData.imgUrl) return [];
			return this.detailData.imgUrl.split(',');
		},
		voteFlag() {
			return this.hasVotes >= this.configVotes && this.detailData.userRollFlag === 10;
		},
		voteDiff() {
			let count = 0;
			if (this.detailData.frontVoteDiffer) {
				count = this.detailData.frontVoteDiffer;
				return `只差<span class="vote-counts">${count}票</span>就能超过前一名`
			} else if (this.detailData.afterVoteDiffer) {
				count = this.detailData.afterVoteDiffer;
				return `只差<span class="vote-counts">${count}票</span>就会被后一名超过了`
			} else {
				return `趁还没有其他人参与活动`
			}
		}
	},
	methods: {
		onShare() {
			if (this.inApp) {
				let content = this.detailData.content || this.detailData.content1 || this.detailData.content2 || '';
				// let resource = {
				// 	title: this.detailData.activityTitle,
				// 	content: this.detailData.content,
				// 	pic: this.detailData.coverPlan,
				// 	url: this.$utils.getShareUrl(),
				// }
				// let actionSheets = [
				// 	{ actionCode: 7, actionStatus: true, parameters: resource } // 分享
				// ]
				// this.onAction({ actionSheets })
				this.moreActionMixinOpen();
				return;
			} else if (this.isWx || this.isQq) {
				this.showWxQqShareTips = true;
			} else {
				this.$toast('请使用浏览器的分享，分享给您的好友', {
					autoClose: false
				});
			}
		},
		getActivityStatus() {
			let activityData = this.$attrs['activity-data'];
			if (activityData.activityStatus === 12) {
				let start = activityData.activityVoteBegin;
				let end = activityData.activityVoteEnd;
				let current = activityData.currentDate;
				if (current >= end) return 'activityVoteEnd';
				if (current < start) return 'activityVoteBegin';
				return 'activityIng';
			} else if (activityData.activityStatus === 11)
				return 'activityBegin';
			else return 'activityEnd'
		},
		async voted() {
			if (this.inApp) {
				await this.$user.login();
			} 
			if (!this.$env.userId) {
				this.$eventBus.$emit('login');
				return;
			}

			if (this.getActivityStatus() === 'activityBegin') {
				this.$toast('活动尚未开始，暂时不能投票');
				return false;
			} else if (this.getActivityStatus() === 'activityEnd') {
				this.$toast('活动已结束，无法继续投票');
				return false;
			} else if (this.getActivityStatus() === 'activityVoteBegin') {
				this.$toast('投票尚未开始，暂时不能投票');
				return false;
			} else if (this.getActivityStatus() === 'activityVoteEnd') {
				this.$toast('投票已结束，无法继续投票');
				return false;
			}


			this.$indicator.open('投票中...');
			let params = {
				activityInfoId: this.detailData.activityInfoId,
				candidateId: this.detailData.kid,
				otherFlag: this.inApp ? 0 : 1,
				voteNo: this.detailData.voteNo,
			}
			let res = await this.$http.post(`/services/app/v2/activity/vote/single`, params)
			this.$indicator.close();
			let resData = res.data;
			if (resData.code === '200') {
				this.detailData.totalCount++;
				this.hasVotes = resData.data.haveFreeVote;
				if (this.hasVotes >= this.configVotes && resData.data.userRollFlag === 10) {
					this.$eventBus.$emit('updateVoteStatus');
				}
				if (this.inApp) {
					this.$toast('投票成功');
				} else {
					if (resData.data.prizesFlag === 11) { // 有奖品
						this.$router.push({ name: 'prizes' });
						return;
					}
					this.$router.push({ name: 'prizesNot' }); // 无奖励页面
				}
			} 
		},	
		async countFlag() {
			let params = { 
				countType: '10,11,13,15,16',
				kid: this.detailData.activityInfoId,
				userId: this.$env.userId
			}
			let res = await this.$http.get('/services/app/v2/behavior/getCountFlag', { params })
			// console.log('获取收藏状态', res);
			if (res.data.code === '200') {
				this.contFlag = res.data.data
				// 已登录-作品发布者本人：分享、收藏
				// 已登录-非作品发布者本人：分享、收藏、举报
				// 未登录：分享、收藏、举报
				// 第三方隐藏
				let resource = {
					kid: this.detailData.kid,
					title: this.detailData.activityTitle,
					content: this.detailData.content,
					pic: this.detailData.coverPlan,
					url: this.$utils.getShareUrl(),
				}
				let flag = this.contFlag.collectionFlag === 10 ? 1 : 0
				let _moduleEnum = this.detailData.moduleEnum
				let collect = {
					moduleEnum: this.detailData.moduleEnum,
					resourceId: this.detailData.kid
				}
				let actionSheets = [
					{ actionCode: 7, actionStatus: true, parameters: resource }, // 分享
					{ actionCode: 3, actionStatus: flag, parameters: collect}, // 收藏
				]
				if (this.detailData.user && this.$env.userId !== this.detailData.user.userId) {
					actionSheets.push({ actionCode: 5, parameters: collect }) // 举报					
				}			

				this.options = {
					actionSheets
				}
			}
		},

	},
	async mounted() {
		// 微信授权，掉接口获取活动渠道码	
		if (!this.inApp && this.isWx && !this.$env.userId) {
			let params = {
				kid: this.$route.params.activityId,
				type: 2
			}
			let activitCode = await this.$http.get('/services/app/v2/activity/info/activityInfo', { params })
			this.wxOauth(activitCode.data.data.activityChannelCode);
		}				
		let params = {
			activityInfoId: this.$route.params.activityId,
			candidateId: this.$route.params.id,
			otherFlag: this.inApp ? 0 : 1,
		}
		let res = await this.$http.get(`/services/app/v2/activity/candidate/detail`, { params })
		let resData = res.data;
		if (resData.code !== '200') return false;
		this.detailData = resData.data;
		this.hasVotes = this.inApp ? this.detailData.inAppVoteCount : this.detailData.otherAppVoteCount;
		this.configVotes = this.inApp ? this.detailData.inAppVoteConfigCount : this.detailData.otherAppVoteConfigCount;
		this.voteType = this.inApp ? this.detailData.inAppVoteType : this.detailData.otherAppVoteType;
		this.countFlag();
		if (!this.inApp) {
			let content = this.detailData.content || this.detailData.content1 || this.detailData.content2 || '';
			this.$utils.setBrowserShareInfo(this.detailData.activityTitle, content);
		}
	}
}
</script>

<style>
@import '#/css/var.css';
.activity_detail_wrap {
	& .platform_activity-content {
		padding: .25rem .3rem .3rem .3rem;
		background-color: #fff;
		& .platform_activity-count {
			color: var(--text-assist-color);
			margin-bottom: .3rem;
			font-size: .3rem;
			& span i {
				color: #f8bc1a;
			}
			& span:nth-child(2) {
				margin-left: .2rem;
				& i {
					color: #666;
				}
			}
		}
		& .platform_activity-spec {
			display: flex;
			justify-content: space-between;
			align-items: top;
			font-size: .24rem;
			padding: .15rem 0 .3rem 0;			
			& p {
				font-size: .24rem;
			}
		}
		& .platform_activity-name {
			& span {
				color: #0185ff;
			}

			& label {
				font-size: .24rem;
				color: var(--text-assist-color);
				margin-left: .2rem;
			}
			& .platform_activity-name-logo{
				width: 1.3rem;
				height: 0.5rem;
				margin-left: -.3rem;
			}
		}

		& .platform_activity-intro {
			margin-bottom: .3rem;
			font-size: .34rem;
			color: var(--text-primary-color);
			line-height: 1.65;
		}

		& .platform_activity-img {
			width: 100%;
			& img {
				width: 100%;
				margin-bottom: .3rem;
			}
		}
	}
	& .activity-content-noApp {
		padding-bottom: 2.8rem;
		min-height: 100vh;
	}
	& .platform_activity-vote-noApp {
			position: fixed;
    		bottom: 0;
            left: 0;
            width: 100%;
			border-top-width: 2px;
			border-top-color: #ededed;
			border-top-style: solid;
			margin-top: 0.8rem;
		}
	& .platform_activity-vote {
		background-color: #fff;
		padding: .3rem 0 .4rem 0;
			& .platform_activity-vote-container {
				padding: .4rem 0;
				padding-top: 0;
			}
			& .platform_activity-vote-comment {
				/* padding: .8rem 0;
				padding-top: .4rem;
				margin-bottom: .2rem; */
				padding-bottom: 0;			
			}
			& .buttons {
				display: flex;
				align-items: center;
				justify-content: space-around;
				font-size: .32rem;
			}

			& button {
				display: inline-block;
				width: 2.2rem;
				height: .6rem;
				border-radius: .1rem;
			}

			& .help_btn {
				border: .03rem solid #67b6ff;
				color: #67b6ff;
				line-height: 1;
			}

			& .join_btn {
				line-height: 1;
				color: #fff;
				background-color: #66b6ff;
			}
			& .disabled {
				background-color: #d7d7d7;
			}
			& .tip-text {
				text-align: center;
				color: var(--text-assist-color);
				font-size: .3rem;
				margin-bottom: .3rem;
				& .button {
					border-radius: 1rem;
					padding: 0.2em 1em;
					background: #f5cd45;
					font-size: .26rem;
					margin-bottom: .3rem;
				}
				& div:first-child {
					font-size: .36rem;
				}
				& .vote-counts {
					color: var(--theme-color);
					font-weight: bold;
				}
				& .tip-nickname {
					color: var(--text-primary-color);
				}
				& .vote-diff {
					font-size: .36rem;
					margin-bottom: .1rem;
				}
			}
		}
	& .wx-qq-share-tips {
		position: fixed;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		z-index: 9999;
		background: rgba(0, 0, 0, .8);
		& .tips_main {
			padding: .2rem 30px 0 0;
			text-align: right;
			& img {
				width: 5.72rem
			}
		}
	}

	& .go_index_button {
		position: fixed;
		left: 0;
		top: 50%;
		display: flex;
		align-items: center;
		padding-left: .1rem;
		width: 1rem;
		height: 1rem;
		color: #fff;
		background: var(--theme-color);
		font-size: .24rem;
		transform: translateY(-50%);
		border-top-right-radius: 50%;
		border-bottom-right-radius: 50%;
		box-shadow: 0 0 15px rgba(0, 0, 0, .5);
	}
	& .icon-Sina {
		display: none;
	}
	
}
.vote-counts {
	color: var(--theme-color);
	font-weight: bold;
}


</style>