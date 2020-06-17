<template>
    <div class="navbar">
        <div class="header" v-if="isLoggedIn && selector">
            <router-link to="/selectors" tag="h1" class="pointer">WADreporter <span>/ {{selector.name}}</span></router-link>
            
            <div class="alertbox" v-if="messages.length>0">
                <div v-for="message in messages" class="alert" v-bind:class="message.flavor">
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
                <button class="btn btn-large menuitem" @click="openAnalytics" v-if="MenuVisible && selector.id>0">
                    <i class="fas fa-info-circle"></i>
                    Analytics
                    </button>
                <button class="btn btn-large menuitem inputWithIcon" v-if="MenuVisible || selectorFilter.length>0">
                    <input style="height:23px;" type="text" class="textbox" v-model="selectorFilter" @input="changeselectorFilter"/>
                    <i class="fas fa-times" @click="clearFilter"></i>
                </button>
                <button v-bind:class="{yellow:notes.length>0}" class="btn btn-large menuitem" v-if="(MenuVisible && selector.id>0) || (selector.id>0 && notes.length>0)" @click="openAddNote()" >
                    <i v-if="notes.length>0" class="fas fa-exclamation-triangle"></i>
                    <i v-if="notes.length==0" class="fas fa-plus-circle"></i>
                    Notes
                </button>
                <button class="btn btn-large menuitem">
                    <i class="fas fa-caret-left" v-if="!MenuVisible"></i>
                    <i class="fas fa-caret-right" v-if="MenuVisible"></i>
                    <i class="fas fa-user"></i>
                    {{user.name}} ({{user.role.name}})
                </button>
            </div>
        </div>
        <SelectorAnalytics v-if="showAnalytics" v-on:closeAnalytics="closeAnalytics" v-bind:selector="selector"></SelectorAnalytics>
        <NotesView v-if="showAddNote" v-on:closeAddNote="closeAddNote"></NotesView>
    </div>
</template>

<script>
import SelectorAnalytics from '@/components/SelectorAnalytics'
import NotesView from '@/components/NotesView'

export default {
    props:['selector'],
    data(){
      return {
        FilterBoxVisible:false,
        selectorFilter:this.$store.getters.selectorFilter,
        MenuVisible:false,
        showAnalytics:false,
        showAddNote:false,
      }
    },  
    computed : {
        user : function(){ return this.$store.getters.user},
        isLoggedIn : function(){ return this.$store.getters.isLoggedIn},
        currentResult(){
            return this.$store.getters.currentResult
        },
        notes(){
            if (typeof this.currentResult.data_set === 'undefined') {
                return []
            } else {
                return this.currentResult.data_set.notes
            }
        },
        messages(){
            return this.$store.getters.messages
        }
    },
    methods: {
      logout: function () {
        this.$store.dispatch('logout')
        .then(() => {
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
      openAnalytics(){
          this.showAnalytics=true
      },
      closeAnalytics(){
          this.showAnalytics=false
      },
      openAddNote(){
          this.showAddNote = true
      },
      closeAddNote(){
          this.showAddNote = false
      }
    },
	components:{
		SelectorAnalytics,
        NotesView
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
</style>
