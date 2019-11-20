<template>
  <div class="pageoverlay">
    <div class="overlaybox">
      <div class="overlaytop">
        {{item[0].test.display_name || item[0].test.name}}
        <i class="fas fa-times pointer" @click="closePopUp"></i>
      </div>
      <div class="tablehead"> 
        <div class="tableheader">Date</div>
        <div class="tableheader">
          <input style="height:20px;" type="text" class="textbox" v-model="valueFilter" placeholder="Value..."/>
        </div>
        <div class="tableheader">Limit</div> 
      </div>
      <div class="overlaycontent">
        <TableRow v-if="loaded" v-for="test in filteredHistoricData" v-bind:test="test" :key="test.id"></TableRow>
        <i v-if="!loaded" class="fas fa-sun fa-2x fa-spin"></i>
      </div>
      <div class="overlayfooter">
        <button @click="csvExport()" class="smbutton" v-if="loaded"><i class="fas fa-download"></i> Export</button>
      </div>
    </div>
  </div>
</template>

<script>
import TableRow from '@/components/TableRow'
import GraphLoader from '@/functions/GraphLoader'

export default {
  props:['item'],
  data(){
      return {
        msg:'',
        loaded:false,
        componentKey: 0,
        historicData:[],
        limit:'',
        valueFilter:'',
      }
  },
  methods:{
    closePopUp(){
      this.$emit('closePopUp','thanks')
    },
    forceRerender(){
      this.componentKey += 1;
    },
    csvExport(arr) {     
      let csvContent = "data:text/csv;charset=utf-8,";
      var str=""
      str+="Date;"+String(this.item[0].test.display_name || this.item[0].test.name)+"\r\n"
      
      console.log(this.item[0].selector.name)
      
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
    GraphLoader.loadGraph(
      this.$props.item[0].selector.id,
      this.$props.item[0].result.id,
      this.$props.item[0].test.id,
      this.$props.item[0].test.type
    ).then(resp => {
        this.historicData=resp
        GraphLoader.loadLimits(this.$props.item[0].selector.id,this.$props.item[0].result.id,this.$props.item[0].test.id,this.$props.item[0].test.type).then(resp => {
            this.historicData.forEach(test => {
                test.limit=resp
            })
            this.loaded = true;
        })
    })
  },
  components:{
      TableRow,
      GraphLoader,
  },
  computed:{
      filteredHistoricData(){
        const filterValue=this.valueFilter.toLowerCase()
        return this.historicData.filter(function(el){
          return el.y.toLowerCase().includes(filterValue)
        })
      }
    },
}

</script>

<style>
.overlaybox{
  display:flex;
  flex-direction:column;
  height:70%;
  width:70%;
  box-sizing: border-box;
  align-items:center;
  justify-content:center;
}
.tablehead{
  display:flex;
  flex-direction:row;
  width:100%;
  justify-content:space-around;
  background:#444444;
}

.tableheader{
  width:33%;
  padding-left:10px;
}

.textbox{
  border:none;
  background-color:#444444;
  width:100%;
  height:30px;
  border-bottom:3px solid #0FAAEA;
  color:white;
  font-family: 'Roboto', sans-serif;
  border-radius: 5px;
}
</style>