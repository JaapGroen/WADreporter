<template>
    <div class="tablerow" v-bind:style="highlight" @mouseover="hover = true" @mouseleave="hover = false">
        <div class="tablecell">{{note.data_tag.name}}</div>
        <div class="tablecell">{{note.description}}</div>
        <div class="tablecell">
            <button class="btn btn-small" @click="deleteNote()"><i class="fas fa-trash-alt"></i> Remove note</button>
        </div>
    </div>
</template>

<script>
import {HTTP} from '../main'

export default {
  props:['note'],
  data(){
      return {
        hover:false,
      }
  },
  methods:{
    forceRerender(){
      this.componentKey += 1;
    },
    deleteNote(){
        HTTP.delete(this.apiURL+'/datasets/'+this.currentResult.data_set.id+'/notes/'+this.note.id).then(resp => {
            console.log(resp.data)
            HTTP.get(this.apiURL+'/selectors/'+this.currentResult.selector.id+'/results/'+this.currentResult.id).then(resp =>{
                this.$store.dispatch('setCurrentResult',resp.data.result)
            })
        },(error) =>{
            this.$store.dispatch('addMessage',{flavor:'alert-red',text:error})
        })
    }
  },
  computed:{
    highlight: function(){
        if (this.hover){
            return 'background-color:#141a26;'
        }
    },
    apiURL(){
        return 'http://'+this.$store.getters.api.ip+':'+this.$store.getters.api.port+'/api'
    },
    currentResult(){
        return this.$store.getters.currentResult
    },
  }
}

</script>

<style scoped>




</style>
