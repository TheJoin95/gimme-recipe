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

export interface MostRated {
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

  private readonly _apis: Endpoints = {
    mostRated: 'http://10.64.145.156:3000/recipe/most-rated'
  }

  // private isMostRatedKey = (mostRated: MostRated, param: string): param is keyof MostRated => {
  //   return param in mostRated
  // }

  set model (model: any) {
    this._model = model
    Vue.set(this._model, 'loading', false)
    Vue.set(this._model, 'mostRated', null)
  }

  async getMostRatedRecipes (): Promise<any> {
    Vue.set(this._model, 'loading', true)

    const [error, response] = await to(axios.request({
      url: this._apis.mostRated
    }))

    if (!error) {
      const recipes: Array<MostRated> = []
      // console.log(response)
      // Vue.set(this._model, 'mostRated', response.data.value)

      // response.data.forEach((recipe: MostRated, index: number) => {
      //   const mostRatedRecipe: any = {}

      //   Object.keys(recipe).forEach((key: string) => {
      //     console.log(recipe, key, this.isMostRatedKey(recipe, key))
      //     debugger

      //     if (this.isMostRatedKey(recipe, key)) {
      //       // recipes.push(recipe[index])
      //       mostRatedRecipe[key] = recipe[key]
      //     }
      //   })

      //   recipes.push(mostRatedRecipe)
      // })

      response.data.forEach((recipe: MostRated) => {
        recipes.push(recipe)
      })

      // const recipes: Array<MostRated> = Array.from(response.data as Array<MostRated>)
      Vue.set(this._model, 'mostRated', recipes)
    }

    Vue.set(this._model, 'loading', false)
  }
}

// export interface ResponceData
export default new RecipeApi()
