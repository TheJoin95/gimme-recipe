<template>
  <div class="search">
    <h1>Search</h1>
    <form>
      <div class="title-box">
        <input type="text" name="q" placeholder="Type here" />
      </div>
      <div class="mode-box">
        <label>
          <font-awesome-icon :icon="['fas', 'bread-slice']" />
          <input type="radio" name="type" value="recipe" />
        </label>
        <label>
          <font-awesome-icon :icon="['fas', 'wine-glass-alt']" />
          <input type="radio" name="type" value="wine" />
        </label>
        <label>
          <font-awesome-icon :icon="['fas', 'cocktail']" />
          <input type="radio" name="type" value="cocktail" />
        </label>
      </div>
      <button>Search</button>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Search',

  data: function () {
    return {
      data: []
    }
  },

  created () {
    console.log(this.$root.data)
  },

  metaInfo () {
    return {
      title: 'Search Page',

      meta: [
        { vmid: 'ogtitle', property: 'og:title', itemprop: 'name', content: 'Search' },
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

.search {
  text-align: center;
  margin-top: 0vh;

  h1 {
    font-size: 2.8em;
    color: #1f2121;
  }

  p {
    font-style: italic;
    color: #a0a0a0;
    margin: 0.5em 0 2em;
  }
}
</style>
