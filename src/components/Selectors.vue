<template>
    <div v-if="!loading" class="selectorgroups">
        <SelectorsGroup v-for="group in orderedGroups" v-bind:group="group" :key="group.name"></SelectorsGroup>
    </div>
</template>

<script>
import SelectorsGroup from '@/components/SelectorsGroup'
import _ from 'lodash'

export default {
    data(){
        return {
            // selectors:[],
            loading: true,
        }
    },
    methods:{
        getSelectors(){
            this.$store.commit('setSelectorResult',{})
            if (this.selectors.length==0){
                this.$store.dispatch('getSelectors').then(()=>{
                    this.loading = false
                })
            } else {
                this.loading = false
            }
        }
    },
    mounted(){
        this.getSelectors()
    },
    components: {
        SelectorsGroup,
    },
    computed:{
        apiURL(){
            return 'http://'+this.$store.getters.api.ip+':'+this.$store.getters.api.port+'/api'
        },
        selectors(){
            return this.$store.getters.selectors
        },
        groupedSelectors(){
            if(!this.loading){
                var groups = []
                if (!this.loading){
                    this.selectors.forEach((selector)=>{
                        var groupname = "[no group]"
                        if (selector.description.includes('[') && selector.description.includes(']')){
                            groupname = selector.description.substring(selector.description.indexOf("["),selector.description.indexOf("]")+1)
                        }
                        var group = groups.filter(group => group.name === groupname)
                        if (group.length==0){
                            groups.push({name:groupname,selectors:[selector]})
                        } else {
                            group[0].selectors.push(selector)
                        }
                    })
                }
                return groups
            } else {
                return []
            }
        },
        orderedGroups(){
            return _.orderBy(this.groupedSelectors, 'name','asc')
        },

    },
    
}
</script>

<style scoped>
.selectorgroups{
  display:flex;
  flex-direction:column;

  top:100px;
  height:calc(100% - 100px);
  overflow: auto;
  position:fixed;
  width:100%;
}
</style>
