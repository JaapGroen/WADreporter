import Vue from 'vue'
import Vuex from 'vuex'
import {HTTP} from '@/main'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('WADtoken') || '',
    user : JSON.parse(localStorage.getItem('WADuser')) || '',
    filter: '',
    api:{ip:'localhost',port:'3000'},
    selectorresult:{},
    messages:[]
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
        }
    },
    actions: {
        setAPI({commit}, payload){
            return new Promise((resolve,reject) => {
                commit('setAPI', {ip:payload.ip, port:payload.port})
                resolve(true)
            })
        },
        setSelectorResult({commit}, selectorresult){
            return new Promise((resolve,reject) =>{
                commit('setSelectorResult',selectorresult)
                resolve(true)
            })
        },
        setFilter({commit}, filter){
            return new Promise((resolve,reject) =>{
                commit('setFilter',filter)
                resolve(true)
            })
        },
        addMessage({commit}, message){
            return new Promise((resolve,reject) =>{
                commit('addMessage',message)
                resolve(true)
            })
        },
        removeMessage({commit}, message){
            return new Promise((resolve,reject) =>{
                commit('removeMessage',message)
                resolve(true)
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
    },
    getters : {
        isLoggedIn: state => !!state.token && !!state.user,
        // authStatus: state => state.status,
        user: state => state.user,
        filter: state => state.filter,
        api: state => state.api,
        selectorresult: state => state.selectorresult,
        messages: state => state.messages
    }
})
