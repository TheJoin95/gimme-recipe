import Vue from 'vue'
import axios from 'axios'
import to from 'await-to-js'

interface Endpoints { [endpoint: string]: string }

export interface Wine {
  description: string,
  image: string,
  name: string,
  wineCategory: string,
  url: string
}

class WineApi {
  private _model: any = null
  private BASE_URL: string = 'https://gimme-recipe-server.herokuapp.com'
  private IMG_PLACEHOLDER: string = 'placeholder.png'

  private readonly _apis: Endpoints = {
    wineRandom: '/wine/random',
    wineByFood: '/wine/food-abbination',
    wineByGrapevine: '/wine/by-grapevine',
    mostRated: '/wine/random?limit=20'
  }

  set model (model: any) {
    this._model = model
    Vue.set(this._model, 'loading', false)
    Vue.set(this._model, 'result', null)
  }

  async getRandom (): Promise<any> {
    Vue.set(this._model, 'loading', true)

    const [error, response] = await to(axios.request({
      url: this.BASE_URL + this._apis.wineRandom
    }))

    if (!error) {
      const wines: Array<Wine> = []
      console.log(response)
      response.data.forEach((wine: Wine) => {
        wine.image = (wine.image === undefined || wine.image === null) ? this.IMG_PLACEHOLDER : wine.image
        wines.push(wine)
      })

      Vue.set(this._model, 'result', wines)
    }

    Vue.set(this._model, 'loading', false)
  }

  async getMostRated (): Promise<any> {
    Vue.set(this._model, 'loading', true)

    const [error, response] = await to(axios.request({
      url: this.BASE_URL + this._apis.mostRated
    }))

    if (!error) {
      const wines: Array<Wine> = []

      response.data.forEach((wine: Wine) => {
        wines.push(wine)
      })

      Vue.set(this._model, 'result', wines)
    }

    Vue.set(this._model, 'loading', false)
  }
}

export default new WineApi()
