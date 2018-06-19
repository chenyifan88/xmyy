import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'
import localStoragePlugin from './middleware/localstorage'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [localStoragePlugin],
  modules,
  strict: process.env.NODE_ENV !== 'production'
})
