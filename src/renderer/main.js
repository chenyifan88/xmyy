import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import querystring from 'querystring'
import Emitter from './libs/emitter'
import VueLazyload from 'vue-lazyload'
import filters from './libs/filters'

import BT from './libs/bt'

import {
  Message,
  MessageBox,
  Pagination
} from 'element-ui'

import {
  ipcRenderer
} from 'electron'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

// ui components && directive
Vue.use(Pagination)
Vue.message = Vue.prototype.$message = function (content, type, option) {
  Message[type || 'info'](Object.assign({
    message: content
  }, option || {}))
}
Vue.prototype.$messageBox = MessageBox
Vue.use(VueLazyload, {
  throttleWait: 200,
  error: require('./assets/images/loading_img.jpg'),
  loading: require('./assets/images/loading_img.jpg'),
  listenEvents: ['scroll', 'wheel', 'mousewheel', 'resize']
})

// axios
Vue.http = Vue.prototype.$http = axios.create({
  baseURL: 'http://simitv.net/api/',
  timeout: 30000
})
Vue.http.interceptors.request.use(config => {
  if (config.data) config.data = querystring.stringify(config.data)
  return config
}, error => {
  return Vue.message(error.message, 'error')
})
Vue.http.interceptors.response.use(res => {
  if (res.status == 200) {
    return res.data
  }
}, error => {
  return Vue.message(error.message, 'error')
})

Vue.mixin(Emitter)

Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))

// bt
Vue.bt = Vue.prototype.$bt = new BT()

Vue.ipcRenderer = Vue.prototype.$ipc = ipcRenderer

/* eslint-disable no-new */
new Vue({
  components: {
    App
  },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
