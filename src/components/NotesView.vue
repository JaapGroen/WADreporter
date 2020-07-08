<template>
  <div class="pageoverlay">
    <div class="overlaybox">
      <div class="overlaytop">
        Notes for the corresponding dataset
        <i class="fas fa-times pointer" @click="closePopup"></i>
      </div>
      <div class="overlaycontent">
        <NotesRow v-for="note in currentResult.data_set.notes" v-bind:note="note" :key="note.id"></NotesRow>
        <div v-if="currentResult.data_set.notes.length==0" class="tablerow">
            <div class="tablecell">
                None.
            </div>
            <div class="tablecell">
            </div>
            <div class="tablecell">
            </div>
        </div>
        <div v-if="showAddNote" class="tablerow">
            <div class="tablecell">
                <select class="selectbox" v-model="newNote.data_tag">
                    <option v-for="option in data_tags" :value="option.id">{{option.name}}</option>
                </select>
            </div>
            <div class="tablecell">
                <input class="textbox" required v-model="newNote.description" type="text" placeholder="Enter description"/>
            </div>
            <div class="tablecell">
                
            </div>
        </div>
      </div>
      <div class="overlayfooter">
        <button v-if="!showAddNote" class="btn btn-small" @click="openAddNote()"><i class="fas fa-plus-square"></i> Add note</button>
        <div v-if="showAddNote">
            <button class="btn btn-small" @click="saveAddNote()"><i class="fas fa-plus-square"></i> Save note</button>
            <button v-if="showAddNote" class="btn btn-small" @click="cancelAddNote()"><i class="fas fa-undo-alt"></i> Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NotesRow from '@/components/NotesRow'
import {HTTP} from '../main'

export default {
  props:[''],
    data(){
        return {
            showAddNote: false,
            newNote:{'data_tag':'','description':''},
            data_tags:[],
        }
  },
  mounted(){
    
  },
  methods:{
    closePopup(){
      this.$emit('closeAddNote','thanks')
    },
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
        HTTP.post(this.apiURL+'/datasets/'+this.currentResult.data_set.id+'/notes',formData,{
          headers: {'Content-Type':'multipart/form-data'}
        }).then(resp => {
            HTTP.get(this.apiURL+'/selectors/'+this.currentResult.selector.id+'/results/'+this.currentResult.id).then(resp =>{
                this.$store.dispatch('setCurrentResult',resp.data.result)
                this.newNote = {'data_tag':'','description':''}
                this.showAddNote = false
            })
            
        })
    },
    cancelAddNote(){
        this.newNote = {'data_tag':'','description':''}
        this.showAddNote = false
    },
  },
  components:{
    NotesRow
  },
  computed: {
    currentResult(){
        return this.$store.getters.currentResult
    },
    apiURL(){
        return 'http://'+this.$store.getters.api.ip+':'+this.$store.getters.api.port+'/api'
    }
  },
}
</script>

<style scoped>

</style>
