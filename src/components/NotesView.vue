<template>
  <div class="pageoverlay">
    <div class="overlaybox">
      <div class="overlaytop">
        Notes for the corresponding dataset
        <i class="fas fa-times pointer" @click="closePopup"></i>
      </div>
      <div class="overlaycontent">
        <NotesRow v-for="note in currentResult.data_set.notes" v-bind:note="note" :key="note.id"></NotesRow>
      </div>
      <div class="overlayfooter">
        <button class="btn btn-small"><i class="fas fa-plus-square"></i> Add note</button>
      </div>
    </div>
  </div>
</template>

<script>
import NotesRow from '@/components/NotesRow'

export default {
  props:[''],
  data(){
      return {
        }
  },
  mounted(){
    
  },
  methods:{
    closePopup(){
      this.$emit('closeAddNote','thanks')
    }
  },
  components:{
    NotesRow
  },
  computed: {
    currentResult(){
        return this.$store.getters.currentResult
    },
  },
}
</script>

<style>


</style>
