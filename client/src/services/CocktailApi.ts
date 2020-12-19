import Vue from 'vue'
import axios from 'axios'
import to from 'await-to-js'

interface Endpoints { [endpoint: string]: string }

export interface Cocktail {
  description: string,
  image: string,
  name: string,
  baseSpirit: Array<String>,
  url: string
}

class CocktailApi {
  private _model: any = null
  private BASE_URL: string = 'https://gimme-recipe-server.herokuapp.com'

  private readonly _apis: Endpoints = {
    cocktailRandom: '/cocktail/random',
    cocktailBySpirit: '/cocktail/by-base-spirit',
    cocktailByIngredients: '/cocktail/by-ingredients',
    cocktailByDifficulty: '/cocktail/easy-todo',
    mostRated: '/cocktail/easy-todo'
  }

  set model (model: any) {
    this._model = model
    Vue.set(this._model, 'loading', false)
    Vue.set(this._model, 'result', null)
  }

  async getRandom (): Promise<any> {
    Vue.set(this._model, 'loading', true)

    const [error, response] = await to(axios.request({
      url: this.BASE_URL + this._apis.cocktailRandom
    }))

    if (!error) {
      const cocktails: Array<Cocktail> = []
      response.data.forEach((cocktail: Cocktail) => {
        cocktails.push(cocktail)
      })

      Vue.set(this._model, 'result', cocktails)
    }

    Vue.set(this._model, 'loading', false)
  }

  async getMostRated (): Promise<any> {
    Vue.set(this._model, 'loading', true)

    const [error, response] = await to(axios.request({
      url: this.BASE_URL + this._apis.mostRated
    }))

    if (!error) {
      const cocktails: Array<Cocktail> = []

      response.data.forEach((cocktail: Cocktail) => {
        cocktails.push(cocktail)
      })

      Vue.set(this._model, 'result', cocktails)
    }

    Vue.set(this._model, 'loading', false)
  }
}

export default new CocktailApi()
