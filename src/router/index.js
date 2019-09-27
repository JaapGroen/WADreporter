import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/store.js'
import Login from '@/components/Login'
import Selectors from '@/components/Selectors'
import Tests from '@/components/Tests'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/selectors',
      name: 'Selectors',
      component: Selectors,    
    },
    {
      path: '/selectors/:idSelector/results/:idResult',
      name: 'Tests',
      component: Tests,    
    },    
  ]
})

var checked=false;

router.beforeEach((to, from, next) => {
  if(to.path=='/'){
    if(store.getters.isLoggedIn){
      next('/selectors')
    }
    next()
  }
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/') 
  } else {
    next() 
  }
})

export default router