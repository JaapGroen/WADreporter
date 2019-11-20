<template>
    <div class="pageoverlay">
        <div class="overlaybox">
            <div class="overlaytop">
                <div v-if="!multiview">
                    {{item[0].test.name}} ({{item[0].result.date | isodate}})
                </div>
                <div v-if="multiview">
                    All {{thumbnails.length}} objects
                </div>
                <i class="fas fa-times pointer" @click="closePopUp"></i>
            </div>
            <div class="overlaycontent" v-if="!multiview">
                <img class="img_large" v-bind:src="'data:image/jpg;base64,'+item[0].test.value"/>
            </div>
            <div class="overlaycontent" v-if="multiview">
                <div class="thumbnails">
                    <img v-for="thumbnail in thumbnails" class="thumbnail" v-bind:src="'data:image/jpg;base64,'+thumbnail.y"/>
                </div>
            </div>
            <div class="overlayfooter">
                <button v-if="!multiview" class="smbutton" @click="history">All objects</button>
                <button v-if="multiview" class="smbutton" @click="current">Back</button>
            </div>
        </div>
    </div>
</template>

<script>
import GraphLoader from '@/functions/GraphLoader'

export default {
    props:['item'],
    data(){
        return {
            msg:'',
            loaded:false,
            componentKey: 0,
            multiview:false,
            thumbnails:[],
        }
    },
  methods:{
    closePopUp(){
      this.$emit('closePopUp','thanks')
    },
    history(){
        this.loadHistory();
        this.multiview=true;
    },
    loadHistory(){
        GraphLoader.loadGraph(
            this.$props.item[0].selector.id,
            this.$props.item[0].result.id,
            this.$props.item[0].test.id,
            this.$props.item[0].test.type
        ).then(resp => {
            this.thumbnails = resp
        })
    },
    current(){
        this.multiview=false;
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

.thumbnails{
    display:flex;
    flex-direction:row;
    flex-wrap:wrap;
}

.thumbnail{
    height:100px;
}
</style>