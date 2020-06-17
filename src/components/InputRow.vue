<template>
  <div class="tablerow">
    <div class="name">
        {{input.name}}
        <span v-if="input.required">*</span>
    </div>
    <div class="input">
        <input type="text" class="textbox" v-model=input.val @change="setDirty()">
    </div>
    <div class="buttons">
    </div>
  </div>
</template>

<script>
import {HTTP} from '@/main'

export default {
    
  props:['input'],
  data(){
      return {
        dirty:false
      }
  },
  methods:{
    setDirty(){
        this.dirty=true;
    },
  },
    computed:{
        apiURL(){
            return 'http://'+this.$store.getters.api.ip+':'+this.$store.getters.api.port+'/api'
        }
    }
}

</script>

<style scoped>
.name{
    padding-left:5px;
    padding-right:5px;
    flex:1 0 0;
}

.input{
    padding-left:5px;
    padding-right:5px;
    flex:1 0 0;
}

.desc{
    padding-left:5px;
    padding-right:5px;
    width:1 0 0;
}


.buttons{
    padding-left:5px;
    padding-right:5px;
    width:80px;
}
</style>