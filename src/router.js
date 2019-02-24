import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import Login from '@/components/login/view'
import Dashboard from '@/components/dashboard/view'
import Editor from '@/components/dashboard/editor/view'
import Profiles from '@/components/profiles'
import Visualization from '@/components/visualization'


Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  linkExactActiveClass: 'is-active',
  routes: [
    {
      path: '/connexion',
      name: 'connexion',
      component: Login
    },
    {
      path: '/',
      component: Dashboard,
      children: [
        {
          path: '',
          component: Editor,
          name: 'editor'
        },
        {
          path: 'profils',
          component: Profiles,
          name: 'profiles'
        },
        {
          path: 'visualisation',
          component: Visualization,
          name: 'visualization'
        }
      ],
      beforeEnter(to, from, next) {
        next(store.state.logged ? true : '/connexion')
      }
    },
    {
      path: '/deconnexion',
      name: 'logout',
      beforeEnter(to, from, next) {
        store.dispatch('logout');
        next('/connexion');
      }
    },
    {
      path: '**', redirect: '/'
    }
  ]
})
