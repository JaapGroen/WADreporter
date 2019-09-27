<template>
  <div class="pageoverlay">
    <div class="overlaybox">
      <div class="overlaytop">
        <div>
          {{item[0].test.name}} ({{item[0].result.date | isodate}})
        </div>
        <i class="fas fa-times pointer" @click="closeImage"></i>
      </div>
      <div class="overlaycontent">
        <img class="img_large" v-bind:src="'data:image/jpg;base64,'+item[0].test.value"/>
      </div>
      <div class="overlayfooter">
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props:['item'],
  data(){
      return {
        msg:'',
        loaded:false,
 //       item:'',
        componentKey: 0,
      }
  },
  methods:{
    closeImage(){
      this.$emit('closeImage','thanks')
    },
    forceRerender(){
      this.componentKey += 1;
    },
  },
  filters:{
    isodate: timestamp =>{
        let d = new Date(timestamp);
        return d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear()
    },
  }
}

</script>

<style>
.overlaybox{
  display:flex;
  flex-direction:column;
  height:70%;
  width:70%;
  box-sizing: border-box;
  align-items:center;
  justify-content:center;
}

.img_large{
  height:100%;
}
</style>