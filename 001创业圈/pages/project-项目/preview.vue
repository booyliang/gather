<template>
  <div>
    <!--头部导航-->
    <div  class="info-head-bg ">
      <y-navigator title="预览" :show-background="false">
      </y-navigator>
      <!--头像区域-->
      <y-card :data="cardData" :assist="textmas" type="vertical"></y-card>
    </div>
    <!--个人简介区域-->
    <div>
      <y-panel title="一句话简介" icon="m-detil">
        <p v-text="text"></p>
      </y-panel>
    </div>

    <!--合伙人需求-->
    <div>
      <y-panel title="合伙人需求" icon="m-partner">
        <y-tag-list  name="tags" :data="generalTag"></y-tag-list>
      </y-panel>
    </div>
    <!--项目详情-->
    <div>
      <y-panel title="项目详情介绍" icon="m-project">
        <p v-text="itemtext"></p>
      </y-panel>
    </div>
    <!--底部按钮-->
    <!--<div class="info-page-btn">-->
      <!--<y-button @click.native="show" size="l" type="primary" block>加好友</y-button>-->
    <!--</div>-->
  </div>
</template>

<script>
  import {YNavigator,YNavToggle} from '@/components/navigator';
  import YButton from '@/components/button';
  import YItem from '@/components/item';
  import YCard from '@/components/card';
  import YTagList from '@/components/tag-list';
  import YPanel from '@/components/panel';

  export default{
    name:'info',
    components: {YNavigator,YItem,YCard,YButton,YNavToggle,YPanel,YTagList},
    data(){
      return{
        cardData: {
          avatar: 'http://tx.haiqq.com/uploads/allimg/150331/21450462Z-10.jpg',
          name: '程流苏',
          link: '/project/settings',
        },
        textmas:'产品经理 / 85后 / 湖北武汉 ',
        text:'这里是我的个人简介！这里是我的个人简介！不能超过三十个字哦！',
        itemtext:"",
        generalTag:[],
      }
    },
    mounted:function () {
      var projectData = sessionStorage.getItem('project');
      this.projectVm = JSON.parse(projectData);
      console.log('this.projectVm:'+this.projectVm);
      this.cardData={
        avatar: this.projectVm.projectImgUrl,
        name: this.projectVm.projectName,
        link: '',
        badge: true
      };
        this.itemtext=this.projectVm.projectDetailedIntroduction;
        this.text=this.projectVm.projectIntro;
        var idArray = this.projectVm.projectPartnerDemandIds.split(' ');
        var generalTag = [];
       idArray.forEach(item => {
        generalTag.push({text: item});
       })
      console.log(generalTag);
        this.generalTag = generalTag;
        this.textmas=this.projectVm.label;
        this.titleText=this.projectVm.personalProfile;

    }
//    mounted:function () {
//      this.$nextTick(function () {
//        this.list();
//      });
//    },
//    methods:{
//      list: function () {
//        this.$http.get(`services/item/single/${this.$route.params.id}`).then(response=>{
//          this.someData = response.body.data;
//        console.log(this.someData.projectDetailedIntroduction);
//        console.log(this.someData.appName);
//        this.someData.projectDetailedIntroduction=this.itemtext;
//      },response=>{
//          console.log(1);
//        });
//      },
//      show:function () {
//        this.$router.push({path:'/invest/preview'});
//
//      },
//      value:function () {
//        alert(1)
//      }
//    }
  }
</script>
