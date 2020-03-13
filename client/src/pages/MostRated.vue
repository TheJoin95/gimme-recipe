<template>
  <div class="most-rated" v-bind:class="{ mtop5: hasMargin }">
    <div class="most-rated-box">
      <h1>{{ title[type] }}</h1>
      <div class="mode-box">
        <ul class="mode-list">
          <li class="mode" v-bind:class="{ active: type === 'recipe' }">
            <router-link to="/recipe/most-rated"><font-awesome-icon :icon="['fas', 'bread-slice']" /></router-link>
          </li>
          <li class="mode" v-bind:class="{ active: type === 'wine' }">
            <router-link to="/wine/most-rated"><font-awesome-icon :icon="['fas', 'wine-glass-alt']" /></router-link>
          </li>
          <li class="mode" v-bind:class="{ active: type === 'cocktail' }">
            <router-link to="/cocktail/most-rated"><font-awesome-icon :icon="['fas', 'cocktail']" /></router-link>
          </li>
        </ul>
      </div>
    </div>
    <transition
      name="custom-classes-transition"
      enter-active-class="animated tada"
      leave-active-class="animated bounceOutRight"
    >
      <div v-if="resultData.length > 0 && showResult === true">
        <result v-bind:data=" resultData "></result>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import RecipeApi from '../services/RecipeApi'
import CocktailApi from '../services/CocktailApi'
import WineApi from '../services/WineApi'

export default Vue.extend({
  name: 'MostRated',

  data () {
    return {
      title: {
        recipe: 'Most Rated Recipes',
        wine: 'Most Rated Wines',
        cocktail: 'Most Rated Cocktails'
      },
      showMagicItem: true,
      showResult: false,
      hasMargin: true,
      type: this.$route.path.split('/')[1],
      adapters: {
        'recipe': RecipeApi,
        'cocktail': CocktailApi,
        'wine': WineApi
      },
      content: {
        result: [],
        loading: false as boolean
      },
      resultData: []
    }
  },

  mounted () {
    this.adapters[this.type].model = this.content
    this.adapters[this.type].getMostRated()
  },

  methods: {
    hideResult: function () {
      this.showResult = false
      this.showMagicItem = true
      this.hasMargin = true
    },

    setResultData: function (data) {
      var self = this
      this.resultData = data === null ? [] : data
      setTimeout(function () {
        self.showResult = true
        self.showMagicItem = false
        self.hasMargin = false
      }, 2500)
    }
  },

  watch: {
    $route () {
      this.type = this.$route.path.split('/')[1]
      this.adapters[this.type].model = this.content
      this.adapters[this.type].getMostRated()
    },
    'content.loading' (loading) {
      if (!loading) {
        this.resultData = this.content.result
        this.showResult = true
        // this.$parent.setResultData(this.content.result)
      }
    }
  },

  metaInfo () {
    return {
      title: 'MostRated',

      meta: [
        { vmid: 'ogtitle', property: 'og:title', itemprop: 'name', content: 'MostRated' },
        { vmid: 'description', name: 'description', content: 'Gimme Recipe - A recipe generator written javascript' },
        { vmid: 'ogdescription', property: 'og:description', content: 'Gimme Recipe - A recipe generator written javascript' }
      ]
    }
  }
})
</script>

<style lang="scss">
@import '~node-reset-scss/scss/reset';
@import '../mixins/animations';
@import '../mixins/mixins';

.mtop5 {
  margin-top: 5vh;
}

.most-rated {
  text-align: center;

  .most-rated-box h1 {
    font-size: 2.8em;
    color: #1f2121;
  }

  .most-rated-box p {
    font-style: italic;
    color: #a0a0a0;
    margin: 0.5em 0 2em;
  }

  .retry-button {
    @include reset-outline;
    @include reset-button;

    background: #ffa749;
    border: none;
    padding: 1rem 1rem;
    color: #fff;
    border-radius: 4em;
    position: absolute;
    font-size: 1.3em;
    right: 0.3em;
    top: 1.3em;
    z-index: 2;
  }

  ul.mode-list li {
    display: inline-block;
    margin: 0 5px;
  }

  ul.mode-list li::after {
    content: " ";
    padding: 0 5px;
    border-right: 1px solid #ccc;
  }

  ul.mode-list li:last-child::after {
    display: none;
  }

  ul.mode-list li a {
    color: #666;
    padding: 10px 5px 10px 5px;
  }

  ul.mode-list li.active a {
    color: #ffa749;
  }
}
</style>
