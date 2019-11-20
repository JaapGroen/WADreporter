<template>
  <div class="pageoverlay">
    <div class="overlaybox">
      <div class="overlaytop">
        <div>
          <span v-for="(item,index) in items">
            <span v-if="index!=0">vs</span>
            {{item.test.display_name || item.test.name}}
          </span>
        </div>
        <i class="fas fa-times pointer" @click="closePopUp"></i>
      </div>
      <div class="overlaycontent">
        <line-chart ref="LineChart" v-if="loaded" :chartdata="chartData" :options="chartOptions" :styles="chartStyle"/>
        <i v-if="!loaded" style="margin-top:50px;margin-bottom:50px;" class="fas fa-sun fa-2x fa-spin"></i>
      </div>
      <div class="overlayfooter">
        <div>
          <button @click="csvExport()" class="smbutton" v-if="loaded"><i class="fas fa-download"></i> Export</button>
          <button @click="resetZoom()" class="smbutton" v-if="loaded"><i class="fas fa-search-minus"></i> Reset</button>
          <button @click="updateGraph()" class="smbutton" v-if="loaded"><i class="fas fa-sync"></i> Reload</button>
        </div>
        <div>
          <span v-if="selected_selector.name!='Choose a selector'">{{selected_selector.name}} | </span>
          <select v-if="ddSel" class="date_select" @change="change_selector(selected_selector)" v-model="selected_selector">
            <option v-for="selector in allselectors" v-bind:value="selector">{{selector.name}}</option>
          </select>
          <select v-if="ddTest" class="date_select" @change="change_test(selected_test)" v-model="selected_test">
            <option v-for="item in alltests" v-bind:value="item">{{item.test.display_name || item.test.name}}</option>
          </select>
          <select v-if="ddItems" class="date_select" @change="change_item(selected_item)" v-model="selected_item">
            <option v-for="item in items" v-bind:value="item">{{item.selector.name}} | {{item.test.display_name || item.test.name}}</option>
          </select>
          <button @click="showAdd" class="smbutton" v-if="btnAdd"><i class="fas fa-plus-square"></i> Add</button>
          <button @click="showRemove" class="smbutton" v-if="(items.length>1) && btnRemove"><i class="fas fa-minus-square"></i> Remove</button>
          <button @click="addResult" class="smbutton" v-if="btnGo"><i class="fas fa-plus-square"></i> Add test</button>
          <button @click="doRemove" class="smbutton" v-if="btnGo2"><i class="fas fa-minus-square"></i> Remove test</button>
          <button @click="cancelAdd" class="smbutton" v-if="btnCancel"><i class="fas fa-undo"></i> Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GraphLoader from '@/functions/GraphLoader'
import LineChart from '@/functions/LineChart.js'
import {HTTP} from '../main'

export default {
    props:['items'],
    data(){
        return {
            msg:'',
            loaded:false,
            chartOptions:{},
            chartData:{},
            item:'',
            componentKey: 0,
            allselectors:[],
            selected_selector:'',
            alltests:[],
            selected_test:'',
            selected_item:'',
            btnAdd:true,
            btnRemove:true,
            btnCancel:false,
            btnGo:false,
            btnGo2:false,
            ddSel:false,
            ddTest:false,
            ddItems:false,
        }
    },
    methods:{
        closePopUp(){
            this.$emit('closePopUp','thanks')
        },
        forceRerender(){
            this.componentKey += 1;
        },
        csvExport() {     
            let csvContent = "data:text/csv;charset=utf-8,";
            var str=""
            str+="Date;"+String(this.items[0].test.display_name || this.items[0].test.name)+"\r\n"
            for(let i=0;i<this.chartData.datasets[0].data.length;i++){
                let d = new Date(this.chartData.datasets[0].data[i].x);         
                str+=String(d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear())
                str+=";";
                str+=String(this.chartData.datasets[0].data[i].y)
                str+="\r\n";
            }
            csvContent +=str;   
            const data = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", data);
            link.setAttribute("download", String(this.items[0].selector.name)+" - "+String(this.items[0].test.display_name || this.items[0].test.name)+".csv");
            link.click();
        },
        resetZoom(){
            this.$refs.LineChart.resetZoom();
        },
        reloadGraph(){
            if (this.$refs.LineChart){
                this.$refs.LineChart.reloadGraph();
            }
        },
        change_selector(selectedSelector){
            this.ddSel=false;
            this.ddTest=true;
            this.alltests=[{test:{display_name:'Choose a test'}}]
            this.selected_test=this.alltests[0]
            HTTP.get(this.apiURL+'/selectors/'+selectedSelector.id+'/results/last').then(resp => {
                resp.data.tests.forEach(test => {
                    if(test.type=='float'){
                        this.alltests.push({selector:resp.data.selector,result:resp.data.result,test:test})
                    }
                })
            })
        },
        change_test(selectedTest){
            this.selected_test=selectedTest
            this.btnGo=true;
        },
        change_item(selectedItem){
            this.selected_item=selectedItem
            this.btnGo2=true;
        },
        showAdd(){
            this.ddSel=true;
            this.btnAdd=false;
            this.btnRemove=false;
            this.btnCancel=true;
        },
        showRemove(){
            this.ddItems=true;
            this.btnAdd=false;
            this.btnRemove=false;
            this.btnCancel=true;
            this.$props.items.unshift({selector:{name:'Choose a selector'},test:{display_name:'test'}})
            this.selected_item=this.$props.items[0]
        },
        doRemove(){
            this.loaded=false;
            for(let i=0;i<this.$props.items.length;i++){
                if(this.$props.items[i].selector.id==this.selected_item.selector.id &&
                    this.$props.items[i].test.name==this.selected_item.test.name
                ){
                    this.$props.items.splice(i,1)
                }
            }
            this.btnGo2=false;
            this.ddItems=false;
            this.$props.items.shift()
            this.updateGraph()
        },
        addResult(){
            this.$props.items.push(this.selected_test)
            this.updateGraph()
        },
        updateGraph(){
            this.loaded=false;
            this.chartData.datasets=[]
            for (let i=0;i<this.$props.items.length;i++){
                let temp={}
                if(this.$props.items.length==1){
                    temp = GraphLoader.getcolor('value')
                } else {
                    temp = GraphLoader.getcolor('randomvalue')
                }
                var ylabel = this.$props.items[i].test.units
                if (!ylabel){
                    ylabel = 'Event'
                }
                this.chartOptions = GraphLoader.get_options(this.$props.items[i].test.type,ylabel)
                GraphLoader.loadGraph(
                    this.$props.items[i].selector.id,
                    this.$props.items[i].result.id,
                    this.$props.items[i].test.id,
                    this.$props.items[i].test.type
                ).then(resp => {
                    temp.data=resp
                    temp.label=this.$props.items[i].test.display_name+' ('+this.$props.items[i].selector.name+')'
                    this.chartData.datasets.push(temp)                    
                    if(this.$props.items.length==1){
                        GraphLoader.loadLimits(
                            this.$props.items[i].selector.id,
                            this.$props.items[i].result.id,
                            this.$props.items[i].test.id,
                            this.$props.items[i].test.type
                        ).then(limit =>{
                            if(limit){
                                for (let j=0;j<limit.length;j++){
                                    if(j==0){
                                        var category='limitdanger';
                                        var label='min'
                                    } else if(j==1){
                                        var category='limitwarning';
                                        var label='low'
                                    } else if(j==2){
                                        var category='limitwarning';
                                        var label='high'                            
                                    } else {
                                        var category='limitdanger';
                                        var label='max'
                                    }
                                    var limitset=GraphLoader.getcolor(category)
                                    limitset.data=[{
                                        x:this.chartData.datasets[0].data[0].x,
                                        y:limit[j]
                                    },{
                                        x:this.chartData.datasets[0].data[this.chartData.datasets[0].data.length-1].x,
                                        y:limit[j]
                                    }]
                                    limitset.label=label
                                    this.chartData.datasets.push(limitset)
                                }
                            }
                            if(this.$props.items.length==1){
                                this.loaded=true
                                this.reloadGraph()
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })
                    }
                    if((this.chartData.datasets.length==this.$props.items.length) && (this.$props.items.length>=2)){
                        this.loaded=true
                        this.reloadGraph()
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            }
            HTTP.get(this.apiURL+'/selectors').then(resp => {
                this.allselectors=resp.data.selectors
                this.allselectors.unshift({name:'Choose a selector'})
                this.selected_selector=this.allselectors[0]
            })
            this.ddSel=false;
            this.ddTest=false;
            this.btnAdd=true;
            this.btnRemove=true;
            this.btnCancel=false;
            this.btnGo=false;
            this.selected_selector='';
            this.selected_test='';
        },
        cancelAdd(){
            this.ddSel=false;
            this.ddTest=false;
            this.ddItems=false;
            this.btnAdd=true;
            this.btnRemove=true;
            this.btnCancel=false;
            this.btnGo=false;
            this.btnGo2=false;
            this.selected_selector=this.allselectors[0]
            this.alltests=[{test:{display_name:'Choose a test'}}]
            this.selected_test=this.alltests[0]
            if(this.$props.items[0].selector.name=='Choose a selector')
            this.$props.items.shift()
        }
    },
    created(){
        this.updateGraph()
    },
    components:{
        LineChart
    },
    computed: {
        chartStyle () {
            return {
                height:'100%',
                width:'95%',
                position: 'relative'
            }
        },
        apiURL(){
            return 'http://'+this.$store.getters.api.ip+':'+this.$store.getters.api.port+'/api'
        }
    }
}

</script>

<style>

</style>