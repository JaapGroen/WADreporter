<template>
  <transition name="filter-menu">
    <div class="menu-container">
      <div class="bar">
        <input type="text" class="textbox" style="width:400px;" v-model="filter"/>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name:'slidemenu',
    data(){
      return {
        filter:'',
        hover:false,
      }
    },
  }
</script>

<style>
.filter-menu-enter,
.filter-menu-leave-to{
  position:absolute;
  top:0px;
}

.filter-menu-enter-to,
.filter-menu-leave{
  top:100px;
}

.filter-menu-enter-active,
.filter-menu-leave-active{
  transition: transform 500ms;
}

.menu-container{
  z-index:25;
  height:50px;
  border:1px solid red;
  display:flex;
  flex-direction:column;
  justify-content:flex-start;
  align-items:center;
  width:100%;
}

.bar{
  display:flex;
  flex-direction:row;
  border-bottom-left-radius:10px;
  border-bottom-right-radius:10px;
  background-color:#DDDDDD;
  padding:5px;
}



</style>