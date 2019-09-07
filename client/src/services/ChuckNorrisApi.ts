import Vue from 'vue'
import axios from 'axios'
import to from 'await-to-js'

interface Endpoints { [endpoint: string]: string }

interface ResponceData {
  categories: Array<string>,
  updated_at?: string, // eslint-disable-line camelcase
  created_at: string, // eslint-disable-line camelcase
  icon_url: string, // eslint-disable-line camelcase
  value: string,
  url: string,
  id: string
}

class ChuckNorrisApi {
  private _model: any = null

  private readonly _apis: Endpoints = {
    categories: 'https://api.chucknorris.io/jokes/categories',
    randomQuote: 'https://api.chucknorris.io/jokes/random',
    search: 'https://api.chucknorris.io/jokes/search'
  }

  set model (model: any) {
    this._model = model
    Vue.set(this._model, 'random', null)
    Vue.set(this._model, 'loading', false)
    Vue.set(this._model, 'categories', null)
    Vue.set(this._model, 'searchResult', null)
  }

  async getCategories (): Promise<any> {
    Vue.set(this._model, 'loading', true)

    const [error, response] = await to(axios.request({
      url: this._apis.categories
    }))

    if (!error) {
      Vue.set(this._model, 'categories', response.data)
    }

    Vue.set(this._model, 'loading', false)
  }

  async getRandomQuote (): Promise<any> {
    Vue.set(this._model, 'loading', true)

    const [error, response] = await to(axios.request({
      url: this._apis.randomQuote
    }))

    if (!error) {
      Vue.set(this._model, 'random', response.data.value)
    }

    Vue.set(this._model, 'loading', false)
  }

  async getCategoryQuote (category: string) {
    Vue.set(this._model, 'loading', true)

    const [error, response] = await to(axios.request({
      url: this._apis.randomQuote,
      params: { category: category }
    }))

    if (!error) {
      Vue.set(this._model, category, response.data.value)
    }

    Vue.set(this._model, 'loading', false)
  }

  async search (query: string) {
    Vue.set(this._model, 'loading', true)

    const [error, response] = await to(axios.request({
      url: this._apis.search,
      params: { query: query }
    }))

    if (!error) {
      const result: Array<string> = []

      if (response.data.result) {
        response.data.result.forEach((quote: ResponceData) => {
          result.push(quote.value)
        })
      }

      Vue.set(this._model, 'searchResult', result)
    }

    Vue.set(this._model, 'loading', false)
  }
}

export default new ChuckNorrisApi()
