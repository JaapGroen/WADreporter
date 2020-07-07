<template>
    <div class="block">
        <div class="item_title" :class="testclass">
            {{selector.name}}
        </div>
        <div class="item_content" v-if="loading">
            <i class="fas fa-sun fa-2x fa-spin"></i>
        </div>
        <div class="item_content" v-else-if="!result">
            {{selector.description}}
        </div>
        <router-link :to="{name:'result',params:{id_selector:selector.id,id_result:result.id}}" tag="div" class="item_content" v-else>
            {{selector.description}}
        </router-link>
        <div class="item_footer pointer" v-bind:class="dateclass">
            <router-link :to="{name:'input',params:{id_selector:selector.id,id_process:openProcesses[0].id}}" v-if="openProcesses.length>0" tag="div" class="awaiting">
                <i class="fas fa-exclamation-triangle c4"></i> 
                <span class="c4">Waiting for input!</span>
            </router-link>
            <div v-else-if="result.status">
                <i v-if="result.status.datetime==1" class="fas fa-check-circle c1"></i>
                <i v-else="result.status.datetime==3" class="fas fa-times-circle c3"></i>
                {{result.date | prettydate}}
            </div>
        </div>
        <router-view></router-view>
  </div>
</template>

<script>
import {HTTP} from '../main'

 export default {
    props: {selector:Object},
    data(){
        return {
            loading:true,
            result:{},
            showInputForm:false,
            openProcesses:[]
        }
    },
  created(){
      this.getLastResult()
  },
    components:{
        // InputView
    },
    methods:{
        getLastResult(){
            HTTP.get(this.apiURL+'/selectors/'+this.selector.id+'/results/last').then((resp)=>{
                this.result = resp.data.result
                this.loading = false
            },(error)=>{
                if (error.response.status == 404){
                    console.clear();
                    HTTP.get(this.apiURL+'/selectors/'+this.selector.id+'/processes').then(resp =>{
                        this.openProcesses = resp.data.processes['waiting for input']
                        this.result = false
                        this.loading = false
                    })
                    
                }
            })
        },
    },
    computed:{
        testclass(){
            if (this.loading || !this.result){
                return 'bgc0'
            } else {
                return 'bgc'+this.result.status.tests
            }
        },
        dateclass(){
            if (this.loading || !this.result ){
                return 'c0'
            } else {
                return 'c'+this.result.status.datetime
            }
        },
        apiURL(){
            return 'http://'+this.$store.getters.api.ip+':'+this.$store.getters.api.port+'/api'
        }
    },
    filters:{
        prettydate: timestamp =>{
            let currentDate = new Date();
            let toFormat = new Date(timestamp);
            if(!timestamp){
                return '?'
            }
            if(toFormat.getDate() == currentDate.getDate() && toFormat.getMonth() == currentDate.getMonth() && toFormat.getFullYear() == currentDate.getFullYear() ) {
                return 'Today'
            }
            if(toFormat.getDate() == (currentDate.getDate() - 1) && toFormat.getMonth() == currentDate.getMonth() && toFormat.getFullYear() == currentDate.getFullYear()) {
                return 'Yesterday'
            }
            let time_diff = Math.abs(toFormat.getTime() - currentDate.getTime());
            let diff_days = Math.ceil(time_diff / (1000 * 3600 * 24));
            return diff_days + ' days ago'
        }
    }
}
</script>

<style scoped>
</style>
