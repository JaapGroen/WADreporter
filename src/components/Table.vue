<template>
  <div class="pageoverlay">
    <div class="overlaybox">
      <div class="overlaytop">
        {{test.display_name || test.name}}
        <router-link :to="{name:'result',params:$route.params}" class="fas fa-times pointer" tag="i"></router-link>
      </div>
      <div class="overlayhead"> 
        <div class="date">Date</div>
        <div class="value">
          <input style="height:20px;" type="text" class="textbox" v-model="filter" placeholder="Value..."/>
        </div>
        <div class="limit">Limit</div> 
      </div>
      <div class="overlaycontent">
        <i v-if="loading" class="fas fa-sun fa-2x fa-spin"></i>
        <TableRow v-else v-for="resulttest in filteredHistoricData" v-bind:resulttest="resulttest" :key="resulttest.result.id"></TableRow>
      </div>
      <div class="overlayfooter">
        <button @click="csvExport()" class="btn btn-small" v-if="!loading"><i class="fas fa-download"></i> Export</button>
      </div>
    </div>
  </div>
</template>

<script>
import TableRow from '@/components/TableRow'
import {HTTP} from '../main'

export default {
    data(){
        return {
            historicData:[],
            limit:'',
            filter:'',
            test:{},
            id_selector:this.$route.params.id_selector,
            id_result:this.$route.params.id_result,
            id_test:this.$route.params.id_test,
            loading:true
        }
    },
    methods:{
        loadData(){
            HTTP.get(this.apiURL+'/selectors/'+this.id_selector+'/results/'+this.id_result+'/tests/'+this.id_test+'/string/history').then((resp)=>{
                this.test = resp.data.history[0].test
                this.historicData = resp.data.history
                this.loading = false
            })
        },
        csvExport() {     
            let csvContent = "data:text/csv;charset=utf-8,";
            var str=""
            str+="Date;"+String(this.item[0].test.display_name || this.item[0].test.name)+"\r\n"
            for(let i=0;i<this.historicData.length;i++){
                let d = new Date(this.historicData[i].x);         
                str+=String(d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear())
                str+=";";
                str+=String(this.historicData[i].y)
                str+="\r\n";
            }
            csvContent +=str;   
            const data = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", data);
            link.setAttribute("download", String(this.item[0].selector.name)+" - "+String(this.item[0].test.display_name || this.item[0].test.name)+".csv");
            link.click();
        },
    },
    created(){
        this.loadData()
  },
  components:{
      TableRow,
  },
    computed:{
        filteredHistoricData(){
            if (!this.loading){
            // return this.historicData
                return this.historicData.filter((item)=>{
                    return item.test.value.toLowerCase().includes(this.filter.toLowerCase())
                })
            } else {
                return []
            }
        },
        closelink(){
            return '/selectors/'+this.id_selector+'/results/'+this.id_result
        },
        apiURL(){
            return 'http://'+this.$store.getters.api.ip+':'+this.$store.getters.api.port+'/api'
        },
    },
}

</script>

<style scoped>
.date{
    padding-left:5px;
    padding-right:5px;
    flex:1 0 0;
}

.value{
    padding-left:5px;
    padding-right:5px;
    flex:1 0 0;
}

.limit{
    padding-left:5px;
    padding-right:5px;
    flex:1 0 0;
}

::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: white;
  opacity: 1; /* Firefox */
}
</style>
