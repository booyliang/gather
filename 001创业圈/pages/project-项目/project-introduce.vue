<template>
  <div>
    <y-navigator title="一句话简介">
      <span slot="navigator-right">
        <y-link-button @click.native="submit">完成</y-link-button>
      </span>
    </y-navigator>

    <y-input class="text-fs" v-model="projectIntro" text="true" maxlength="30" placeholder="请输精炼的一句话介绍项目" count="true" match="30"></y-input>
  </div>
</template>

<script>
  import YNavigator from '@/components/navigator/nav';
  import YLinkButton from '@/components/link-button';
  import YInput from '@/components/input/index';
  import Toast from '@/components/toast';
  export default{
    components: {YNavigator,YLinkButton,YInput},
    data(){
      return {
        projectData: {},
        projectIntro:""
      }
    },
    mounted() {
      this.projectData = this.$localStore.get('project');
      this.projectIntro=this.projectData.projectIntro;
    },
    methods:{
      submit:function () {
        let length = this.projectData.projectIntro.length;
        if(length<=0){
          Toast('不能少于1个字');
        }else {
        	this.projectData.projectIntro=this.projectIntro;
          //返回至投资人认证页面并传值
          window.history.go(-1)
        }
      }
    }
  }
</script>
