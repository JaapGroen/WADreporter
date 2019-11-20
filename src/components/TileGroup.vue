<template>
    <div class="tilerow">
        <div class="grouplabel"><span class="vertical-text">{{group.name}}</span></div>
        <div class="tilegroup">
            <SelectorTile v-for="selector in filteredSelectors" v-bind:selector="selector" :key="selector.id"></SelectorTile>
        </div>
    </div>
</template>

<script>
  import SelectorTile from '@/components/SelectorTile'
  
  export default {
    props: ['group'],  
    data(){
      return {
      
      }
    },
    computed:{
      filteredSelectors(){
        const selectorFilter=this.$store.getters.selectorFilter
        return this.$props.group.selectors.filter(function(el){
          return el.name.toLowerCase().includes(selectorFilter)
        })
      }
    },
    components: {
        SelectorTile,
    },
  } 
</script>

<style>
.tilerow{
  display:flex;
  flex-direction:row;
  flex-wrap:no-wrap;
  width:100%;
}

.tilegroup{
  display:flex;
  flex-direction:row;
  flex-wrap:wrap;
}

.grouplabel{
  display:flex;
  flex-direction:column;        /* added for add report... */
  align-items:center;
  justify-content:space-around;
  background:#2F2F2F;
  height:250px;
  width:50px;
  border-radius:25px;
  margin:20px;
}

.vertical-text{
  transform: rotate(270deg);
  white-space: nowrap;
}
</style>