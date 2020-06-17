<template>
    <div class="block">
        <div class="item_title" v-bind:class="testclass">
            {{selector.name}}
        </div>
        <div class="item_content" v-if="item.loading">
            <i class="fas fa-sun fa-2x fa-spin"></i>
        </div>
        <div class="item_content" v-if="item.result.status.tests==0">
            {{selector.description}}
        </div>
        <router-link :to="{name:'Tests',params:{idSelector:idSelector,idResult:idResult}}" tag="div" class="item_content" v-else>
            {{selector.description}}
        </router-link>
        <div class="item_footer pointer" v-bind:class="dateclass">
            <div v-if="openProcesses.length>0" @click="openInputForm" class="awaiting">
                <i class="fas fa-exclamation-triangle c4"></i> 
                <span class="c4">Waiting for input!</span>
            </div>
            <div v-else-if="item.result.status">
                <i v-if="item.result.status.datetime==1" class="fas fa-check-circle c1"></i>
                <i v-else="item.result.status.datetime==3" class="fas fa-times-circle c3"></i>
                {{item.result.date | prettydate}}
            </div>
        </div>
        <InputView v-if="showInputForm" v-bind:process="openProcesses[0]" v-on:closeForm="closeForm">
        </InputView>
  </div>
</template>

<script>
import {HTTP} from '../main'
import InputView from '@/components/InputView'

 export default {
  props: ['selector'],
  data(){
      return {
        item:{loading:true,
            result:{},
            tests:{},
            },
        componentKey: 0,
        idSelector:this.selector.id,
        idResult:0,
        showInputForm:false,
        openProcesses:[]
     }
  },
  created(){
    HTTP.get(this.apiURL+'/selectors/'+this.selector.id+'/results/last')
    .then(resp => {
        this.item.result=resp.data.result
        this.idResult=(resp.data.result.id || 0)
        this.item.tests=resp.data.tests
        HTTP.get(this.apiURL+'/selectors/'+this.selector.id+'/processes').then(resp =>{
            this.openProcesses = resp.data.processes['waiting for input']
            this.item.loading=false
        })
    }, error => {
        if (error.response.status==404){
            HTTP.get(this.apiURL+'/selectors/'+this.selector.id+'/processes').then(resp =>{
                this.openProcesses = resp.data.processes['waiting for input']
                this.item.loading=false
                this.selector.description = error.response.data.msg
                this.item.result ={'status':{'tests':0}}
            })
        } else {
            this.$store.dispatch('addMessage',{flavor:'alert-red',text:error})
        }
    })
  },
    components:{
        InputView
    },
  methods:{
    forceRerender(){
      this.componentKey += 1;
    },
    openInputForm(){
        this.showInputForm = true
    },
    closeForm(){
        console.log('colseForm')
        this.showInputForm = false
    }
  },
  computed:{
    testclass: function(){
      if (this.item.result.status){
        return 'bgc'+this.item.result.status.tests
      } else {
        return ''
      }
    },
    dateclass: function(){
      if (this.item.result.status){
        return 'c'+this.item.result.status.datetime
      } else {
        return ''
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
