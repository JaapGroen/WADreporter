import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/store.js'
import Login from '@/components/Login'
import Main from '@/components/Main'
import Selectors from '@/components/Selectors'
import Input from '@/components/Input'
import Result from '@/components/Result'
import Plot from '@/components/Plot'
import Datetime from '@/components/Datetime'
import Table from '@/components/Table'
import Image from '@/components/Image'
import Notes from '@/components/Notes'
import SelectorAnalytics from '@/components/SelectorAnalytics'


Vue.use(Router)

let router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/login',
            component: Login,
            meta: {
                guest: true
            }
        },
        {
            path: '/',
            component: Main,
            name: 'main',
            meta: {
                requiresAuth: true
            },
            children:[
                {
                    path:'selectors',
                    component:Selectors,
                    name:'selectors',
                    children:[
                        {
                            path:':id_selector/processes/:id_process/input',
                            component: Input,
                            name:'input'
                        }
                    ]
                },
                {
                    path: '/selectors/:id_selector/results/:id_result',
                    component: Result,
                    name: 'result',
                    children:[
                        {
                            path:'tests/:id_test/datetime',
                            component: Datetime,
                            name: 'datetime'
                        },
                        {
                            path:'tests/:id_test/float',
                            component: Plot,
                            name: 'float'
                        },
                        {
                            path:'tests/:id_test/string',
                            component: Table,
                            name: 'string'
                        },
                        {
                            path:'tests/:id_test/bool',
                            component: Table,
                            name: 'bool'
                        },
                        {
                            path:'tests/:id_test/object',
                            component: Image,
                            name: 'object'
                        },
                        {
                            path:'dataset/:id/notes',
                            component: Notes,
                            name: 'notes'
                            
                        },
                        {
                            path:'analytics',
                            component: SelectorAnalytics,
                            name: 'selectoranalytics'
                            
                        },
                    ]
                },
            ]
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




