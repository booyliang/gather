<template>
  <div>
    <y-navigator title="所在城市">
      <span slot="navigator-right">
        <y-link-button></y-link-button>
      </span>
    </y-navigator>
    <div>
      <y-list>
        <y-item @click.native="clickCity(item)" clickable v-for="item of YCityData" :title="item.text" :key="item.id"></y-item>
      </y-list>
    </div>
  </div>
</template>

<script>
  import YNavigator from '@/components/navigator/nav';
  import YLinkButton from '@/components/link-button'
  import YList from '@/components/list';
  import YItem from '@/components/item';
  import YCityData from '@/js/citydata';


  export default{
    components: {YNavigator,YLinkButton,YList,YItem},
    data(){
      return{
        YCityData
      }
    },
    methods:{
      clickCity:function (item) {
        console.log('item.text',item.text);
        console.log(this);
        this.$router.push('/project/city/'+item.text)
      }
    }
  }
</script>
