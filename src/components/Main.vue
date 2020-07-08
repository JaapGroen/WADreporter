<template>
    <div class="fullpage">
        <Navbar></Navbar>
        <router-view></router-view>
    </div>
</template>

<script>
import Navbar from '@/components/Navbar'

export default{
    data(){
        return{
        }
    },
    components:{
        Navbar,
    },
    computed:{
        isLoggedIn : function(){ return this.$store.getters.isLoggedIn},
    },
}
</script>

<style scoped>
.fullpage{
  width:100%;
  height:100%
}
</style>