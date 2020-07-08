import Vue from 'vue'
import Vuex from 'vuex'
import {HTTP} from '@/main'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('WADtoken') || '',
    user : JSON.parse(localStorage.getItem('WADuser')) || '',
    filter: '',
    api:{ip:'<wadqc api ip here>',port:'<wadqc api port here>'},
    selectorresult:{},
    messages:[],
    cache:{selectors:[],lastresults:{}}
    
  },
    mutations: {
        auth_success(state, data){
            state.token = data.token
            state.user = data.user
        },
        logout(state){
            state.token = ''
            state.user= ''
        },
        setFilter(state,filter){
            state.filter=filter.toLowerCase()
        },
        setSelectorResult(state,selectorresult){
            state.selectorresult = selectorresult
        },
        setAPI(state,api){
            state.api.ip = api.ip
            state.api.port = api.port
        },
        addMessage(state,message){
            state.messages.push(message)
            setTimeout(() => {
                const index = state.messages.indexOf(message)
                if (index > -1) {
                    state.messages.splice(index, 1);
                }
            }, 3000);
        },
        removeMessage(state,message){
            const index = state.messages.indexOf(message)
            if (index > -1) {
                state.messages.splice(index, 1);
            }
        },
        setSelectors(state,selectors){
            state.cache.selectors = selectors
        },
        setLastResult(state,lastresult){
            state.cache.lastresults[lastresult.selector.id] = lastresult
        },
        clearLastResults(state){
            state.cache.lastresults={}
        }
    },
    actions: {
        setAPI({commit}, payload){
            return new Promise((resolve,reject) => {
                try {
                    commit('setAPI', {ip:payload.ip, port:payload.port})
                    resolve(true)
                } catch(error) {
                    reject(error)
                }
            })
        },
        setSelectorResult({commit}, selectorresult){
            return new Promise((resolve,reject) =>{
                try {
                    commit('setSelectorResult',selectorresult)
                    resolve(true)
                } catch(error){
                    reject(error)
                }
            })
        },
        setFilter({commit}, filter){
            return new Promise((resolve,reject) =>{
                try {
                    commit('setFilter',filter)
                    resolve(true)
                } catch(error){
                    reject(error)
                }
            })
        },
        addMessage({commit}, message){
            return new Promise((resolve,reject) =>{
                try {
                    commit('addMessage',message)
                    resolve(true)
                } catch(error) {
                    reject(error)
                }
            })
        },
        removeMessage({commit}, message){
            return new Promise((resolve,reject) =>{
                try {
                    commit('removeMessage',message)
                    resolve(true)
                } catch(error) {
                    reject(error)
                }
            })
        },
        login({commit}, payload){
            let apiURL = payload.apiURL
            let credentials = payload.credentials
            return new Promise((resolve, reject) => {
              HTTP({url: apiURL+'/authenticate', data: credentials, method: 'POST' })
              .then(resp => {
                if (resp.data.success){
                    const token = resp.data.token
                    const user = resp.data.user
                    localStorage.setItem('WADtoken', token)
                    localStorage.setItem('WADuser', JSON.stringify(user))
                    HTTP.defaults.headers['Authorization'] = 'JWT '+token
                    commit('auth_success', {token:token, user:user})
                    resolve(resp)
                } else {
                    resolve(resp)
                }
              })
              .catch(err => {
                commit('logout')
                localStorage.removeItem('WADtoken')
                localStorage.removeItem('WADuser')
                reject(err)
              })
            })
        },
        logout({commit}){
          return new Promise((resolve, reject) => {
            commit('logout')
            localStorage.removeItem('WADtoken')
            localStorage.removeItem('WADuser')
            delete HTTP.defaults.headers['Authorization']
            resolve()
            reject(false)
          })
        },
        getSelectors({commit}){
            return new Promise((resolve, reject) => {
                HTTP.get('http://'+this.state.api.ip+':'+this.state.api.port+'/api/selectors').then((resp)=>{
                    commit('setSelectors',resp.data.selectors)
                    resolve(true)
                }).catch((error)=>{
                    reject(error)
                })
            })
        },
        setLastResult({commit},lastresult){
            return new Promise((resolve,reject) =>{
                try {
                    commit('setLastResult',lastresult)
                    resolve(true)
                } catch(error) {
                    reject(error)
                }
            })
        },
        clearLastResults({commit}){
            return new Promise((resolve,reject) =>{
                try {
                    commit('clearLastResults')
                    resolve(true)
                } catch(error) {
                    reject(error)
                }
            })
        }
    },
    getters : {
        isLoggedIn: state => !!state.token && !!state.user,
        user: state => state.user,
        filter: state => state.filter,
        api: state => state.api,
        selectorresult: state => state.selectorresult,
        messages: (state) => state.messages,
        selectors: (state) => state.cache.selectors,
        lastresult: (state) => (id) => state.cache.lastresults[id]
    }
})
