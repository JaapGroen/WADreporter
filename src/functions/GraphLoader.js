import {HTTP} from '../main'
import store from '@/store/store'

function str2date(string){
  return new Date(Date.parse(string));
};

function getcolor(category){
  if (category=='limitdanger'){
    var linecolor = {borderColor:'#EE1947',backgroundColor: "rgba(0,0,0,0.0)",pointRadius:0,borderWidth:3,lineTension:0}
  } else if (category=='limitwarning'){
    var linecolor = {borderColor:'#FF8820',backgroundColor: "rgba(0,0,0,0.0)",pointRadius:0,borderWidth:3,lineTension:0}
  } else if (category=='value'){
    var linecolor = {borderColor:'#0FAAEA',backgroundColor: "rgba(0,0,0,0.0)",pointRadius:5,lineTension:0,pointHitRadius:10,borderWidth:3,showLine:true}
  } else if (category=='datevalue'){
    var linecolor = {borderColor:'#0FAAEA',backgroundColor: "rgba(0,0,0,0.0)",pointRadius:0,borderWidth:3,showLine:true,lineTension:0}
  } else if (category=='randomvalue'){
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    var linecolor = {borderColor:color,backgroundColor: "rgba(0,0,0,0.0)",pointRadius:5,lineTension:0,pointHitRadius:10,borderWidth:3,showLine:true}
  }
  return linecolor
}

function get_options(category,ylabel){
  var options = {
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        type: 'time',
        distribution: 'linear',
        gridLines: {display: true,color:'#444444'},
        ticks:{fontColor:'white'}
     }],
      yAxes: [{
        gridLines: {display: true,color:'#444444'},
        ticks:{fontColor:'white'},
        scaleLabel:{display:true,labelString:ylabel}
      }]
    },
    zoom: {
      enabled: true,
      drag: true,
      mode: 'xy',
      rangeMin: {x: null,y: null},
      rangeMax: {x: null,y: null}
    },
    pan:{
        enabled:false,
        mode: 'xy',
        rangeMin:{x:null,y:null},
        rangeMax:{x:null,y:null}
    },
    legend: {
      display:true,
      position: 'top'
    },
  };
  if (category=='datetime'){
      options.scales.yAxes[0].ticks.display=false;
      options.scales.yAxes[0].ticks.min=0
      options.scales.yAxes[0].ticks.max=2
  }
  return options
}

var loadGraph = (idSelector,idResult,idTest,RType) => {
    return new Promise((resolve,reject)=>{
        var apiURL='http://'+store.getters.api.ip+':'+store.getters.api.port+'/api'
        HTTP.get(apiURL+'/selectors/'+idSelector+'/results/'+idResult+'/tests/'+idTest+'/'+RType+'/history')
        .then(resp => {
            var data=resp.data.history
            data.forEach((dat) => {
                dat.x=str2date(dat.result.date);
                delete dat.result.date
                dat.y=dat.test.value
                delete dat.test.value
                if(RType=='datetime'){
                    dat.y=1
                }
            })
            resolve(data)
        })
        .catch(err => {
            reject(err)
        })
    })
}

var loadLimits = (idSelector,idResult,idTest,RType) => {
    return new Promise((resolve,reject)=>{
        var apiURL='http://'+store.getters.api.ip+':'+store.getters.api.port+'/api'
        HTTP.get(apiURL+'/selectors/'+idSelector+'/results/'+idResult+'/tests/'+idTest+'/'+RType)
        .then(resp => {
            if(resp.data.test.limit){
                resolve(resp.data.test.limit)
            } else {
                resolve(false)
            }
        })
        .catch(err => {
            reject(err)
        })
    })
}

export default{
    loadGraph,
    loadLimits,
    get_options,
    getcolor
}