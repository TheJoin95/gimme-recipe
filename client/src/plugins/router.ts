import Vue from 'vue'
import Router from 'vue-router'
import pages from '../pages.json'

import config from '../../package.json'
import { language, prerenderer } from '@/platform'
import languages from '@/assets/data/languages.json'

type callback = () => string

interface Route {
  redirect?: string | callback,
  component?: any,
  name?: string,
  path: string
}

let routes: Array<Route> = Array.from(pages, (page: Route) => {
  return {
    name: page.name,
    path: page.path,

    component: () => import(
      /* webpackChunkName: "[request]" */
      `../pages/${page.name}.vue`
    )
  }
})

if (config.multilanguage) {
  let possibleLanguages: string = ''
  const userLanguage: string = prerenderer ? 'en' : language.split('-')[0]

  const getValidLanguage = (): string => {
    return languages[userLanguage] ? userLanguage : Object.keys(languages)[0]
  }

  const validRouteParameter = (route: Route, param: string): param is keyof Route => {
    return param in route
  }

  Object.keys(languages).forEach((lang) => {
    possibleLanguages += lang + '|'
  })

  possibleLanguages = possibleLanguages.substring(0, possibleLanguages.lastIndexOf('|'))

  routes.forEach(route => {
    route.path = `/:language(${possibleLanguages})${route.path}`

    if (prerenderer) {
      const duplicate: Route = {
        path: route.path
      }

      Object.keys(route).forEach((key: string) => {
        if (validRouteParameter(route, key)) {
          duplicate[key] = route[key]
        }
      })

      duplicate.name = route.name + '-prerenderer'
      routes.push(duplicate)
    }
  })

  routes = routes.concat([{
    path: `/:language(\\w{2,2}\\b)/*`,
    redirect: (to: any): string => {
      return `/${getValidLanguage()}/${to.params[0]}`
    }
  }, {
    path: `/:language(${possibleLanguages})/*`,
    redirect: `/${getValidLanguage()}`
  }, {
    path: '*',
    redirect: (to: any): string => {
      return `/${getValidLanguage()}${to.path}`
    }
  }] as Array<Route>)
} else {
  routes.push({
    redirect: '/',
    path: '*'
  })
}

Vue.use(Router)

export default new Router({
  routes: routes,
  mode: 'history',
  base: process.env.BASE_URL,

  scrollBehavior (to, from, position) {
    return position || { x: 0, y: 0 }
  }
})
