<template>
    <div class="navbar">
        <div class="header">
            <router-link to="/selectors" tag="h1" class="pointer">WADreporter <span v-if="show_selectorname" class="selectorname">/ {{selectorresult.selector.name}}</span></router-link>
            
            <div class="alertbox" v-if="messages.length>0">
                <div v-for="(message,index) in messages" class="alert" v-bind:class="message.flavor" :key="index">
                    {{message.text}} &nbsp; &nbsp; &nbsp; 
                    <i class="fas fa-times pointer" @click="removeMessage(message)"></i>
                </div>
            </div>
            
            <div class="menu" @mouseover="MenuVisible=true" @mouseleave="MenuVisible=false">
                <button class="btn btn-large menuitem"  v-if="MenuVisible" @click="reloadSelectors">
                    <i class="fas fa-sync"></i>
                    Reload
                </button>
                <button class="btn btn-large menuitem" @click="logout"  v-if="MenuVisible">
                    <i class="fas fa-sign-out-alt"></i>
                    Logout
                </button>
                <router-link :to="{name:'selectoranalytics'}" class="btn btn-large menuitem" v-if="MenuVisible && show_selectorname" tag="button">
                    <i class="fas fa-info-circle"></i>
                    Analytics
                </router-link>
                <button class="btn btn-large menuitem inputWithIcon" v-if="MenuVisible || filter.length>0">
                    <input style="height:23px;" type="text" class="textbox" v-model="filter" @input="changeFilter"/>
                    <i class="fas fa-times" @click="clearFilter"></i>
                </button>
                <router-link :to="{name:'notes',params:{id:selectorresult.result.data_set.id}}" tag="button"  v-bind:class="{yellow:notes.length>0}" class="btn btn-large menuitem" v-if="(MenuVisible && show_selectorname) || (show_selectorname && notes.length>0)">
                    <i v-if="notes.length>0" class="fas fa-exclamation-triangle"></i>
                    <i v-if="notes.length==0" class="fas fa-plus-circle"></i>
                    Notes
                </router-link>
                <button class="btn btn-large menuitem">
                    <i class="fas fa-caret-left" v-if="!MenuVisible"></i>
                    <i class="fas fa-caret-right" v-if="MenuVisible"></i>
                    <i class="fas fa-user"></i>
                    {{user.name}} ({{user.role.name}})
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'

export default {
    data(){
      return {
        FilterBoxVisible:false,
        MenuVisible:false,
        filter:''
      }
    },  
    computed : {
        user(){
            return this.$store.getters.user
        },
        selectorresult(){
            return this.$store.getters.selectorresult
        },
        show_selectorname(){
            return !_.isEmpty(this.selectorresult);
        },
        messages(){
            return this.$store.getters.messages
        },
        notes(){
            return this.selectorresult.result.data_set.notes
        },
    },
    methods: {
        logout(){
            this.$store.dispatch('logout').then(() => {
                this.$router.push('/login')
            })
        },
        removeMessage(message){
            this.$store.dispatch('removeMessage',message)
        },
        toggleFilter(){
            this.FilterBoxVisible=!this.FilterBoxVisible
        },
        toggleMenu(){
            this.MenuVisible=!this.MenuVisible;
        },
        changeFilter(){
            this.$store.commit('setFilter',this.filter)
        },
        clearFilter(){
            this.filter='';
            this.$store.commit('setFilter','')
        },
        reloadSelectors(){
            this.$store.dispatch('getSelectors').then(()=>{
                this.$store.dispatch('clearLastResults').then(()=>{
                    window.history.go()
                })
            })
        },
    },
	components:{
	}
  }
</script>

<style scoped>
.btn.yellow{
    background-color:#eaf518;
}

.alert{
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    align-items:center;
    padding:10px;
    border-radius:5px;
    border:1px solid white;
}

.alert-blue{
    background-color:#4a89e8;
}

.alert-green{
    background-color:#58a55c;
}

.alert-orange{
    background-color:#eab63e;
}

.alert-red{
    background-color:#d8513f;
}

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
}

.navbar{
    display:flex;
    flex-direction:column;
}

.selectorname{
    font-size:16px;
}
</style>
