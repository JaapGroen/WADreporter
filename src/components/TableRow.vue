<template>
  <div class="tablerow">
    <div class="tablecell">{{test.x | isodate}}</div>
    <div class="tablecell" v-bind:class="c_class">{{test.y}}</div>
    <div class="tablecell" v-if="!!test.limit">{{test.limit}}</div>
    <div class="tablecell" v-if="!test.limit">-</div>
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
      }
  },
  methods:{
    forceRerender(){
      this.componentKey += 1;
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
  }
}

</script>

<style>
.tablerow{
  display:flex;
  flex-direction:row;
  width:100%;
  justify-content:space-around;
}

.tablerow:nth-child(even){
    background-color: #0C0C0C;
}

.tablerow:nth-child(odd){
    background:#2F2F2F;
}

.tablecell{
    width:33%;
    padding-left:10px;
}

</style>