<template>
  <div class="random" v-bind:class="{ mtop13: hasMargin }">
    <div v-if="showMagicItem === true" class="random-box">
      <h1>Shake the Magic Salad</h1>
      <p>By shaking you will get the recipe</p>
      <magic-item v-bind:type=" type "></magic-item>
    </div>
    <transition appear mode="out-in">
      <result v-if="resultData.length > 0 && showResult === true" v-bind:data=" resultData "></result>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import RecipeApi, { MostRated } from '../services/RecipeApi'

export default Vue.extend({
  name: 'Random',

  data () {
    return {
      showMagicItem: true,
      showResult: false,
      hasMargin: true,
      type: this.$route.path.split('/')[1],
      resultData: [] as Array<MostRated>
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
      this.resultData = data
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

.mtop13 {
  margin-top: 13vh;
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
}
</style>
