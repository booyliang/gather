<template>
  <div>
    <div>
      <y-navigator title="合伙人需求">
       <span slot="navigator-right">
        <y-link-button @click.native="submit">完成</y-link-button>
      </span>
      </y-navigator>
    </div>
    <div class="tag-list-warp">
      <y-tag-list ref="value" type="checkbox" name="tags" :data="generalTag"></y-tag-list>
    </div>
  </div>

</template>

<script>
  import {YNavigator,YNavToggle} from '@/components/navigator';
  import YTagList from '@/components/tag-list';
  import YLinkButton from '@/components/link-button';
  export default{
    components: {YNavigator,YNavToggle,YLinkButton,YTagList},
    data(){
      return{
        generalTag:[],
        projectData:{}
      }
    },
    mounted:function () {
      this.projectData = JSON.parse(sessionStorage.getItem('project'));
      var projectPartnerDemandIds=' '+(this.projectData.projectPartnerDemandIds||'')+' '
      this.$http.post('/services/fieldClassify/fieldDesignationByparams', {
        attachCode:7
      }).then(response => {
        var resData = response.data.data;
      for(let item of resData ) {
        var tag={text: item.designation,value:item.designation,checked:false}
        if(projectPartnerDemandIds.indexOf(' '+item.designation+' ')>-1)
          tag.checked=true;
        this.generalTag.push(tag)
      }
      if(resData.msg == 'success') {}
    });
    },
    methods:{
      submit:function () {
        console.log(' this.generalTag', this.generalTag)
        var tagValue = this.$refs.value.getValue();
        tagValue = tagValue.map((tag) => {
            return tag.text;
      });
        var projectPartnerDemandIds=tagValue.join(' ');
        this.projectData.projectPartnerDemandIds = projectPartnerDemandIds;
        sessionStorage.setItem('project', JSON.stringify(this.projectData));
        window.history.go(-1)
      }
    }
  }
</script>
