<template>
  <div>
    <y-navigator title="常驻城市">
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
  import TownData from '@/js/citydata';


  export default{
    components: {YNavigator,YLinkButton,YList,YItem},
    data(){
      return{
        data:[]
      }
    },
    mounted(){
      var cityName=this.$route.params.city;
      var provinceName=this.$route.params.province;

      for(let province of TownData){
        if(province.text==provinceName){
          console.log('province',province)
          for (var city of province.children){

            if(city.text==cityName){
              console.log('city',city)
              this.data=city.children;
              break;
            }

          }

        }
      }
      console.log('query',this.$route.query)

    },
    methods:{
      onclick:function (item) {
        var cityName=this.$route.params.city;
        var provinceName=this.$route.params.province;
        var townName=item.text;
        var data=`${provinceName} ${cityName} ${townName}`
        var projectData = JSON.parse(sessionStorage.getItem('project'));
        projectData.projectAreaId=data;
        sessionStorage.setItem('project', JSON.stringify(projectData));
        this.$router.push('/project/settings')
      }
    }
  }
</script>
