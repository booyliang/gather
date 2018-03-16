<template>
  <div>
    <y-navigator title="联系人姓名">
      <span slot="navigator-right">
        <y-link-button @click.native="submit">完成</y-link-button>
      </span>
    </y-navigator>

    <y-input class="text-fs" v-model="projectData.projectLinkmanName" text="true" maxlength="10" placeholder="请输入联系人姓名" count="true" match="10"></y-input>
  </div>
</template>

<script>
  import YNavigator from '@/components/navigator/nav';
  import YLinkButton from '@/components/link-button';
  import YInput from '@/components/input/index';
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
        this.projectData.projectLinkmanName = texto;
      },
      submit:function () {
        let length = this.projectData.projectLinkmanName.length;
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
