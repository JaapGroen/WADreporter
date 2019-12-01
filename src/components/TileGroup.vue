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

</style>
