<template>
  <div class="pageoverlay">
    <div class="overlaybox">
      <div class="overlaytop">
        <div v-if="analyzeResults">Analysis of the results of {{selector.name}}</div>
        <div v-if="!analyzeResults">Analysis of the tests of {{selector.name}}</div>
        <i class="fas fa-times pointer" @click="closePopup"></i>
      </div>
      <div class="overlaycontent">
        <div class="overlaycontentsub">
          <PieChart ref="PieChart" v-if="loaded" :chartdata="chartData" :options="chartOptions" :styles="chartStyle"></PieChart>
          <i v-if="!loaded" style="margin-top:50px;margin-bottom:50px;" class="fas fa-sun fa-2x fa-spin"></i>
        </div>
        <div class="overlaycontentsub" v-if="analyzeResults">
          <div v-if="loaded">{{Analytics.numberOfResults}} results</div>
          <div v-if="!loaded">Running analytics...</div>
        </div>
        <div class="overlaycontentsub" v-if="!analyzeResults">
          <div v-if="loaded">
          {{Analytics.numberOfTests}} tests
          <br>
          {{Analytics.numberOfTests/Analytics.numberOfResults}} tests per result
          <br>
          {{Analytics.worstTest}}
          </div>
          <div v-if="!loaded">Running analytics...</div>
        </div>
      </div>
      <div class="overlayfooter">
        <button class="smbutton" @click="switchType" v-if="analyzeResults">Results <i class="fas fa-arrow-right"></i> Tests</button>
        <button class="smbutton" @click="switchType" v-if="!analyzeResults">Tests <i class="fas fa-arrow-right"></i> Results</button>
      </div>
    </div>
  </div>
</template>

<script>
import {HTTP} from '@/main'
import PieChart from '@/functions/PieChart'
import SelectorAnalyzer from '@/functions/SelectorAnalyzer'

export default {
  props:['selector'],
  data(){
      return {
        msg:'',
        loaded:false,
        componentKey: 0,
        numberOfResults:0,
        apiURL:'http://'+this.$store.getters.api.ip+':'+this.$store.getters.api.port+'/api',
        chartOptions:{
            hoverBorderWidth: 20,
            plugins:{
                labels:{
                    render:function(args){
                        return 'N = '+args.value+'\n ('+args.percentage+'%)'
                    },
                    fontColor:'white',
                    fontSize:20,
                    precision:2,
                }
            }
        },
        chartData:{
          labels:["OK","warning","danger"],
          datasets:[
            {
              label: "Results",
              backgroundColor: ["#75EB27","#FF8820","#EE1947"],
              data:[]
            }
          ]
        },
        Analytics:{},
        analyzeResults:true
      }
  },
  mounted(){
    this.getAllResults()
  },
  methods:{
    closePopup(){
      this.$emit('closeAnalytics','thanks')
    },
    switchType(){
      this.analyzeResults=!this.analyzeResults
      if(this.analyzeResults){
          this.chartData.datasets[0].data=this.Analytics.dataResults
      } else {
          this.chartData.datasets[0].data=this.Analytics.dataResults
      }
      this.reloadPieChart()
    },
    forceRerender(){
      this.componentKey += 1;
    },
    reloadPieChart(){
        this.$refs.PieChart.reloadGraph();
    },
    getAllResults(){
        SelectorAnalyzer.analyzeSelector(this.selector.id).then((data)=>{
            this.Analytics=data
            this.chartData.datasets[0].data=this.Analytics.dataResults
            this.loaded=true
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
