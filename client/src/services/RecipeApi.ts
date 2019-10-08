import Vue from 'vue'
import axios from 'axios'
import to from 'await-to-js'

interface Endpoints { [endpoint: string]: string }

interface Nutrition {
  carbohydrateContent: number,
  saturatedFatContent: number,
  cholesterolContent: number,
  sodiumContent: number,
  fiberContent: number,
  sugarContent: number,
  fatContent: number,
  calories: number
}

export interface Recipe {
  suitableForDiet: Array<string>,
  nutrition: Array<Nutrition>,
  ingredients: Array<string>,

  aggregateRating: number,
  recipeCategory: string,
  description: string,
  totalTime: number,
  image: string,
  name: string,
  url: string
}

class RecipeApi {
  private _model: any = null
  private BASE_URL: string = 'http://localhost:3000'

  private readonly _apis: Endpoints = {
    random: '/recipe/random',
    menu: '/recipe/gimme-menu',
    lowBudget: '/recipe/low-budget',
    calories: '/recipe/by-calories/:calories',
    ingredients: '/recipe/by-ingredients',
    diet: '/recipe/suitable-diet/:diet',
    timeSaver: '/recipe/time-saver',
    easy: '/recipe/easy-todo',
    mostRated: '/recipe/most-rated'
  }

  set model (model: any) {
    this._model = model
    Vue.set(this._model, 'loading', false)
    Vue.set(this._model, 'result', null)
  }

  async getRandomRecipe (): Promise<any> {
    Vue.set(this._model, 'loading', true)

    const [error, response] = await to(axios.request({
      url: this.BASE_URL + this._apis.random
    }))

    if (!error) {
      const recipes: Array<Recipe> = []

      response.data.forEach((recipe: Recipe) => {
        recipes.push(recipe)
      })

      Vue.set(this._model, 'result', recipes)
    }

    Vue.set(this._model, 'loading', false)
  }

  async getMostRatedRecipes (): Promise<any> {
    Vue.set(this._model, 'loading', true)

    const [error, response] = await to(axios.request({
      url: this.BASE_URL + this._apis.mostRated
    }))

    if (!error) {
      const recipes: Array<Recipe> = []

      response.data.forEach((recipe: Recipe) => {
        recipes.push(recipe)
      })

      Vue.set(this._model, 'result', recipes)
    }

    Vue.set(this._model, 'loading', false)
  }
}

// export interface ResponceData
export default new RecipeApi()
