<template>
  <div class="rest-api">
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ChuckNorrisApi from '@/services/ChuckNorrisApi'

export default Vue.extend({
  name: 'RestAPI',

  data () {
    return {
      selectedCategory: null,

      quotes: {
        searchResult: [] as Array<string>,
        categories: [] as Array<string>,
        loading: false as boolean,
        random: '' as string
      }
    }
  },

  methods: {
    getCategoryQuote (category: string) {
      this.quotes[category] = '' as string
      ChuckNorrisApi.getCategoryQuote(category)
    },

    searchQuotes (query: string) {
      ChuckNorrisApi.search(query)
    }
  },

  created () {
    ChuckNorrisApi.model = this.quotes

    ChuckNorrisApi.getRandomQuote()
    ChuckNorrisApi.getCategories()

    this.getCategoryQuote('movie')
    this.searchQuotes('food')
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
