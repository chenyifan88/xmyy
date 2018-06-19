import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'
import detail from '@/pages/detail'
import play from '@/pages/play'
import downPlay from '@/pages/downPlay'
import downApp from '@/pages/downApp'
import list from '@/pages/list'
import search from '@/pages/search'
import selectCategories from '@/pages/selectCategories'
import downloading from '@/pages/downloading'
import downloaded from '@/pages/downloaded'
import collection from '@/pages/collection'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    redirect: '/index'
  }, {
    path: '/index',
    name: 'index',
    component: index
  }, {
    path: '/app',
    name: 'downApp',
    component: downApp
  }, {
    path: '/search',
    name: 'search',
    component: search
  }, {
    path: '/collection',
    name: 'collection',
    component: collection
  }, {
    path: '/category/:catid/',
    name: 'list',
    component: list
  }, {
    path: '/category/:catid/:smcat',
    name: 'smlist',
    component: list
  }, {
    path: '/selectCategories',
    name: 'selectCategories',
    component: selectCategories
  }, {
    path: '/movie/:movieid/:tag',
    name: 'detail',
    component: detail
  }, {
    path: '/movie/:movieid/:tag/:sourceid/:seriesid/play',
    name: 'play',
    component: play
  }, {
    path: '/down_play/:torrentId',
    name: 'downPlay',
    component: downPlay
  }, {
    path: '/downloading',
    name: 'downloading',
    component: downloading
  }, {
    path: '/downloaded',
    name: 'downloaded',
    component: downloaded
  }]
})
