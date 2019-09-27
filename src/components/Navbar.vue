<template>
  <div class="header" v-if="isLoggedIn">
    <router-link to="/selectors" tag="h1" class="pointer">WADreporter</router-link>
    <div class="menu" @mouseover="MenuVisible=true" @mouseleave="MenuVisible=false">
      <button class="button menuitem inputWithIcon" v-if="FilterBoxVisible || MenuVisible">
        <input style="height:23px;" type="text" class="textbox" v-model="selectorFilter" @input="changeselectorFilter"/>
        <i class="fas fa-times" @click="clearFilter"></i>
      </button>
      <button class="button menuitem"  v-if="MenuVisible" @click="reloadSelectors">
        <i class="fas fa-sync"></i>
        Reload
      </button>
      <button class="button menuitem" @click="logout"  v-if="MenuVisible">
        <i class="fas fa-sign-out-alt"></i>
        Logout
      </button>
      <button class="button menuitem">
        <i class="fas fa-caret-left" v-if="!MenuVisible"></i>
        <i class="fas fa-caret-right" v-if="MenuVisible"></i>
        <i class="fas fa-user"></i>
         {{user}}
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        FilterBoxVisible:false,
        selectorFilter:'',
        MenuVisible:false,
      }
    },  
    computed : {
      user : function(){ return this.$store.getters.user},
      isLoggedIn : function(){ return this.$store.getters.isLoggedIn},
    },
    methods: {
      logout: function () {
        this.$store.dispatch('logout')
        .then(() => {
          this.$router.push('/')
        })
      },
      toggleFilter(){
        this.FilterBoxVisible=!this.FilterBoxVisible
      },
      toggleMenu(){
        this.MenuVisible=!this.MenuVisible;
      },
      changeselectorFilter: function(){
        this.$store.commit('changeselectorFilter',this.selectorFilter)
        if(this.selectorFilter.length>0){
            this.FilterBoxVisible=true;
        } else {
            this.FilterBoxVisible=false;
        }
      },
      clearFilter(){
        this.selectorFilter='';
        this.$store.commit('changeselectorFilter',this.selectorFilter)
        this.FilterBoxVisible=false;
      },
      reloadSelectors(){
        window.history.go()
      },
      showGraph(){
          this.$emit('showGraph','thanks')
      },
    },
  }
</script>

<style>
.header{
  display:flex;
  flex-direction:row;
  height:100px;
  align-items:center;
  box-sizing: border-box;
  padding:20px;
  justify-content:space-between;
  border-bottom:2px solid #FFFFFF;
  position:fixed;
  width:100%;
  z-index:10;
}

.textbox{
  border:none;
  background-color:#444444;
  width:200px;
  height:30px;
  border-bottom:3px solid #0FAAEA;
  color:white;
  font-family: 'Roboto', sans-serif;
  border-radius: 5px;
}

.menuitem{
  display:flex;
  flex-direction:row;
  margin:2px;
  align-items:center;
}

.menuitem i{
  padding-right:5px;
}

.menu{
  display:flex;
  flex-direction:row;
}

.inputWithIcon{
    position: relative;
}

.inputWithIcon i {
  position: absolute;
  right: 0;
  padding-right: 10px;
  color:#FFFFFF;
}
</style>
