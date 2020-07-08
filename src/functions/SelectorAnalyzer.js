import {HTTP} from '../main'
import store from '@/store/store'

var analyzeSelector = (id)=>{
    var apiURL='http://'+store.getters.api.ip+':'+store.getters.api.port+'/api'
    return new Promise((resolve,reject)=>{
        try{
            var Analytics={}
            Analytics.dataResults=[0,0,0]
            Analytics.dataTests=[] 
            var loading_data=[]
            HTTP.get(apiURL+'/selectors/'+id+'/results').then((resp)=>{
                Analytics.numberOfResults=resp.data.results.length
                Analytics.numberOfTests=0
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
                            Analytics.numberOfTests++
                            if((loaded_data[i].data.tests[j].type=='float' || loaded_data[i].data.tests[j].type=='string')
                            && (loaded_data[i].data.tests[j].status>0)){
                                if (!Analytics.dataTests.hasOwnProperty(loaded_data[i].data.tests[j].display_name)){
                                    Analytics.dataTests[loaded_data[i].data.tests[j].display_name]=[0,0,0]
                                }
                                if(loaded_data[i].data.tests[j].status==1){
                                    Analytics.dataTests[loaded_data[i].data.tests[j].display_name][0]++
                                } else if (loaded_data[i].data.tests[j].status==2){
                                    Analytics.dataTests[loaded_data[i].data.tests[j].display_name][1]++
                                } else if (loaded_data[i].data.tests[j].status==3){
                                    Analytics.dataTests[loaded_data[i].data.tests[j].display_name][2]++
                                }
                            }
                        }
                    }
                    resolve(Analytics)
                })
            })
        } catch(error){
            reject(error)
        }
    })
}

export default{
    analyzeSelector
} 
