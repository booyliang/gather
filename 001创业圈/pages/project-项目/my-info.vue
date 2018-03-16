<template>
  <div>
    <!--头部导航-->
    <div  class="info-head-bg ">
      <y-navigator title="我的项目" :show-background="false">
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
        <p v-text="mytext"></p>
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
      <y-button v-if="ShowA"  type="primary" disabled block>已提交，等待审核...</y-button>
      <y-button v-else-if="showB" @click.native="onclick"  type="ghost" situation="error" block>审核未通过修改重新提交</y-button>
      <y-button v-else-if="showC" @click.native="onclick"  type="ghost" block>已通过审核，点击再次编辑</y-button>
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
    components: {YNavigator,YItem,YCard,YButton,YNavToggle,YPanel,YTagList},
    data(){
      return{
        cardData: {
          avatar: 'http://tx.haiqq.com/uploads/allimg/150331/21450462Z-10.jpg',
          name: '程流苏',
          link: '/project/settings',
        },
        textmas:'产品经理 / 85后 / 湖北武汉 ',
        mytext:'',
        itemtext:'这里是我的项目介绍！这里是我的项目介绍！这里是我的项目介绍！这里是我的项目介绍！这里是我的项目介绍！这里是我的项目介绍！这里是我的项目介绍！这里是我的项目介绍！这里是我的项目介绍！这里是我的项目介绍！这里是我的项目介绍！这里是我的项目介绍！这里是我的项目介绍！这里是我的项目介绍！不超过1000字！',
        generalTag:[],
        ShowA:false,
        ShowB:false,
        ShowC:false
      }
    },
    mounted:function () {
      this.$nextTick(function () {
        this.list();
      });

    },
    methods:{
      list: function () {
        const param=JSON.stringify({})
        let _this=this;
        this.$http.post('/services/item/getItemInfoByUserId',{
          "createUserId":this.$env.custId
        }).then(function(response){
          this.someData = response.body.data;
          this.cardData = {
            avatar: this.someData.projectImgUrl,
            name: this.someData.projectName,
            link: '',
            badge: true
          };
          var idArray = this.someData.projectFinancingDemandId.split(' ');
          var generalTag = [];
          idArray.forEach(item => {
            this.generalTag.push({text: item});
          });
          this.itemtext=this.someData.projectDetailedIntroduction;
          this.mytext=this.someData.projectIntro;
          this.textmas=this.someData.label;

          if(this.someData.approveState == 1 && this.someData.data) {
            this.ShowB=true;          
            this.ShowA=false;
            this.ShowC=false;
          }else if(this.someData.approveState == 2){
            this.ShowA=true;
            this.ShowB=false;
            this.ShowC=false;
          }else if(this.someData.approveState == 3){
            this.ShowA=false;
            this.ShowB=false;
            this.ShowC=true;
          }


        }, function(response){
          // error callback
          console.log(1);
        });
      },
      onclick:function () {
        this.$router.push({path:'/project/settings/' + this.$env.custId});
      }
    }
  }
</script>
