<template>
  <div>
    <y-navigator title="项目详细介绍">
      <span slot="navigator-right">
        <y-link-button @click.native="submit">完成</y-link-button>
      </span>
    </y-navigator>

    <y-input v-model="projectData.projectDetailedIntroduction" yangshi="l"  maxlength="1000" placeholder="请输入项目亮点，竞争优势，市场机会，商业模式，发展规划等项目详细信息。" count="true" match="1000"></y-input>
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
        projectData: {}
      }
    },
    mounted() {
      this.projectData = JSON.parse(sessionStorage.getItem('project'));
    },
    methods:{
      input:function (texto) {
        this.projectData.projectDetailedIntroduction = texto;
      },
      submit:function () {
        let length = this.projectData.projectDetailedIntroduction.length;
        if(length<=0){
          Toast('不能少于1个字');
        }else {
          sessionStorage.setItem('project', JSON.stringify(this.projectData));
          //返回至投资人认证页面并传值
          window.history.go(-1)
        }
      }
    }
  }
</script>
