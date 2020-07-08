<template>
    <div class="grid">
        <div class="block" v-if="loading">
            <div class="item_title bgc0">Loading</div>
            <div class="item_content">
                <i class="fas fa-sun fa-2x fa-spin"></i>
            </div>
            <div class="item_footer"></div>
        </div>
        <TestsGroup v-for="group in groupedTests" v-bind:group="group" :key="group.name"></TestsGroup>
        <router-view></router-view>
    </div>
</template>

<script>
import {HTTP} from '../main'
import TestsGroup from '@/components/TestsGroup'

  
export default {
    data(){
      return {
        tests:[],
        loading:true,
        notes:[]
      }
    },
    mounted(){
        this.getResult()
    },
    methods:{
        getResult(){
            if (this.lastresult == undefined){
                HTTP.get(this.apiURL+'/selectors/'+this.$route.params.id_selector+'/results/'+this.$route.params.id_result).then(resp => {
                    this.tests = resp.data.tests
                    this.$store.commit('setSelectorResult',{selector:resp.data.selector,result:resp.data.result})
                    this.loading = false
                })
            } else if (this.lastresult.result.id == this.$route.params.id_result){
                this.tests = this.lastresult.tests
                this.$store.commit('setSelectorResult',{selector:this.lastresult.selector,result:this.lastresult.result})
                this.loading = false
            } else {
                HTTP.get(this.apiURL+'/selectors/'+this.$route.params.id_selector+'/results/'+this.$route.params.id_result).then(resp => {
                    this.tests = resp.data.tests
                    this.$store.commit('setSelectorResult',{selector:resp.data.selector,result:resp.data.result})
                    this.loading = false
                })
            }
        }
    },
    computed:{
        groupedTests(){
            var groups = []
            if (!this.loading){
                this.tests.forEach((test)=>{
                    var groupname = "[no level]"
                    if ('display_level' in test){
                        groupname = "[level "+[test.display_level]+"]"
                    }
                    var group = groups.filter(group => group.name === groupname)
                    if (group.length==0){
                        groups.push({name:groupname,tests:[test]})
                    } else {
                        group[0].tests.push(test)
                    }
                })
            }
            return groups
        },
        apiURL(){
            return 'http://'+this.$store.getters.api.ip+':'+this.$store.getters.api.port+'/api'
        },
        lastresult(){
            return this.$store.getters.lastresult(this.$route.params.id_selector)
        }
    },   
   components: {
        TestsGroup
    },
}
</script>

<style scoped>
.grid{
  display:flex;
  flex-direction:row;
  flex-wrap:wrap;
  top:100px;
  height:calc(100% - 100px);
  overflow: auto;
  position:fixed;
  width:100%;
}
</style>
