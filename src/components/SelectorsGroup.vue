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
    props: {group: Object},  
    data(){
        return {
      
        }
    },
    computed:{
        filteredSelectors(){
            return this.group.selectors.filter((selector)=>{
                return selector.name.toLowerCase().includes(this.$store.getters.filter.toLowerCase()) ||
                selector.description.toLowerCase().includes(this.$store.getters.filter.toLowerCase())
            })
        }
    },
    components: {
        SelectorTile,
    },
  } 
</script>

<style scoped>
.grouplabel{
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:space-around;
  background:#323b47;
  height:250px;
  width:50px;
  border-radius:25px;
  margin:20px;
}

.vertical-text{
  transform: rotate(270deg);
  white-space: nowrap;
}

.tilerow{
  display:flex;
  flex-direction:row;
  flex-wrap:no-wrap;
  width:100%;
}

.tilerow:nth-child(even){
    background-color: #0c111b;
}

.tilerow:nth-child(odd){
    background-color: #101622;
}

.tilegroup{
  display:flex;
  flex-direction:row;
  flex-wrap:wrap;
}
</style>
