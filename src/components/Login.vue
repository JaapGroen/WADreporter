<template>
  <div class="pageoverlay">
    <div class="loginbox">
      <div class="overlaytop">
        <span v-if="!showAPI">WADreporter login</span>
        <span v-if="showAPI">WADQC API information</span>
      </div>
      <div class="overlaycontent">
        <div v-if="!showAPI" class="loginform">
          <input class="textbox" required v-model="credentials.username" type="text" placeholder="Username..."/>
          <input class="textbox" required v-model="credentials.password" type="password" placeholder="Password..."/>
          <button class="button" @click="login()">Login</button>
        </div>
        <div v-if="showAPI" class="loginform">
          <input class="textbox" required v-model="api.ip" type="text"/>
          <input class="textbox" required v-model="api.port" type="text"/>
          <button class="button" @click="setAPI()">Opslaan</button>
        </div>
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
        api:{ip:this.$store.getters.api.ip,port:this.$store.getters.api.port},
        apiURL:'http://'+this.$store.getters.api.ip+':'+this.$store.getters.api.port+'/api'
      }
    },
	methods: {
/*       login: function () {
        let username = this.username 
        let password = this.password
        this.$store.dispatch('login', { username, password })
       .then(() => this.$router.push('/selectors'))
       .catch(err => this.msg=err)
      }, */
      login(){
          HTTP.post(this.apiURL+'/authenticate', this.credentials).then(resp => {
              if(resp.data.success){
                  const token = resp.data.token
                  localStorage.setItem('WADtoken', token)
                  const user = resp.data.username
                  localStorage.setItem('WADuser', user)
                  this.$store.commit('auth_success',{token:token,user:user})
                  HTTP.defaults.headers['Authorization'] = 'JWT '+token
                  this.$router.push('/selectors')
              } else {
                  this.msg=resp.data.msg
              }
          })
      },
      setAPI(){
          this.$store.commit('setAPI',this.api)
          this.apiURL='http://'+this.$store.getters.api.ip+':'+this.$store.getters.api.port+'/api'
          this.showAPI=false;
          this.msg="API information saved."
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
