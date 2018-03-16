<template>
  <div>
    <!--头部导航-->
    <y-navigator title="项目">
      <span slot="navigator-right">
        <y-nav-toggle id="open"></y-nav-toggle>
        <y-link-button icon="search"></y-link-button>
      </span>
    </y-navigator>
    <!--tab切换-->
    <y-tab-bar v-model="activeBarId" class="tab-bar-more">
      <y-tab-bar-item v-for="(item,index) of menuData" key="index"  :id="index">{{item.categoryName}}</y-tab-bar-item>
    </y-tab-bar>
    <!--列表区域-->
    <y-tab-container>
      <y-tab-container-item>
        <y-list class="project">

          <y-item v-for="(item,index) of data" :key="item.id">
            <router-link :to="item.link" tag="div">
            <y-card :data="item" :assist="item.projectIntro">
              <p>标签：{{item.label}}</p>
                <p>找合伙人：<span v-text="item.projectPartnerDemandIds"></span></p>
            </y-card>
           </router-link>
          </y-item>
        </y-list>
      </y-tab-container-item>
    </y-tab-container>

    <!--底部悬浮按钮-->
    <div class="add-idea" @click="putt"></div>
    <y-menu fixed :menu="menu" handle="#open"></y-menu>
  </div>
</template>

<script>
  import {YNavigator,YNavToggle} from '@/components/navigator'
  import YList from '@/components/list';
  import YItem from '@/components/item';
  import YCard from '@/components/card';
  import YLinkButton from '@/components/link-button';
  import YMenu from '@/components/menu';
  import {YTabBar,YTabBarItem,YTabContainer,YTabContainerItem} from '@/components/tab'

  export default{
    components: {YNavigator,YList,YItem,YCard,YLinkButton,YNavToggle,YTabBar,YTabBarItem,YTabContainer,YTabContainerItem,YMenu},

    data(){
      return{
        activeBarId:"0",
        data:[],
        menuData:[
          {categoryName:'全部',type:'1'}
        ],
        menu: [
          'homepage'
        ]
      }
    },
    methods:{
      requestData(params){
        this.$http.post('/services/item/getItemListByState',params).then(req=>{
          console.log('req.data.data.result',req.data.data.result)
          this.data=req.data.data.result.reverse();
          for(let item of this.data ) {
            item.name = item.projectName,
            item.avatar = item.projectImgUrl,
            item.badge = true,
            item.link = '/project/info/'+item.id
        }
      }).catch(err=>console.log(err));
      },
      putt:function () {
        this.$http.post('/services/item/getItemInfoByUserId',{
          createUserId:this.$route.params.id
        }).then((response) => {
          var relData=response.body;
          console.log(relData);
        if(relData.msg !== "success" ){
          this.$router.push({path:'/project/settings'});
        }else {
          this.$router.push({path:'/project/my-info/'+this.$env.custId});
        }
        })
      }
    },
    created:function(){
      let params={
        pageNo:1,
        pageSize:100,
        columnCode:'100-1006'
      };
      this.$http.get('/services/category/listByCommon/100-1006').then(req=>{
        this.menuData.push(...req.data.data);
        this.requestData(params)
    }).catch(err=>console.log(err));
    },
    watch:{
    activeBarId(newValue,oldValue){
      let menu= this.menuData[parseInt(newValue)];
      let params={
        pageNo:1,
        pageSize:100,
        columnCode:'100-1006',
        type:menu.categoryName==="全部" ? null : menu.categoryName
      };
      this.requestData(params)
    }
  }


  }
</script>
