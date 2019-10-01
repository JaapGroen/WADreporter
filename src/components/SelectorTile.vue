<template>
<!--  <router-link :to="{name:'Tests',params:{idSelector:idSelector,idResult:idResult}}" tag="div" class="block"> -->
  <div class="block">
    <div class="item_title" v-bind:class="testclass">{{item.selector.name}}</div>
    <div class="item_content" v-if="item.loading">
      <i class="fas fa-sun fa-2x fa-spin"></i>
    </div>
    <router-link :to="{name:'Tests',params:{idSelector:idSelector,idResult:idResult}}" tag="div" class="item_content" v-if="!item.loading">
      {{item.selector.description}}
    </router-link>
<!--    <div class="item_content" v-if="!item.loading">{{item.selector.description}}</div> -->
    <div class="item_footer" v-bind:class="dateclass">
      {{item.result.date | prettydate}}
      <button class="smbutton" @click="openAnalytics"><i class="fas fa-info-circle"></i> Analytics</button>
    </div>
    <SelectorAnalytics v-if="showAnalytics" v-on:closePopup="closePopup" v-bind:selector="item.selector"></SelectorAnalytics>
<!--  </router-link> -->
  </div>
</template>


<script>
import {HTTP} from '../main'
import SelectorAnalytics from '@/components/SelectorAnalytics'

 export default {
  props: ['selector'],
  data(){
      return {
        item:{loading:true,
            selector:this.$props.selector,
            result:{},
            tests:{},
            },
        componentKey: 0,
        idSelector:this.$props.selector.id,
        idResult:0,
        apiURL:'http://'+this.$store.getters.api.ip+':'+this.$store.getters.api.port+'/api',
        showAnalytics:false,
      }
  },
  created(){
    HTTP.get(this.apiURL+'/selectors/'+this.$props.selector.id+'/results/last')
    .then(resp => {
        this.item.result=resp.data.result
        this.idResult=resp.data.result.id
        this.item.tests=resp.data.tests
        this.item.loading=false;
        this.forceRerender();
    }, error => {
        console.log(error)
    })
  },
  components:{
    SelectorAnalytics
  },
  methods:{
    forceRerender(){
      this.componentKey += 1;
    },
    openAnalytics(){
      this.showAnalytics=true
    },
    closePopup(){
      this.showAnalytics=false
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

<style>

</style>
