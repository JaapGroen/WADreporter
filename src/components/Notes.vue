<template>
    <div class="pageoverlay">
        <div class="overlaybox" v-if="!loading">
            <div class="overlaytop">
                Notes for dataset {{dataset.id}}
                <router-link :to="{name:'result',params:{id_selector:selectorresult.selector.id,id_result:selectorresult.result.id}}" class="fas fa-times pointer" tag="i"></router-link>
            </div>
            <div class="overlaycontent">
                <div class="overlayhead">
                    <div class="name">Type</div>
                    <div class="description">Description</div>
                    <div class="buttons"></div>
                </div>
                <NotesRow v-for="note in dataset.notes" v-bind:note="note" :key="note.id" v-on:deleteNote="deleteNote"></NotesRow>
                <div v-if="dataset.notes.length==0" class="tablerow">
                    <div class="name">
                        None.
                    </div>
                    <div class="description"></div>
                    <div class="buttons"></div>
                </div>
                <div v-if="showAddNote" class="tablerow">
                    <div class="name">
                        <select class="selectbox" v-model="newNote.data_tag">
                            <option v-for="option in data_tags" :value="option.id">{{option.name}}</option>
                        </select>
                    </div>
                    <div class="description">
                        <input class="textbox" required v-model="newNote.description" type="text" placeholder="Enter description"/>
                    </div>
                    <div class="buttons">
                        <button class="btn btn-small" @click="saveAddNote()"><i class="fas fa-plus-square"></i> Save note</button>
                        <button v-if="showAddNote" class="btn btn-small" @click="cancelAddNote()"><i class="fas fa-undo-alt"></i> Cancel</button>
                    </div>
                </div>
            </div>
            <div class="overlayfooter">
                <div>
                    <router-link to="/datasets" class="btn btn-small" tag="button"><i class="fas fa-list"></i> Datasets</router-link>
                </div>
                <div></div>
                <div>
                    <button v-if="!showAddNote" class="btn btn-small" @click="openAddNote()"><i class="fas fa-plus-square"></i> Add note</button>
                </div>       
            </div>
        </div>
    </div>
</template>

<script>
import NotesRow from '@/components/NotesRow'
import {HTTP} from '../main'

export default {
    data(){
        return {
            showAddNote: false,
            newNote:{'data_tag':'','description':''},
            dataset:{},
            loading:true
        }
    },
    mounted(){
        this.updateNotes()
    },
    methods:{
        openAddNote(){
            HTTP.get(this.apiURL+'/datatags').then(resp => {
                if (resp.data.success){
                    this.data_tags = resp.data.datatags
                    this.showAddNote = true
                } else {
                    this.$store.dispatch('addMessage',{flavor:'alert-red',text:resp.data.msg})
                }
            },(error)=>{
                this.$store.dispatch('addMessage',{flavor:'alert-red',text:error})
            })
        },
        saveAddNote(){
            let formData = new FormData();
            formData.append('data_tag',this.newNote.data_tag)
            formData.append('description',this.newNote.description)
            HTTP.post(this.apiURL+'/datasets/'+this.dataset.id+'/notes',formData,{
              headers: {'Content-Type':'multipart/form-data'}
            }).then(resp => {
                    this.newNote = {'data_tag':'','description':''}
                    this.showAddNote = false
                    this.updateNotes()
            })
        },
        cancelAddNote(){
            this.newNote = {'data_tag':'','description':''}
            this.showAddNote = false
        },
        updateNotes(){
            HTTP.get(this.apiURL+'/datasets/'+this.$route.params.id).then(resp => {
                this.dataset = resp.data.dataset
                this.loading = false
            })
        },
        deleteNote(note){
            HTTP.delete(this.apiURL+'/datasets/'+this.dataset.id+'/notes/'+note.id).then(resp => {
                this.updateNotes()
            })
        }
    },
    components:{
        NotesRow
    },
    computed: {
        apiURL(){
            return 'http://'+this.$store.getters.api.ip+':'+this.$store.getters.api.port+'/api'
        },
        selectorresult(){
            return this.$store.getters.selectorresult
        }
    },
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
