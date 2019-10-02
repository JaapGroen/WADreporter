<template>
  <div>
    <Navbar v-bind:selector="item.selector"></Navbar>
    <div class="grid">
      <div class="block" v-if="loading">
        <div class="item_title bgc0">Loading</div>
        <div class="item_content">
          <i class="fas fa-sun fa-2x fa-spin"></i>
        </div>
        <div class="item_footer"></div>
      </div>
	  <TestTile v-for="test in filteredTests" v-bind:test="test" :selector="item.selector" :result="item.result" :key="test.type+test.id" ></TestTile>
    </div>
  </div>
</template>

<script>
  import TestTile from '@/components/TestTile'
  import {HTTP} from '../main'
  import Navbar from '@/components/Navbar'
  
  export default {
    data(){
      return {
        idSelector:this.$route.params.idSelector,
        idResult:this.$route.params.idResult,
        item:{tests:[]},
        loading:true,
        apiURL:'http://'+this.$store.getters.api.ip+':'+this.$store.getters.api.port+'/api'
      }
    },
    mounted(){
        HTTP.get(this.apiURL+'/selectors/'+this.idSelector+'/results/'+this.idResult)
            .then(resp => {
                this.item=resp.data
                this.loading=false;
        }, error => {
            console.log(error)
        })
    },
    computed:{
      filteredTests(){
        const testFilter=this.$store.getters.selectorFilter
        return this.item.tests.filter(function(el){
          return el.name.toLowerCase().includes(testFilter)
        })
      }
    },   
    components: {
        TestTile,
        Navbar
    },
  }
</script>
