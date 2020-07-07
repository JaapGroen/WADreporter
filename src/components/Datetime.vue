<template>
    <div class="pageoverlay">
        <div class="overlaybox">
            <div class="overlaytop">
                {{test.display_name || test.name}}
                <router-link :to="{name:'result',params:$route.params}" class="fas fa-times pointer" tag="i"></router-link>
            </div>
       
            <div class="overlaycontent">
                <i v-if="loading" style="margin-top:50px;margin-bottom:50px;" class="fas fa-sun fa-2x fa-spin"></i>
                <LineChart ref="LineChart" v-else :chartdata="chartData" :options="chartOptions" :styles="chartStyle"/>
                
            </div>            
            
            <div class="overlayfooter">
                <div v-if="!loading">
                    <button @click="csvExport()" class="btn btn-small"><i class="fas fa-download"></i> Export</button>
                    <button @click="resetZoom()" class="btn btn-small" ><i class="fas fa-search-minus"></i> Reset</button>
                    <button @click="reloadGraph()" class="btn btn-small" ><i class="fas fa-sync"></i> Reload</button>
                </div>
                <div v-if="!loading">
                    <button @click="openAdd" v-if="buttons.openadd" class="btn btn-small"><i class="fas fa-plus-square"></i> open Add</button>
                    <span v-if="chartData.datasets.length>1">
                        <button @click="openRemove" v-if="buttons.openremove" class="btn btn-small"><i class="fas fa-minus-square"></i> open Remove</button>
                    </span>

                    <select v-if="selects.selector" class="date_select" v-model="selected_selector" @change="setSelectedSelector">
                        <option v-for="selector in selectors" v-bind:value="selector" :key="selector.id">{{selector.name}}</option>
                    </select>


                    <select v-if="selects.dataset" class="date_select" v-model="selected_dataset">
                        <option v-for="dataset in datasets" v-bind:value="dataset" :key="dataset.id">{{dataset.name}}</option>
                    </select>

                    <select v-if="selects.test" class="date_select" v-model="selected_test">
                        <option v-for="test in tests" v-bind:value="test" :key="test.id">{{test.display_name || test.name}}</option>
                    </select>
                    
                    <button @click="addtoPlot" v-if="buttons.addtest && selected_test.display_name!='Choose a test'" class="btn btn-small"><i class="fas fa-plus-square"></i> Add test</button>

                    <button @click="removeDataset" v-if="buttons.removedataset && selected_dataset.name!='Choose a dataset'" class="btn btn-small"><i class="fas fa-minus-square"></i> Remove dataset</button>

                    <span v-if="loading_extra">
                        Loading {{selected_selector.name}} / {{selected_test.name}} <i class="fas fa-sun fa-spin"></i>
                    </span>

                    <button @click="cancel" v-if="buttons.cancel" class="btn btn-small"><i class="fas fa-undo"></i> Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DataLoader from '@/functions/DataLoader'
// import BarChart from '@/functions/BarChart'
import LineChart from '@/functions/LineChart'
import {HTTP} from '../main'


export default {
    data(){
        return {
            loading:true,
            test:{},
            id_selector:this.$route.params.id_selector,
            id_result:this.$route.params.id_result,
            id_test:this.$route.params.id_test,
            chartOptions:{
                scales:{
                    xAxes:[{
                        type:'time',
                        time:{
                            unit:'day',
                            round:'day'
                        }
                    }],
                    yAxes:[{
                        ticks:{
                            beginAtZero:true
                        }
                    }]
                }
            },
            chartData:{},
            selectors:[],
            selected_selector:{},
            tests:[],
            selected_test:{},
            datasets:[],
            selected_dataset:{},
            loading_extra:false,
            buttons:{openadd:true,openremove:true,addtest:false,removedataset:false,cancel:false},
            selects:{selector:false,dataset:false,test:false}
        }
    },
    created(){
        this.loadGraph()
    },
    methods:{
        loadGraph(){
            HTTP.get(this.apiURL+'/selectors/'+this.id_selector+'/results/'+this.id_result+'/tests/'+this.id_test+'/datetime').then((resp)=>{
                this.test = resp.data.test
                this.chartData.datasets=[]
                let temp = {}
                temp = DataLoader.getcolor('datevalue')
                var ylabel = 'Events'
                this.chartOptions = DataLoader.get_options(this.test.type,ylabel)
                this.chartOptions.onClick=(event,chart)=>{
                    const item = chart[chart.length - 1]
                    let idSelector = this.chartData.datasets[item._datasetIndex].data[item._index].selector.id
                    let idResult = this.chartData.datasets[item._datasetIndex].data[item._index].result.id
                    this.gotoResult(idSelector,idResult)
                }
                temp.label = this.test.display_name+' (selector '+this.id_selector+')'
                DataLoader.loadGraph(this.id_selector, this.id_result, this.id_test, this.test.type).then((resp)=>{
                    temp.data = resp  
                    this.chartData.datasets.push(temp)
                    this.loading = false
                })
            })
        },       
        csvExport() {
            let csvContent = "data:text/csv;charset=utf-8,";
            var str=""
            str+="Date;"+String(this.test.display_name || this.test.name)+"\r\n"
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
            link.setAttribute("download", "Selector "+String(this.id_selector)+" - "+String(this.test.display_name || this.test.name)+".csv");
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
        openAdd(){
            HTTP.get(this.apiURL+'/selectors').then((resp)=>{
                this.selectors = resp.data.selectors
                this.selectors.unshift({name:'Choose a selector'})
                this.selected_selector=this.selectors[0]
            })
            this.buttons={openadd:false,openremove:false,addtest:false,removedataset:false,cancel:true}
            this.selects={selector:true,dataset:false,test:false}
            
        },
        openRemove(){
            this.datasets = [{name:'Choose a dataset'}]
            this.chartData.datasets.forEach((dataset)=>{
                this.datasets.push({name:dataset.label})
                this.selected_dataset = this.datasets[0]
            })
            this.buttons={openadd:false,openremove:false,addtest:false,removedataset:true,cancel:true}
            this.selects={selector:false,dataset:true,test:false}
        },
        cancel(){
            this.selected_selector={}
            this.selected_test={}
            this.selected_dataset={}
            this.buttons={openadd:true,openremove:true,addtest:false,removedataset:false,cancel:false}
            this.selects={selector:false,dataset:false,test:false}
        },
        removeDataset(){
            for(let i=0;i<this.chartData.datasets.length;i++){
                if (this.chartData.datasets[i].label == this.selected_dataset.name){
                    this.chartData.datasets.splice(i,1)
                }
            }
            this.buttons={openadd:true,openremove:true,addtest:false,removedataset:false,cancel:false},
            this.selects={selector:false,dataset:false,test:false}
            this.$refs.LineChart.reloadGraph();
        },
        setSelectedSelector(){
            this.tests = [{display_name:'Choose a test'}]
            HTTP.get(this.apiURL+'/selectors/'+this.selected_selector.id+'/results/last').then((resp)=>{
                resp.data.tests.forEach((test)=>{
                    if (test.type == "float"){
                        this.tests.push(test)
                    }
                })
                this.selected_test = this.tests[0]
                this.buttons={openadd:false,openremove:false,addtest:true,removedataset:false,cancel:true}
                this.selects={selector:true,dataset:false,test:true}
            })
        },
        addtoPlot(){
            this.buttons={openadd:false,openremove:false,addtest:false,removedataset:false,cancel:false}
            this.selects={selector:false,dataset:false,test:false}
            this.loading_extra = true
            let temp = {}
            temp = DataLoader.getcolor('randomvalue')
            temp.label = this.selected_test.display_name+' (selector '+this.selected_selector.id+')'
            DataLoader.loadGraph(this.selected_selector.id, 0, this.selected_test.id, this.selected_test.type).then((resp)=>{
                temp.data = resp
                this.chartData.datasets.push(temp)
                this.$refs.LineChart.reloadGraph();
                this.selected_selector={}
                this.selected_test={}
                this.loading_extra = false
                this.buttons={openadd:true,openremove:true,addtest:false,removedataset:false,cancel:false}
                this.selects={selector:false,dataset:false,test:false}
            })
        },
        gotoResult(id_selector,id_result){
            this.$router.push('/selectors/'+id_selector+'/results/'+id_result)
        }
    },
    components:{
        LineChart
    },
    computed: {
        chartStyle(){
            return {
                height:'100%',
                width:'95%',
                position: 'relative'
            }
        },
        apiURL(){
            return 'http://'+this.$store.getters.api.ip+':'+this.$store.getters.api.port+'/api'
        },
    }
}

</script>

<style scoped>
.date_select{
    background:#323b47;
    border:none;
    color:white;
}
</style>
