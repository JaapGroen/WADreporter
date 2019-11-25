<template>
  <div class="pageoverlay">
    <div class="loginbox">
      <div class="overlaytop">
        <span v-if="!showAPI">WADreporter login</span>
        <span v-if="showAPI">WADQC API information</span>
      </div>
      <div class="overlaycontent">
        <form v-if="!showAPI" class="loginform" @submit.prevent="login">
          <input class="textbox" required v-model="credentials.username" type="text" placeholder="Username..."/>
          <input class="textbox" required v-model="credentials.password" type="password" placeholder="Password..."/>
          <button class="button" @click="login()">Login</button>
        </form>
        <form v-if="showAPI" class="loginform" @submit.prevent="setAPI">
          <input class="textbox" required v-model="api.ip" type="text"/>
          <input class="textbox" required v-model="api.port" type="text"/>
          <button class="button" @click="setAPI()">Opslaan</button>
        </form>
      </div>
      <div class="overlayfooter">
        <div>{{msg}}</div>
        <div>
          <button v-if="!showAPI" class="smbutton" @click="toggleView()"><i class="fas fa-cog"></i> API</button>
          <button v-if="showAPI" class="smbutton" @click="toggleView()"><i class="fas fa-sign-in-alt"></i> Login</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import {HTTP} from '@/main'

  export default {
    data(){
      return {
        credentials:{username : "",password : ""},
        msg:"",
        showAPI:false,
      }
    },
    computed:{
        apiURL(){
            return 'http://'+this.$store.getters.api.ip+':'+this.$store.getters.api.port+'/api'
        },
        api(){
            return this.$store.getters.api
        }
    },
    methods: {
      login: function(){
          this.$store.dispatch('login',{apiURL:this.apiURL,credentials:this.credentials})
          .then((resp)=>{
              if (resp.data.success){
                  this.$router.push('/selectors').catch(()=>{})
              } else {
                  this.msg = resp.data.msg
              }
          })
      },
      setAPI(){
          this.$store.dispatch('setAPI',this.api).then((resp)=>{
              if (resp){
                  this.showAPI=false;
                  this.msg="API information saved."
              }
          })
      },
      toggleView(){
        this.showAPI=!this.showAPI;
        this.msg=""
       },
    },
  }
</script>

<style>
.loginbox{
  display:flex;
  flex-direction:column;
  height:300px;
  width:300px;
  box-sizing:border-box;
  align-items:center;
  justify-content:center;
}

.textbox{
  border:none;
  background-color:#444444;
  width:100%;
  height:30px;
  border-bottom:3px solid #0FAAEA;
  color:white;
  font-family: 'Roboto', sans-serif;
  border-radius:5px;
  padding-left:5px;
  box-sizing:border-box;

}

.loginform{
  display:flex;
  flex-direction:column;
  justify-content:space-around;
  min-height:175px;
  width:100%;
  box-sizing:border-box;
  padding-left:5px;
  padding-right:5px;
}

</style>
