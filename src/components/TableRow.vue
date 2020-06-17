<template>
    <div class="tablerow" @click=gotoTest(test.selector.id,test.result.id) v-bind:style="highlight" @mouseover="hover = true" @mouseleave="hover = false">
        <div class="date">{{test.x | isodate}}</div>
        <div class="value" v-bind:class="c_class">{{test.y}}</div>
        <div class="limit" v-if="!!test.limit">{{test.limit}}</div>
        <div class="limit" v-else>-</div>
    </div>
</template>

<script>
import TableRow from '@/components/TableRow'


export default {
  props:['test'],
  data(){
      return {
        msg:'',
        loaded:false,
        item:'',
        componentKey: 0,
        hover:false,
      }
  },
  methods:{
    forceRerender(){
      this.componentKey += 1;
    },
    gotoTest(idSelector,idResult){
        this.$router.push({path:'/selectors/'+idSelector+'/results/'+idResult})
        this.$router.go(this.$router.currentRoute)
    },
  },
  filters:{
    decimals: value =>{
        return Math.round(value * Math.pow(10, 2)) / Math.pow(10, 2);
    },
    isodate: timestamp =>{
        let d = new Date(timestamp);
        return d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear()
    },
  },
  computed:{
    c_class: function(){
      if(!!this.test.limit){
        if(this.test.limit==this.test.y){
          return 'c1'
        } else {
          return 'c3'  
        }
      }
    },
    highlight: function(){
        if (this.hover){
            return 'background-color:#141a26;'
        }
    }
  }
}

</script>

<style scoped>
.date{
    padding-left:5px;
    padding-right:5px;
    flex:1 0 0;
}

.value{
    padding-left:5px;
    padding-right:5px;
    flex:1 0 0;
}

.limit{
    padding-left:5px;
    padding-right:5px;
    flex:1 0 0;
}
</style>
