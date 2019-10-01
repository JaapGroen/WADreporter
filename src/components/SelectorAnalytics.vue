<template>
  <div class="pageoverlay">
    <div class="overlaybox">
      <div class="overlaytop">
        {{selector.name}}
        <i class="fas fa-times pointer" @click="closePopup"></i>
      </div>
      <div class="overlaycontent">
        <div class="overlaycontentsub">
          <PieChart v-if="loaded" :chartdata="chartDataResults" :options="chartOptions" :styles="chartStyle"></PieChart>
          <div v-if="loaded">{{chartDataResults.datasets[0].data.reduce((a, b) => a + b, 0)}} results</div>
          <i v-if="!loaded" style="margin-top:50px;margin-bottom:50px;" class="fas fa-sun fa-2x fa-spin"></i>
        </div>
        <div class="overlaycontentsub">
          <PieChart v-if="loaded" :chartdata="chartDataTests" :options="chartOptions" :styles="chartStyle"></PieChart>
          <div v-if="loaded">{{chartDataTests.datasets[0].data.reduce((a, b) => a + b, 0)}} tests, worst test: {{worstTest[1]}}x {{worstTest[0]}}</div>
          <i v-if="!loaded" style="margin-top:50px;margin-bottom:50px;" class="fas fa-sun fa-2x fa-spin"></i>
        </div>
      </div>
      <div class="overlayfooter">
      </div>
    </div>
  </div>
</template>

<script>
import {HTTP} from '@/main'
import PieChart from '@/functions/PieChart'

export default {
  props:['selector'],
  data(){
      return {
        msg:'',
        loaded:false,
        componentKey: 0,
        numberOfResults:0,
        apiURL:'http://'+this.$store.getters.api.ip+':'+this.$store.getters.api.port+'/api',
        chartOptions:{hoverBorderWidth: 20},
        chartDataResults:{
          labels:["OK","warning","danger"],
          datasets:[
            {
              label: "Results",
              backgroundColor: ["#75EB27","#FF8820","#EE1947"],
              data:[0,0,0]
            }
          ]
        },
        chartDataTests:{
          labels:["OK","warning","danger"],
          datasets:[
            {
              label: "Tests",
              backgroundColor: ["#75EB27","#FF8820","#EE1947"],
              data:[0,0,0]
            }
          ]
        },
        worstTest:'',
      }
  },
  mounted(){
    this.getAllResults()
  },
  methods:{
    closePopup(){
      this.$emit('closePopup','thanks')
    },
    forceRerender(){
      this.componentKey += 1;
    },
    getAllResults(){
      var loading_data=[]
      var worstTest={}
      HTTP.get(this.apiURL+'/selectors/'+this.selector.id+'/results')
        .then((resp)=>{
        this.numberOfResults=resp.data.results.length
        for (let i=0;i<resp.data.results.length;i++){
          loading_data.push(HTTP.get(this.apiURL+'/selectors/'+this.selector.id+'/results/'+resp.data.results[i].id))
        }
        Promise.all(loading_data).then((loaded_data)=>{
          for (let i=0;i<loaded_data.length;i++){
            if(loaded_data[i].data.result.status.tests==1){
              this.chartDataResults.datasets[0].data[0]++
            } else if (loaded_data[i].data.result.status.tests==2){
              this.chartDataResults.datasets[0].data[1]++
            } else if (loaded_data[i].data.result.status.tests==3){
              this.chartDataResults.datasets[0].data[2]++
            }
            for (let j=0;j<loaded_data[i].data.tests.length;j++){
              if(loaded_data[i].data.tests[j].type=='float' || loaded_data[i].data.tests[j].type=='string'){
                if(loaded_data[i].data.tests[j].status==1){
                  this.chartDataTests.datasets[0].data[0]++
                } else if (loaded_data[i].data.tests[j].status==2){
                  this.chartDataTests.datasets[0].data[1]++
                } else if (loaded_data[i].data.tests[j].status==3){
                   this.chartDataTests.datasets[0].data[2]++
                   if (worstTest.hasOwnProperty(loaded_data[i].data.tests[j].display_name)){
                     worstTest[loaded_data[i].data.tests[j].display_name]++
                   } else {
                     worstTest[loaded_data[i].data.tests[j].display_name]=1
                   }
                }
              }
            }
          }
          var sortedTests=[]
          for (var test in worstTest){
            sortedTests.push([test,worstTest[test]])
          }
          sortedTests.sort((a,b)=>{return a[1]-b[1]})
          this.worstTest=sortedTests[sortedTests.length-1]
          this.loaded=true
        })  
      })
    },
  },
  components:{
    PieChart
  },
  computed: {
    chartStyle(){
      return {
        height:'100%',
        position: 'relative'
      }
    },
  },
}
</script>

<style>
.overlaycontentsub{
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:space-around;
  height:100%;
  width:50%;
}


</style>
