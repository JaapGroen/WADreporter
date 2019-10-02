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
        apiURL:'http://'+this.$store.getters.api.ip+':'+this.$store.getters.api.port+'/api',
        groupArray:[],
        selector:{name:'selectors',id:0}
      }
    },
	mounted(){
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
                if (this.groupObject[group].selectors.length>0){
                    this.groupArray.push(this.groupObject[group]);
                }
            }
            this.groupArray.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        }).catch(err => {console.log(err)})
    },
    components: {
        TileGroup,
        Navbar
    },
  }
</script>

<style>

</style>
