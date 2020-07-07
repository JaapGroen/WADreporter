<template>
    <div class="pageoverlay">
        <div class="overlaybox">
            <div class="overlaytop">
                <div v-if="multiview">
                    All {{thumbnails.length}} objects
                </div>
                <div v-else>
                    {{test.name}} ({{result.date | isodate}})
                </div>
                <router-link :to="{name:'result',params:$route.params}" class="fas fa-times pointer" tag="i"></router-link>
            </div>
            <div class="overlaycontent" v-if="!multiview && !loading">
                <img class="img_large" v-bind:src="'data:image/jpg;base64,'+test.value"/>
            </div>
            <div class="overlaycontent" v-if="thumbs_loading">
                <i class="fas fa-sun fa-2x fa-spin"></i>
            </div>
            <div class="overlaycontent" v-if="multiview && !thumbs_loading">
                <div class="thumbnails">                
                    <div v-for="thumbnail in thumbnails" class="thumbnailblock" @click="change_result(thumbnail)" :key="thumbnail.id">
                        <img class="thumbnail" v-bind:src="'data:image/jpg;base64,'+thumbnail.y"/>
                        {{thumbnail.x | isodate}}
                    </div>
                </div>
            </div>
            <div class="overlayfooter">
                <button v-if="!multiview" class="btn btn-small" @click="history"><i class="far fa-clock"></i> History</button>
                <button v-if="multiview" class="btn btn-small" @click="current"><i class="fas fa-chevron-left"></i> Back</button>
            </div>
        </div>
    </div>
</template>

<script>
import DataLoader from '@/functions/DataLoader'
import {HTTP} from '@/main'

export default {
    data(){
        return {
            msg:'',
            loaded:false,
            loading:true,
            componentKey: 0,
            multiview:false,
            thumbnails:[],
            thumbs_loading:false,
            test:{},
            result:{},
        }
    },
    mounted(){
        this.loadData()
    },
    methods:{
        loadData(){
            HTTP.get(this.apiURL+'/selectors/'+this.$route.params.id_selector+'/results/'+this.$route.params.id_result+'/tests/'+this.$route.params.id_test+'/object').then((resp)=>{
                this.test = resp.data.test
                this.result = resp.data.result
                this.loading = false
            })
        },
        history(){
            this.loadHistory();
            this.multiview=true;
        },
        loadHistory(){
            this.thumbs_loading=true
            DataLoader.loadGraph(
                this.$route.params.id_selector,
                this.$route.params.id_result,
                this.$route.params.id_test,
                'object'
            ).then(resp => {
                this.thumbnails = resp
                this.thumbs_loading = false
            })
        },
        current(){
            this.multiview=false;
        },
        change_result(thumbnail){
            this.$router.push({
                name:'object',
                params:{
                    id_selector:thumbnail.selector.id,
                    id_result:thumbnail.result.id,
                    id_test:thumbnail.test.id
                }
            })
        },
    },
    filters:{
        isodate: timestamp =>{
            let d = new Date(timestamp);
            return d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear()
        },
    },
    computed:{
        apiURL(){
            return 'http://'+this.$store.getters.api.ip+':'+this.$store.getters.api.port+'/api'
        },
    }
}

</script>

<style scoped>
.img_large{
  height:100%;
}

.thumbnails{
    display:flex;
    flex-direction:row;
    flex-wrap:wrap;
}

.thumbnailblock{
    display:flex;
    flex-direction:column;
    margin:5px;
    cursor: pointer;
}

.thumbnailblock:hover {
    background-color:#141a26;
}

.thumbnail{
    height:100px;
}
</style>
