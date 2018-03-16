<template>
  <div>
    <y-navigator title="绑定手机号" >
      <span slot="navigator-right">
        <y-link-button @click.native="submit">完成</y-link-button>
      </span>
    </y-navigator>
   <y-input class="text-fs" text="true" placeholder="请输入手机号码" v-model="value" :disabled="hasStart">
		<y-link-button slot="right" @click.native="getVerifyCode">{{countDownText}}</y-link-button>
	</y-input>
	<y-input class="text-fs"  placeholder="请输入验证码" text="true" v-model='verifyCode' maxlength="6"></y-input>
  </div>

</template>

<script>
  import YNavigator from '@/components/navigator/nav';
  import YLinkButton from '@/components/link-button';  
  import Toast from '@/components/toast';  
  import YInput from '@/components/input';
 
  export default{
    components: {YNavigator,YLinkButton,YInput},
    data(){
      return {
        projectData: {}
        ,interval:null
				,count:60
				,countDownText:'获取验证码'
				,value:''
				,hasStart:false
				,hasVerify:false
				,verifyCode:''
      }
    },
    mounted() {
      this.projectData = JSON.parse(sessionStorage.getItem('project'));
      this.value=this.projectData.projectBindingCel;
    }
    ,beforeDestroy(){
    		//console.log('beforeDestroy countDown');
    		clearInterval(this.interval);
    	}
    , methods:{
    	getVerifyCode(){
				if(!this.value){return Toast('请输入手机号码！')}
				console.log('this.value',this.value);
				if(this.hasStart) return;
				this.$http.get(`/services/user/smsauth/${this.value}/3`);
				this.count=60;
				this.hasStart=true;
				this.interval=setInterval(()=>{
					this.count = this.count - 1;
					this.countDownText=this.count+'s'+'再次获取验证码';
					if(this.count<=0){
					this.hasStart=false;
					clearInterval(this.interval);
					}
				}, 1000)
				
			}  
     
      ,async submit () {
        let length = this.value.length;
        console.log ('this.value', this.value) 
        if(length<=0){
          Toast('不能少于11位数');
        }else {
        	var postData={phone:this.value,code:"3",verifyCode:this.verifyCode};
        	console.log('postData',postData)
        var res= await	this.$http.post('/services/user/smsauth/check',postData);
        if(res.data.data.data=='true'){
        	  this.projectData.projectBindingCel=this.value;
        	  sessionStorage.setItem('project', JSON.stringify(this.projectData));
        	  window.history.go(-1)
        }else{
        	Toast('验证失败')
        }
        
          //返回至投资人认证页面并传值   
        }
      }
    }
  }
</script>
