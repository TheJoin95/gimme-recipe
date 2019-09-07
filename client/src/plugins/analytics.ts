import Vue from 'vue'
import router from './router'
import config from '../../package.json'
import VueAnalytics from 'vue-analytics'
import { prerenderer } from '@/platform'

const production = window.location.href.includes(config.domain) &&
                  !window.location.href.includes('localhost') &&
                  config.domain.length

if (!prerenderer && production) {
  Vue.use(VueAnalytics, {
    autoTracking: { exception: true },
    id: 'UA-XXXXXXXX-X',
    router
  })
}
