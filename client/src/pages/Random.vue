<template>
  <div class="random" v-bind:class="{ mtop5: hasMargin }">
    <button v-if="showMagicItem === false" v-on:click="hideResult()" class="retry-button"><font-awesome-icon :icon="['fas', 'redo']" /></button>
    <div v-if="showMagicItem === true" class="random-box">
      <h1>{{ title[type] }}</h1>
      <p>{{ subtitle[type] }}</p>
      <magic-item v-bind:type=" type "></magic-item>
    </div>
    <transition
      name="custom-classes-transition"
      enter-active-class="animated tada"
      leave-active-class="animated bounceOutRight"
    >
      <result v-if="resultData.length > 0 && showResult === true" v-bind:data=" resultData "></result>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import RecipeApi, { Recipe } from '../services/RecipeApi'

export default Vue.extend({
  name: 'Random',

  data () {
    return {
      title: {
        recipe: 'Shake the Magic Salad',
        wine: 'Bottle game time!',
        cocktail: 'Mojito Sensei'
      },
      subtitle: {
        recipe: 'By shaking you will get the recipe',
        wine: 'By shaking you will get the right wine',
        cocktail: 'By shaking you will get the best cocktail'
      },
      showMagicItem: true,
      showResult: false,
      hasMargin: true,
      type: this.$route.path.split('/')[1],
      resultData: [] as Array<Recipe>
    }
  },

  methods: {
    hideResult: function () {
      this.showResult = false
      this.showMagicItem = true
      this.hasMargin = true
    },

    setResultData: function (data) {
      var self = this
      this.resultData = (data === null) ? [] : data
      setTimeout(function () {
        self.showResult = true
        self.showMagicItem = false
        self.hasMargin = false
      }, 2500)
    }
  },

  metaInfo () {
    return {
      title: 'Random',

      meta: [
        { vmid: 'ogtitle', property: 'og:title', itemprop: 'name', content: 'Random' },
        { vmid: 'description', name: 'description', content: 'A Vue/TypeScript boilerplate Home Page.' },
        { vmid: 'ogdescription', property: 'og:description', content: 'A Vue/TypeScript boilerplate Home Page.' }
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

.random {
  text-align: center;

  .random-box h1 {
    font-size: 2.8em;
    color: #1f2121;
  }

  .random-box p {
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
}
</style>
