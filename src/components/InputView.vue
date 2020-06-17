<template>
    <div class="pageoverlay">
        <div class="overlaybox">
            <div class="overlaytop">
                Input for process {{process.id}}
                <i class="fas fa-times pointer" @click="closeForm"></i>
            </div>
            <div class="overlaycontent">
                <InputRow v-for="input in inputs" v-bind:input="input" :key="input.id">
                </InputRow>
                <div class="tablerow submit">
                    <button class="btn btn-submit" @click="submitInput">Save input</button>
                </div>
            </div>
            <div class="overlayfooter">
        
            </div>
        </div>
    </div>
</template>

<script>
import {HTTP} from '../main'
import InputRow from '@/components/InputRow'

export default {
    props:['process'],
    data(){
        return {
            inputs:[]
        }
    },
    mounted(){
        HTTP.get(this.apiURL+'/processes/'+this.process.id+'/input').then(resp => {
            this.inputs = resp.data.inputs
        })
    },
    methods:{
        closeForm(){
            this.$emit('closeForm','thanks')
        },
        submitInput(){
            let formData = new FormData();
            this.inputs.forEach((input)=>{
                formData.append(input.name,input.val)
            })
            HTTP.post(this.apiURL+'/processes/'+this.process.id+'/input',formData,{
                headers: {'Content-Type':'multipart/form-data'}
            }).then(resp => {
                if (resp.data.success){
                    console.log(resp.data.msg)
                } else {
                    this.msg = resp.data.msg
                }
            },error =>{
                this.msg = error
            })
        },

    },
    components:{
        InputRow
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
