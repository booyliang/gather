<template>
  <div>
    <y-navigator title="所在城市">
      <span slot="navigator-right">
        <y-link-button></y-link-button>
      </span>
    </y-navigator>
    <div>
      <y-list>
        <y-item @click.native="onclick(item)" clickable v-for="item of data" :title="item.text" :key="item.id"></y-item>
      </y-list>
    </div>
  </div>
</template>

<script>
  import YNavigator from '@/components/navigator/nav';
  import YLinkButton from '@/components/link-button'
  import YList from '@/components/list';
  import YItem from '@/components/item';
  import CityData from '@/js/citydata';


  export default{
    components: {YNavigator,YLinkButton,YList,YItem},
    data(){
      return{
        data:[],
        projectData:{}
      }
    },
     mounted(){
      var province=this.$route.params.province;
      for(let city of CityData){
        if(city.text==province){
          this.data=city.children;
          break;
        }
      }
      console.log('query',this.$route.params)
    },
    methods:{
      onclick:function (item) {
        var cityName=this.$route.params.city;
        var provinceName=this.$route.params.province;
        var townName=item.text;
        var data=`${provinceName} ${townName}`
        this.projectData = this.$localStore.get('project');
        //var projectData = JSON.parse(sessionStorage.getItem('project'));
        //projectData.projectAreaId=data;
        this.projectData.projectAreaId=data
        //sessionStorage.setItem('project', JSON.stringify(projectData));
        this.$router.push('/project/setinfo')
      }
    }
  }
</script>
