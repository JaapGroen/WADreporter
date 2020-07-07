import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import store from '@/store/store'


const token = localStorage.getItem('WADtoken')
export const HTTP = axios.create({
    //baseURL: 'http://localhost:3000/api', we set this in the store.
    headers:{
        'Authorization': 'JWT '+token
    }
})

Vue.config.devtools = true
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
