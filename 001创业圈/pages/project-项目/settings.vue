<template>
	<div>
		<y-navigator title="发布项目" @back="">
			<span slot="navigator-right">
        <y-link-button @click.native="submit">完成</y-link-button>
      </span>
		</y-navigator>
		<div class="install-top-p">
			请认真填写有助于收到优质项目，资料审核成功后，头像和姓名将无法更改。
		</div>
		<y-inset :data="data" class="install-list"></y-inset>
		<div class="install-bottom-button">
			<y-button @click.native="show" size="l" type="primary" block>预 览</y-button>
		</div>
	</div>
</template>

<script>
	import YNavigator from '@/components/navigator/nav';
	import YLinkButton from '@/components/link-button'
	import YNavToggle from '@/components/navigator/nav-toggle'
	import YButton from '@/components/button';
	import YInset from '@/components/setting/set';
	import Dialog from '@/components/dialog';
	import Toast from '@/components/toast';
	export default {
		components: { YNavigator, YButton, YInset, YLinkButton, YNavToggle },
		data() {
			return {

				data: [{
						id: 'projectImgUrl',
						title: '项目LOGO',
						describe: '',
						validate: true,
						links: '',
						icon: 'projectlogo',
						isShow: true,
						onclick: this.clickuphead
					},
					{
						id: 'projectName',
						title: '项目名称',
						validate: true,
						describe: '',
						value: '',
						links: '/project/project-name'
					},
					{
						id: 'projectAreaId',
						title: '所在地区',
						validate: true,
						describe: '',
						value: '',
						links: '/project/province'
					},
					{
						id: 'projectIntro',
						title: '一句话简介',
						validate: true,
						describe: '',
						value: '',
						links: '/project/project-introduce',
					},
					{
						id: 'projectIndustryFieldId',
						title: '行业领域',
						validate: true,
						describe: '',
						value: '',
						links: '/project/industry-sector'
					},

					{
						id: 'projectFinancingDemandId',
						title: '融资需求',
						validate: true,
						describe: '',
						value: '',
						links: '/project/project-financing',
						hasgutter: true
					},
					{
						id: 'projectLinkmanName',
						title: '联系人姓名',
						validate: true,
						describe: '',
						value: '',
						links: '/project/contact-name'
					},
					{
						id: 'projectBindingCel',
						title: '绑定手机号',
						validate: true,
						describe: '',
						value: '',
						links: '/project/project-phone',
						hasgutter: true
					},
					{
						id: 'projectPartnerDemandIds',
						title: '合伙人需求',
						validate: true,
						describe: '',
						value: '',
						links: '/project/requirement',
						hasgutter: true
					},
					{
						id: 'projectDetailedIntroduction',
						title: '项目详细介绍',
						validate: true,
						describe: '',
						value: '',
						links: '/project/project-introduction',
						hasgutter: true
					}
				],
				actions: [
					'take-picture',
					'select-picture',
				],
				projectVm: {
					"createUserId": this.$env.custId,
					"projectName": "",
					"projectAreaId": "",
					"projectImgUrl": "",
					"projectIntro": "",
					"projectIndustryFieldId": "",
					"projectFinancingDemandId": "",
					"projectLinkmanName": "",
					"projectBindingCel": "",
					"projectPartnerDemandIds": "",
					"projectDetailedIntroduction": "",
					"activityId": ""
				}
			}
		},
		mounted: function() {

			this.$http.post('/services/item/getItemInfoByUserId', {
					"createUserId": this.$env.custId
				})
				.then((res) => res.json())
				.then(body => {
					if(body.msg === 'success') {
						this.projectVm = body.data;
					} else {
						let projectData = sessionStorage.getItem('project');
						this.projectVm = Object.assign({}, this.projectVm, JSON.parse(projectData));
					}
					this.setViewData();

					sessionStorage.setItem('project', JSON.stringify(this.projectVm));
				});
		},
		methods: {

			clickuphead() {
				yryz.uploadPics({ picNum: 1 })
					.then((data) => {
						this.data[0].value = data.picUrls;
						this.projectVm.projectImgUrl = data.picUrls;
						sessionStorage.setItem('project', JSON.stringify(this.projectVm));
						this.setViewData();
					})

			},
			setViewData() {
				console.log('this.projectVm', JSON.stringify(this.projectVm))
				this.data = this.data.map(item => {
					if(item.id == 'projectImgUrl' && this.projectVm[item.id]) {
						item.style = { background: `url(${this.projectVm.projectImgUrl})` }
					}
					if(item.isShow && this.projectVm[item.icon])
						item.icon = this.projectVm[item.icon];
					item.value = this.projectVm[item.id];
					return item;
				});

				//        console.log(JSON.parse(JSON.stringify((this.data))));
			},
			show: function() {

				this.$router.push({ path: '/project/preview' });
				sessionStorage.setItem('project', JSON.stringify(this.projectVm));
			},
			submit() {
				Dialog.confirm({
						title: '提交认证',
						message: '是否确认相关资料已经填写无误？',
						cancelText: '再看看',
					}).then(() => {
						console.log('this.projectVm.id', this.projectVm.id)
						console.log('this.projectVm', JSON.stringify(this.projectVm));
						var url = this.projectVm.id ? '/services/item/updateItemInfo' : '/services/item/single2';
						var method = this.projectVm.id ? 'post' : 'post';
						for(let item of this.data) {
							console.log(item.id + item.validate + ':' + this.projectVm[item.id])
							if(item.validate && !this.projectVm[item.id]) {
								return Toast('请填写' + item.title)
							}
						}
						return this.$http[method](url, this.projectVm);
					})
					.then(res => {
						console.log('res', res)
						if(res.data.data == null) {
							return Toast(res.data.msg);
						}

						this.$router.push({ path: '/project/my-info' });
					})

			}
		}
	}
</script>