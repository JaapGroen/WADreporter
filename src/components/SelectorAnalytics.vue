<template>
  <div class="pageoverlay">
    <div class="overlaybox">
      <div class="overlaytop">
        <div v-if="analyzeResults">Analysis of the results of {{selector.name}}</div>
        <div v-if="!analyzeResults">Analysis of the tests of {{selector.name}}</div>
        <router-link :to="{name:'result',params:{id_selector:selectorresult.selector.id,id_result:selectorresult.result.id}}" class="fas fa-times pointer" tag="i"></router-link>
      </div>
      <div class="overlaycontent">
        <div class="overlaycontentsub-v" v-if="analyzeResults">
          <PieChart ref="PieChart" v-if="loaded" :chartdata="pieChartData" :options="pieChartOptions" :styles="chartStyle"></PieChart>
          <i v-if="!loaded" style="margin-top:50px;margin-bottom:50px;" class="fas fa-sun fa-2x fa-spin"></i>
        </div>
        <div class="overlaycontentsub-h" v-if="!analyzeResults">
          <BarChart ref="BarChart" v-if="loaded" :chartdata="barChartData" :options="barChartOptions" :styles="chartStyle" style="cursor:pointer;"></BarChart>
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
        <button class="btn btn-small" @click="switchType" v-if="analyzeResults"><i class="fas fa-exchange-alt"></i> Tests</button>
        <button class="btn btn-small" @click="switchType" v-if="!analyzeResults"><i class="fas fa-exchange-alt"></i> Results</button>
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
  props:[''],
  data(){
      return {
        msg:'',
        loaded:false,
        selector:{},
        componentKey: 0,
        numberOfResults:0,
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
              backgroundColor: ["#58a55c","#eab63e","#d8513f"],
              data:[]
            }
          ]
        },
        barChartData:{
            labels:[],
            datasets:[{
                label:'OK',
                backgroundColor:"#58a55c",
                data:[]
            },{
                label:'warning',
                backgroundColor:"#eab63e",
                data:[]
            },{
                label:'danger',
                backgroundColor:"#d8513f",
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
                        var label
                        if (args.value>0){
                            label = args.value
                        } else {
                            label=''
                        }
                        return label
                    },
                    fontColor:'white',
                    fontSize:12,
                    precision:2,

                }
            },
            'onClick':(point,event)=>{
                const item = event[0]
                var name = this.barChartData.labels[item._index]
                this.gotoTest(name)
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
    gotoTest(name){
        HTTP.get(this.apiURL+'/selectors/'+this.$route.params.id_selector+'/results/'+this.$route.params.id_result).then((resp)=>{
            resp.data.tests.forEach((test)=>{
                if (test.display_name == name){
                    this.$router.push({name:test.type,params:{id_test:test.id,}})
                }
            })
        })
    },
    switchType(){
      this.analyzeResults=!this.analyzeResults
    },
    reloadPieChart(){
        this.$refs.PieChart.reloadGraph();
    },
    getAllResults(){
        SelectorAnalyzer.analyzeSelector(this.$route.params.id_selector).then((data)=>{
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
        selectorresult(){
            return this.$store.getters.selectorresult
        },
        apiURL(){
            return 'http://'+this.$store.getters.api.ip+':'+this.$store.getters.api.port+'/api'
        }
    },
}
</script>

<style scoped>


</style>
