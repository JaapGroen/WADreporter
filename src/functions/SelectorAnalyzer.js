import {HTTP} from '../main'
import store from '@/store/store'
var apiURL='http://'+store.getters.api.ip+':'+store.getters.api.port+'/api'

var analyzeSelector = (id)=>{
    return new Promise((resolve,reject)=>{
        var Analytics={}
        Analytics.dataResults=[0,0,0]
        Analytics.dataTests=[0,0,0]  
        var loading_data=[]
        var worstTest={}
        HTTP.get(apiURL+'/selectors/'+id+'/results').then((resp)=>{
            Analytics.numberOfResults=resp.data.results.length
            for (let i=0;i<resp.data.results.length;i++){
                loading_data.push(HTTP.get(apiURL+'/selectors/'+id+'/results/'+resp.data.results[i].id))
            }
            Promise.all(loading_data).then((loaded_data)=>{
                for (let i=0;i<loaded_data.length;i++){
                    if(loaded_data[i].data.result.status.tests==1){
                        Analytics.dataResults[0]++
                    } else if (loaded_data[i].data.result.status.tests==2){
                        Analytics.dataResults[1]++
                    } else if (loaded_data[i].data.result.status.tests==3){
                        Analytics.dataResults[2]++
                    }
                    for (let j=0;j<loaded_data[i].data.tests.length;j++){
                        if(loaded_data[i].data.tests[j].type=='float' || loaded_data[i].data.tests[j].type=='string'){
                            if(loaded_data[i].data.tests[j].status==1){
                                Analytics.dataTests[0]++
                            } else if (loaded_data[i].data.tests[j].status==2){
                                Analytics.dataTests[1]++
                            } else if (loaded_data[i].data.tests[j].status==3){
                                Analytics.dataTests[2]++
                                if (worstTest.hasOwnProperty(loaded_data[i].data.tests[j].display_name)){
                                    worstTest[loaded_data[i].data.tests[j].display_name]++
                                } else {
                                    worstTest[loaded_data[i].data.tests[j].display_name]=1
                                }
                            }
                        }
                    }
                }
                if(worstTest.length>0){
                    var sortedTests=[]
                    for (var test in worstTest){
                        sortedTests.push([test,worstTest[test]])
                    }
                    sortedTests.sort((a,b)=>{return a[1]-b[1]})
                    worstTest=sortedTests[sortedTests.length-1][1]+' ('+sortedTests[sortedTests.length-1][0]+'x)'
                } else {
                    worstTest='No worst test.'
                }
                Analytics.worstTest=worstTest
                Analytics.numberOfTests=Analytics.dataTests.reduce((a, b) => a + b, 0)
                resolve(Analytics)
            })  
        })
    })
}
    
export default{
    analyzeSelector
} 