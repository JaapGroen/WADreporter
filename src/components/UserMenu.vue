<template>
  <div>
    <div v-if="MenuVisible">

    </div>
  
    
  </div>
</template>

<script>
  import store from '../store/store'
  import {EventBus} from '../eventbus/eventbus'

  export default {
    props:['user'],
    data(){
      return {
        MenuVisible:false,
        FilterBoxVisible:false,
      }
    },
    methods: {
      toggleMenu: function(){
        this.MenuVisible=!this.MenuVisible;
      },
      toggleFilter: function(){
        EventBus.$emit('toggleFilter')
      },
      logout: function () {
        store.dispatch('logout')
        .then(() => {
          this.$router.push('/')
        })
      },
      alertme: function(){
        alert('wooha!')
      },
    }
  }
</script>

<style>
.UserMenu{
  z-index:500;
  width:100px;
  position:absolute;
  right:35px;
  display:flex;
  flex-direction:column;
  border-radius:5px;
  background-color:#DDDDDD;
  color:#000000;
}

.MenuItem{
  display:flex;
  flex-direction:row;
  flex-wrap:no-wrap;
  justify-content:flex-start;
  align-items:center;
  height:30px;
  padding:5px;
}

</style>
