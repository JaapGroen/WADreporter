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
            <TestGroup v-for="(group,index) in displaygroups" v-bind:group="group" :selector="item.selector" :result="item.result" :level="index" :popup="popup" :key="index"></TestGroup>
        </div>
    </div>
</template>

<script>
//import TestTile from '@/components/TestTile'
import {HTTP} from '../main'
import Navbar from '@/components/Navbar'
import TestGroup from '@/components/TestGroup'
import _ from 'lodash'
  
export default {
    data(){
      return {
        idSelector:this.$route.params.idSelector,
        idResult:this.$route.params.idResult,
        popup:this.$route.query.popup,
        item:{tests:[]},
        loading:true,
        displaygroups:[[],[],[],[],[],[],[],[],[]],
        notes:[]
      }
    },
    mounted(){
        HTTP.get(this.apiURL+'/selectors/'+this.idSelector+'/results/'+this.idResult)
        .then(resp => {
            this.item = resp.data
            resp.data.tests.forEach((test)=>{
                this.displaygroups[test.display_level-1].push(test)
            });
            if (resp.data.result.data_set.notes.length>0){
                this.notes = resp.data.result.data_set.notes
            }
            this.setCurrentResult(resp.data.result)
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
        },
        sortedTests(){
            var tests = _.orderBy(this.filteredTests,[
                function (item) { return item.type=='datetime';},
                function (item) { return item.status; },
                function (item) { return item.display_name; }
            ],["desc","desc","asc"])
            return tests
        },
        apiURL(){
            return 'http://'+this.$store.getters.api.ip+':'+this.$store.getters.api.port+'/api'
        }
    },   
   components: {
        Navbar,
        TestGroup
    },
    methods:{
        setCurrentResult(result){
            this.$store.dispatch('setCurrentResult',result)
        }
    }
}
</script>

<style>
</style>
