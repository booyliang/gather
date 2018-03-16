<template>
	<div>
		<y-navigator title="项目名称">
			<span slot="navigator-right">
        <y-link-button @click.native="submit">完成</y-link-button>
      </span>
		</y-navigator>

		<y-input class="text-fs" v-model="projectName" text="true" maxlength="15" placeholder="请输入项目名称" count="true" match="15"></y-input>
	</div>
</template>

<script>
	import YNavigator from '@/components/navigator/nav';
	import YLinkButton from '@/components/link-button';
	import YInput from '@/components/input/index';
	import Toast from '@/components/toast';
	export default {
		components: { YNavigator, YLinkButton, YInput },
		data() {
			return {
				projectData: {},
				projectName:''
				
			}
		},
		mounted() {
			this.projectData = this.$localStore.get('project');
            this.projectName=this.projectData.projectName;	
		},
		methods: {
			submit: function() {
				let length = this.projectData.projectName.length;
				if(length <= 0) {
					Toast('不能少于1个字');
				} else {
					this.projectData.projectName=this.projectName
					//sessionStorage.setItem('project', JSON.stringify(this.projectData));
					//返回至投资人认证页面并传值
					this.$router.go(-1);
				}
			}
		}
	}
</script>