import Vue from 'vue'
import Vuex from 'vuex'
import {HTTP} from '@/main'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('WADtoken') || '',
    user : JSON.parse(localStorage.getItem('WADuser')) || '',
    selectorFilter: '',
    api:{ip:'localhost',port:3001}
  },
  mutations: {
      auth_success(state, data){
        state.token = data.token
        state.user = data.user
      },
      logout(state){
        state.status = ''
        state.token = ''
        state.user= ''
      },
      changeselectorFilter(state,selectorFilter){
        state.selectorFilter=selectorFilter.toLowerCase()
      },
      setAPI(state,api){
          state.api=api
      },      
  },
  actions: {
    login({commit}, user){
        return new Promise((resolve, reject) => {
          commit('auth_request')
          HTTP({url: '/authenticate', data: user, method: 'POST' })
          .then(resp => {
            const token = resp.data.token
            const user = resp.data.user
            localStorage.setItem('WADtoken', token)
            localStorage.setItem('WADuser', user)
            HTTP.defaults.headers['Authorization'] = 'JWT '+token
            commit('auth_success', {token:token, user:user})
            resolve(resp)
          })
          .catch(err => {
            commit('auth_error')
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
      })
    },
  },
  getters : {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    user: state => state.user,
    selectorFilter: state => state.selectorFilter,
    api: state => state.api
  }
})
