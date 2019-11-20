<template>
  <div class="pageoverlay">
    <div class="overlaybox">
      <div class="overlaytop">
        <div v-if="analyzeResults">Analysis of the results of {{selector.name}}</div>
        <div v-if="!analyzeResults">Analysis of the tests of {{selector.name}}</div>
        <i class="fas fa-times pointer" @click="closePopup"></i>
      </div>
      <div class="overlaycontent">
        <div class="overlaycontentsub-v" v-if="analyzeResults">
          <PieChart ref="PieChart" v-if="loaded" :chartdata="pieChartData" :options="pieChartOptions" :styles="chartStyle"></PieChart>
          <i v-if="!loaded" style="margin-top:50px;margin-bottom:50px;" class="fas fa-sun fa-2x fa-spin"></i>
        </div>
        <div class="overlaycontentsub-h" v-if="!analyzeResults">
          <BarChart ref="BarChart" v-if="loaded" :chartdata="barChartData" :options="barChartOptions" :styles="chartStyle"></BarChart>
          <i v-if="!loaded" style="margin-top:50px;margin-bottom:50px;" class="fas fa-sun fa-2x fa-spin"></i>
        </div>
        <div class="overlaycontentsub-v" v-if="analyzeResults">
          <div v-if="loaded">Total number of results: {{Analytics.numberOfResults}}</div>
          <div v-if="!loaded">Running analytics...</div>
        </div>
        
        <div class="overlaycontentsub-h" v-if="!analyzeResults">
          <div v-if="loaded">
          Total number of tests: {{Analytics.numberOfTests}}
          <br>
          Averaged number of tests per result: {{Analytics.numberOfTests/Analytics.numberOfResults}}
          </div>
          <div v-if="!loaded">Running analytics...</div>
        </div>
        
      </div>
      <div class="overlayfooter">
        <button class="smbutton" @click="switchType" v-if="analyzeResults"><i class="fas fa-exchange-alt"></i> Tests</button>
        <button class="smbutton" @click="switchType" v-if="!analyzeResults"><i class="fas fa-exchange-alt"></i> Results</button>
      </div>
    </div>
  </div>
</template>

<script>
import {HTTP} from '@/main'
import PieChart from '@/functions/PieChart'
import BarChart from '@/functions/BarChart'
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
        pieChartOptions:{
            hoverBorderWidth: 20,
            maintainAspectRatio:false,
            legend:{
                position:'left',
            },
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
        pieChartData:{
          labels:["OK","warning","danger"],
          datasets:[
            {
              label: "Results",
              backgroundColor: ["#75EB27","#FF8820","#EE1947"],
              data:[]
            }
          ]
        },
        barChartData:{
            labels:[],
            datasets:[{
                label:'OK',
                backgroundColor:"#75EB27",
                data:[]
            },{
                label:'warning',
                backgroundColor:"#FF8820",
                data:[]
            },{
                label:'danger',
                backgroundColor:"#EE1947",
                data:[]
            }]
        },
        barChartOptions:{
            maintainAspectRatio:false,
            legend:{
                position:'top',
                labels:{
                    padding: 25,
                },
            },
            scales:{
                xAxes:[{
                    stacked:true,
                    display:false,
                }],
                yAxes:[{stacked:true,}],
            },
            plugins:{
                labels:{
                    render:function(args){
                        if (args.value>0){
                            var label = args.value
                        } else {
                            var label=''
                        }
                        return label
                    },
                    fontColor:'white',
                    fontSize:12,
                    precision:2,

                }
            }
        },
        Analytics:{},
        analyzeResults:true,
      }
  },
  mounted(){
    this.getAllResults();
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
            this.pieChartData.datasets[0].data=this.Analytics.dataResults
            
            for (var t in this.Analytics.dataTests){
                this.barChartData.labels.push(t)
                this.barChartData.datasets[0].data.push(this.Analytics.dataTests[t][0])
                this.barChartData.datasets[1].data.push(this.Analytics.dataTests[t][1])
                this.barChartData.datasets[2].data.push(this.Analytics.dataTests[t][2])
            }
            this.loaded=true
        })
    },
  },
  components:{
    PieChart,
    BarChart
  },
  computed: {
    chartStyle(){
      return {
        height:'100%',
        width:'100%',
        position: 'relative'
      }
    },
  },
}
</script>

<style>
.overlaycontentsub-v{
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:space-around;
  height:100%;
  width:50%;
}

.overlaycontentsub-h{
  display:flex;
  flex-direction:row;
  align-items:center;
  justify-content:space-around;
  height:50%;
  min-height:250px;
  width:100%;
}

</style>
