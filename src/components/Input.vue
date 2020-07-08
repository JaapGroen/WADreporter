<template>
    <div class="pageoverlay">
        <div class="overlaybox">  
            <div class="overlaytop">
                Input for process 
                <router-link to="/selectors" class="fas fa-times pointer" tag="i"></router-link>
            </div>
            <div class="overlayhead">
                <div class="name">Name</div>
                <div class="input">Input</div>
                <div class="buttons"></div>
            </div>
            <div class="overlaycontent" v-if="!loading">
                <InputRow v-for="input in inputs" v-bind:input="input" :key="input.id">
                </InputRow>
                <div class="tablerow submit">
                    <button class="btn btn-submit" @click="submitInput">Save input</button>
                </div>
            </div>
            <div class="overlayfooter">
                <div>
                    <button class="btn btn-small" @click="$router.go(-1)"><i class="fas fa-th"></i> Back</button>
                </div>
                <div></div>
                <div></div>
            </div>
        </div>      
    </div>
</template>

<script>
import {HTTP} from '../main'
import InputRow from '@/components/InputRow'

export default {
    props:[],
    data(){
        return {
            loading:true
        }
    },
    created(){
        this.getInputs()
    },
    methods:{
        getInputs(){
            HTTP.get(this.apiURL+'/processes/'+this.$route.params.id_process+'/input').then(resp => {
                this.inputs = resp.data.inputs
                this.loading = false
            })
        },
        submitInput(){
            let formData = new FormData();
            this.inputdata.data.inputs.forEach((input)=>{
                formData.append(input.name,input.val)

            })
            HTTP.post(this.apiURL+'/processes/'+this.inputdata.data.process.id+'/input',formData,{
                headers: {'Content-Type':'multipart/form-data'}
            }).then(resp => {
                if (resp.data.success){
                    this.$store.dispatch('addMessage',{flavor:'alert-green',text:resp.data.msg})
                } else {
                    this.$store.dispatch('addMessage',{flavor:'alert-red',text:resp.data.msg})
                }
            },error =>{
                this.$store.dispatch('addMessage',{flavor:'alert-red',text:error})
            })
        },       
    },
    components:{
        InputRow,
    },
    computed:{
        apiURL(){
            return 'http://'+this.$store.getters.api.ip+':'+this.$store.getters.api.port+'/api'
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

.input{
    padding-left:5px;
    padding-right:5px;
    flex:1 0 0;
}

.desc{
    padding-left:5px;
    padding-right:5px;
    width:1 0 0;
}


.buttons{
    padding-left:5px;
    padding-right:20px;
    width:80px;
}

.submit{
    display:flex;
    justify-content:center;
    padding-top:10px;
    padding-bottom:10px;
}
</style>


