<template>
    <div>
        <Navbar v-bind:selector="selector"></Navbar>
        <div v-if="loaded" class="grid">
            <TileGroup v-for="group in groupArray" v-bind:group="group" :key="group.name" v-if="group.selectors.length>0"></TileGroup>
        </div>
    </div>
</template>

<script>
import TileGroup from '@/components/TileGroup'
import {HTTP} from '../main';
import Navbar from '@/components/Navbar'

export default {
    data(){
        return {
            selectors:this.$store.getters.selectors,
            groupObject:{'[no group]':{name:'[no group]',selectors:[]}},
            loaded:false,
            groupArray:[],
            selector:{name:'selectors',id:0}
        }
    },
    computed:{
        apiURL(){
            return 'http://'+this.$store.getters.api.ip+':'+this.$store.getters.api.port+'/api'
        }
    },
    mounted(){
        this.setCurrentResult()
        this.$store.dispatch('addMessage',{flavor:'alert-blue',text:'Test-blue and it should be pretty long so we can see what happend when it is very long!'})
        HTTP.get(this.apiURL+'/selectors').then(resp => {
            this.loaded=true;
            for (let i=0;i<resp.data.selectors.length;i++){
                if(resp.data.selectors[i].description.includes("[") && resp.data.selectors[i].description.includes("]")){
                    var groupname = resp.data.selectors[i].description.substring(resp.data.selectors[i].description.indexOf("["),resp.data.selectors[i].description.indexOf("]")+1)
                    resp.data.selectors[i].description = resp.data.selectors[i].description.replace(groupname,'')
                } else {
                    var groupname="[no group]"
                }
                if (!!this.groupObject[groupname]){
                    this.groupObject[groupname].selectors.push(resp.data.selectors[i])
                } else {
                    this.groupObject[groupname]={}
                    this.groupObject[groupname].selectors=[resp.data.selectors[i]]
                    this.groupObject[groupname].name=groupname;
                }
            }
            for (var group in this.groupObject){
                if (this.groupObject[group].selectors.length>0 && group!='[hide]'){
                    this.groupArray.push(this.groupObject[group]);
                }
            }
            this.groupArray.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        }).catch(error => {
            this.$store.dispatch('addMessage',{flavor:'alert-red',text:error})
        })
    },
    components: {
        TileGroup,
        Navbar
    },
    methods:{
        setCurrentResult(){
            this.$store.dispatch('setCurrentResult',{})
        }
    }
}
</script>

<style>

</style>
