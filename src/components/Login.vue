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
          <button class="btn btn-large" @click="login()">Login</button>
        </form>
        <form v-if="showAPI" class="loginform" @submit.prevent="setAPI">
          <input class="textbox" required v-model="api.ip" type="text"/>
          <input class="textbox" required v-model="api.port" type="text"/>
          <button class="btn btn-large" @click="setAPI()">Opslaan</button>
        </form>
      </div>
      <div class="overlayfooter">
        <div>{{msg}}</div>
        <div>
          <button v-if="!showAPI" class="btn btn-small" @click="toggleView()"><i class="fas fa-cog"></i> API</button>
          <button v-if="showAPI" class="btn btn-small" @click="toggleView()"><i class="fas fa-sign-in-alt"></i> Login</button>
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


</style>
