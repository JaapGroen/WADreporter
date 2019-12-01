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
            <div class="overlaycontent" v-if="thumbs_loading">
                <i class="fas fa-sun fa-2x fa-spin"></i>
            </div>
            <div class="overlaycontent" v-if="multiview && !thumbs_loading">
                <div class="thumbnails">                
                    <div v-for="thumbnail in thumbnails" class="thumbnailblock" @click="change_result(thumbnail.result.id, thumbnail.test.name)">
                        <img class="thumbnail" v-bind:src="'data:image/jpg;base64,'+thumbnail.y"/>
                        {{thumbnail.x | isodate}}
                    </div>
                </div>
            </div>
            <div class="overlayfooter">
                <button v-if="!multiview" class="btn btn-small" @click="history">History</button>
                <button v-if="multiview" class="btn btn-small" @click="current">Back</button>
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
            thumbs_loading:false
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
        this.thumbs_loading=true
        GraphLoader.loadGraph(
            this.$props.item[0].selector.id,
            this.$props.item[0].result.id,
            this.$props.item[0].test.id,
            this.$props.item[0].test.type
        ).then(resp => {
            this.thumbnails = resp
            this.thumbs_loading = false
        })
    },
    current(){
        this.multiview=false;
    },
    forceRerender(){
      this.componentKey += 1;
    },
    change_result(id,name){
        this.$router.push({name:'Tests',params:{idSelector:this.item[0].selector.id,idResult:id},query:{popup:name}})
    },
  },
  filters:{
    isodate: timestamp =>{
        let d = new Date(timestamp);
        return d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear()
    },
  },
}

</script>

<style>

</style>
