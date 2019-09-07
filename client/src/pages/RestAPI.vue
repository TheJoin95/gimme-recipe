<template>
  <div class="rest-api">
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import RecipeApi, { MostRated } from '@/services/RecipeApi'

// console.log(MostRated)

export default Vue.extend({
  name: 'RestAPI',

  data () {
    return {
      recipes: {
        mostRated: [] as Array<MostRated>,
        loading: false as boolean
      }
    }
  },

  watch: {
    'recipes.loading' (loading) {
      if (!loading) {
        console.log(this.recipes.mostRated)
      }
    }
  },

  // methods: {
  // },

  created () {
    RecipeApi.model = this.recipes
    RecipeApi.getMostRatedRecipes()
  },

  metaInfo () {
    return {
      title: 'RestAPI',

      meta: [
        { vmid: 'ogtitle', property: 'og:title', itemprop: 'name', content: 'Rest API Page' },
        { vmid: 'description', name: 'description', content: 'A Vue/TypeScript boilerplate Rest API Page.' },
        { vmid: 'ogdescription', property: 'og:description', content: 'A Vue/TypeScript boilerplate Rest API Page.' }
      ]
    }
  }
})
</script>
