import 'babel-polyfill'
import 'console-polyfill'

import './service-worker'
import './plugins/locale'
import './plugins/analytics'

import Vue from 'vue'
import App from './App.vue'
import config from '../package.json'
import router from './plugins/router'

import axios from 'axios'
import Meta from 'vue-meta'
import Axios from 'vue-axios'
import VueCookie from 'vue-cookie'
import Events from 'vue-event-handler'

Vue.use(Meta)
Vue.use(Events)
Vue.use(VueCookie)
Vue.use(Axios, axios)
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  Vue.config.language = to.params.language || 'en'
  next()
})

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',

  render: create => create(App, {
    props: {
      language: Vue.config.language,
      version: config.version,
      domain: config.domain
    }
  })
})
/* eslint-enable no-new */
