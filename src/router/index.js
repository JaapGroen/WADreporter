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
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        guest: true
      }
    },
    {
      path: '/selectors',
      name: 'Selectors',
      component: Selectors,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/selectors/:idSelector/results/:idResult',
      name: 'Tests',
      component: Tests,
      meta: {
        requiresAuth: true
      }
    },
  ]
})

//var checked=false;

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)){
        if (localStorage.getItem('WADtoken') == null) {
            next('/login')
        } else {
            next()
        }
    } else if (to.matched.some(record => record.meta.guest)){
        if(localStorage.getItem('WADtoken') == null){
            next()
        } else {
            next('/selectors')
        }
    } else {
        next('/login')
    }
})


export default router
