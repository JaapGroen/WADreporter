<template>
    <div class="tablerow" v-bind:style="highlight" @mouseover="hover = true" @mouseleave="hover = false">
        <div class="tablecell">{{note.data_tag.name}}</div>
        <div class="tablecell">{{note.description}}</div>
    </div>
</template>

<script>

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
    }
  },
  computed:{
    highlight: function(){
        if (this.hover){
            return 'background-color:#141a26;'
        }
    }
  }
}

</script>

<style>




</style>
