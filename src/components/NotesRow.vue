<template>
    <div class="tablerow" @mouseover="hover = true" @mouseleave="hover = false">
        <div class="name">{{note.data_tag.name}}</div>
        <div class="description">{{note.description}}</div>
        <div class="buttons">
            <button class="btn btn-small" @click="deleteNote()"><i class="fas fa-trash-alt"></i> Remove note</button>
        </div>
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
        },
        deleteNote(){
            this.$emit('deleteNote',this.note)
        }
    },
    computed:{
        apiURL(){
            return 'http://'+this.$store.getters.api.ip+':'+this.$store.getters.api.port+'/api'
        },
    }
}

</script>

<style scoped>
.name{
    padding-left:5px;
    padding-right:5px;
    flex:1 0 0;
}

.description{
    padding-left:5px;
    padding-right:5px;
    flex:2 0 0;
}

.buttons{
    padding-left:5px;
    padding-right:5px;
    width:190px;
}
</style>
