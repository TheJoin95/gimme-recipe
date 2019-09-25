import 'babel-polyfill'
import 'console-polyfill'

import './service-worker'
import './plugins/locale'
import './plugins/analytics'

import Vue from 'vue'
import App from './components/App.vue'
import config from '../package.json'
import router from './plugins/router'

import axios from 'axios'
import Meta from 'vue-meta'
import Axios from 'vue-axios'
import VueCookie from 'vue-cookie'
import Events from 'vue-event-handler'

import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCocktail, faUtensils, faWineGlassAlt, faSearch, faHome, faRandom, faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCocktail, faUtensils, faWineGlassAlt, faSearch, faHeart, faHome, faRandom)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(Meta)
Vue.use(Events)
Vue.use(VueCookie)
Vue.use(Axios, axios)
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  Vue.config.language = to.params.language || 'en'
  next()
})

const requireComponent = require.context(
  // The relative path of the components folder
  './components',
  // Whether or not to look in subfolders
  false,
  // The regular expression used to match base component filenames
  /[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  // Get component config
  const componentConfig = requireComponent(fileName)

  // Get PascalCase name of component
  const componentName = upperFirst(
    camelCase(
      // Gets the file name regardless of folder depth
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )

  // Register component globally
  Vue.component(
    componentName,
    // Look for the component options on `.default`, which will
    // exist if the component was exported with `export default`,
    // otherwise fall back to module's root.
    componentConfig.default || componentConfig
  )
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
