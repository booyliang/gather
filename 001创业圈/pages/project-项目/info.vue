<template>
  <div>
    <!--头部导航-->
     <div  class="info-head-bg ">
      <y-navigator title="项目详情" :show-background="false">
      <span slot="navigator-right">
        <y-nav-toggle></y-nav-toggle>
      </span>
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
    <div style="padding:0.7rem;"></div>
    <div class="info-page-btn">
      <y-button @click.native="show"  type="primary" block>关注TA</y-button>
    </div>
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
        textmas:'scsc',
        text:'这里是我的个人简介！这里是我的个人简介！不能超过三十个字哦！',
        itemtext:"ccccccccc",
        generalTag:[],
      }
    },
    mounted:function () {
      this.$nextTick(function () {
        this.list();
      });
      
    },
    methods:{
      list: function () {
        this.$http.get(`/services/item/single/${this.$route.params.id}`).then(response=>{
          var data = response.body.data;
          console.log(data.projectDetailedIntroduction);
          console.log(data.appName);
        this.cardData = {
          avatar: data.projectImgUrl || 'http://tx.haiqq.com/uploads/allimg/150331/21450462Z-10.jpg',
          name: data.projectName || '赵初林',
          link: '',
          badge: true
        };
          this.itemtext=data.projectDetailedIntroduction;
          this.text=data.projectIntro;
          this.textmas=data.label;

         var idArray = data.projectPartnerDemandIds.split(' ');
        var generalTag=[]
         idArray.forEach(item => {
          this.generalTag.push({text: item});
      });

        },response=>{
           console.log(1);
        });
      },
      show:function () {

      }
    }
  }
</script>
