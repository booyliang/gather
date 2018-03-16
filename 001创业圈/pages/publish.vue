<!--发布活动-->
<template>
	<div class = "jkys-activity-release">
		<y-navigator title = "发起活动" :beforeBack = "goBack">
			<span slot = "navigator-right">
                <y-publish-button>发布</y-publish-button>
            </span>
		</y-navigator>

		<y-input v-model = "vm.title" text = "true" maxlength = "30" placeholder = "输入活动标题..." count = "true"
             match = "30"></y-input>

    <!-- 时间选择 S -->
    <div class="item item-clickable">
        <div class="item-wrap">
            <div class="item-head">
                <span class="item-title" v-text="">活动开始时间</span>
            </div>
            <div class="item-foot">
                <input type="date" slot = "foot" class="input-date" v-model="startTime">
                <span>{{startTime}}</span>
            </div>
        </div>
        <div class="item-wrap">
            <div class="item-head">
                <span class="item-title" v-text="">活动截止时间</span>
            </div>
            <div class="item-foot">
                <input type="date" slot = "foot" class="input-date" v-model="endTime">
                <span>{{endTime}}</span>
            </div>
        </div>
    </div>
		<!-- <div class = "activity-time">
			<span>活动开始时间</span>
			<input type = "date" slot = "foot" v-model = "startTime" placeholder = "请选择开始时间">
		</div>
		<div class = "activity-time">
			<span>活动截止时间</span>
			<input type = "date" slot = "foot" v-model = "endTime" placeholder = "请选择截止时间">
		</div> -->
    <!-- 时间选择 E -->

		<y-list>
			<y-native-editor ref = "nativeEditor"
                       placeholder = "添加活动介绍..."
                       :videoEnable = "false"
                       v-model = "vm.contentSource"></y-native-editor>

			<div class = "jkys-info-check">
				<label>
            <span class = "check" :class = "{isCheck}"
                  @click = "checkBox"></span>我已阅读并同意《<b @click = "gotoRules">悠然一指线上活动发布规则</b>》
        </label>
			</div>
		</y-list>
	</div>
</template>

<script>
	import ContentPublish from "@/mixins/content-publish"
  export default {
    mixins: [ContentPublish],
    data() {
      return {
        vm: {
          title: '',
          contentSource: ''
        },
        startTime: '请选择开始时间',
        endTime: '请选择截止时间',
        isCheck: false,
        pubData: {
          title: "",
          startTime: '',
          endTime: "",
          contentSource: ""
        },
        publishData: {},
        groupData: {}
      }
    },

    watch: {
      /**
       * 活动开始时间效验
       */
      'startTime': function (newVal) {
        //console.log(new Date(newVal).toLocaleDateString(), new Date().toLocaleDateString());
        let new_date = new Date(newVal).getTime() + 24 * 60 * 60 * 1000;
        let cur_date = new Date().getTime();
        let end_date = new Date(this.endTime).getTime();
        if (new_date < cur_date) {
          this.$toast('活动起始时间不正确');
          this.startTime = '';
        } else if (new_date > end_date) {
          this.$toast('活动截止时间不正确');
          this.endTime = '';
        }

      },
      /**
       * 活动截止时间效验
       * @param newVal
       */
      'endTime': function (newVal) {
        //console.log(new Date(newVal).getTime()-new Date(this.startTime).getTime());
        if (new Date(newVal).getTime() <= new Date(this.startTime).getTime()) {
          this.$toast('活动截止时间不正确');
          this.endTime = '';
        }
      }
    },
    created() {
      /**
       * 读取localstore的值
       * @type {*}
       */
      this.groupData = this.$localStore.get('publish');
      if (this.groupData) {
        this.vm.title = this.groupData.title;
        this.startTime = this.groupData.startTime;
        this.endTime = this.groupData.endTime;
        this.vm.contentSource = this.groupData.contentSource;
      }
    },

    methods: {
      checkBox() {
        this.isCheck = !this.isCheck;
      },
      /**
       * 活动规则路由跳转
       */

			async gotoRules() {
				this.publishData = await this.$localStore.getOrSet('publish', null, this.pubData);
				this.publishData.title = this.vm.title;
				this.publishData.startTime = this.startTime;
				this.publishData.endTime = this.endTime;
				this.publishData.contentSource = this.vm.contentSource;
				this.$router.push({
					path: '/activity/rules'
				});
			},

      /**
       * 取消
       */
      goBack() {
        if (this.forbidRouteLeave) return;

        if (this.vm.contentSource.length > 2 ||
          this.startTime != '' ||
          this.endTime != '') {
          this.$dialog.confirm({
                                 title: '退出此次编辑',
                                 message: '是否确认退出此次编辑？',
                                 okText: '退出',
                                 cancelText: '取消'
                               }).then(() => {
            this.$router.back();
          }).catch(() => {
            return false;
          });
          return false;
        }
      },

      /**
       * 发布内容效验
       */
      validate() {
        if (this.vm.title.length <= 0) {
          this.$toast('请填写标题');
          return false;
        }

        if (this.startTime == '') {
          this.$toast('请选择活动开始时间');
          return false;
        }
        if (this.endTime == '') {
          this.$toast('请选择活动结束时间');
          return false;
        }

        let summaryData = this.$refs.nativeEditor.getSummaryData();
        //summaryData.videoImgUrl = summaryData.video_img_url;
        this.postData = {
          ...summaryData,
          ...this.vm,
          signupStartDate: this.startTime,
          signupEndDate: this.endTime,
          createUserId: this.$env.custId
        };

        if (this.postData.imgUrl == "") {
          this.$toast('请上传图片');
          return false;
        }

        if (this.postData.content.length < 10) {
          this.$toast('不能少于10个字');
          return false;
        }

        if (!this.isCheck) {
          this.$toast('请同意悠然一指线上活动发布规则');
          return false;
        }
      },

      /**
       * 活动发布
       */
      publish() {
        this.$dialog.confirm({
                               title: '确认发布活动',
                               message: '是否确认发布活动',
                               okText: '发布',
                               cancelText: '取消'
                             }).then(() => {
          this.$http.post('/services/activity/publish', this.postData)
              .then(response => {
                let data = response.body;
                if (data.msg == 'success') {
                  this.publishSuccess('/activity/submit');
                } else {
                  this.publishError(data.msg);
                }
              }).catch((msg) => {
            let data = response.body;
            this.publishError(data.msg)
          })
        }).catch(() => {
          this.$afterPublish();
        })
      }
    }
  }
</script>

<style>
	@import "#/css/var.css";
	.jkys-activity-release {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
    & .item-foot {
        position: relative;
        & span {
            color: #747474;
        }
        & input[type="date"].input-date {
            -webkit-appearance: none;
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            opacity: 0;
        }
    }
		& .textarea-warp {
			@apply --margin-bottom;
			& .input-txt {
				font-size: 0.34rem;
			}
			&+.activity-time {
				@apply --double-border-bottom;
			}
		}
		& .activity-time {
			background: #fff;
			padding: 0.4rem 0.3rem;
			font-size: 0.3rem;
			display: flex;
			justify-content: space-between;
			& input {
				background: url(../../assets/arrwr01.png) no-repeat right center;
				background-size: 0.17rem auto;
			}
		}
		& .list {
			display: flex;
			flex: 1 1 auto;
			margin-top: 0.2rem;
			position: relative;
			& .jkys-info-check {
				position: absolute;
				left: 0;
				bottom: 1.1rem;
				font-size: 0.24rem;
				line-height: 1rem;
				width: 100%;
				& .check {
					display: inline-block;
					width: 0.3rem;
					height: 0.3rem;
					border: 1px solid #bfbfbf;
					margin-right: 0.1rem;
					margin-top: 0.1rem;
					margin-left: 0.3rem;
					margin-bottom: -0.06rem;
					&.isCheck {
						background: url(../../assets/check-on.png) no-repeat center;
						background-size: 0.22rem auto;
					}
				}
				& label b {
					color: var(--theme-color);
					/*color: #00b7ee;*/
				}
			}
		}
	}
</style>
