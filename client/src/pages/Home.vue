<template>
  <div class="home">
    <div class="home-box">
      <h1>Gimme Recipe</h1>
      <p><small>Help you find out the best recipes</small></p>
      <router-link to="/recipe/random">
        <button class="home-button">Gimme Recipe</button>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Home',

  metaInfo () {
    return {
      title: 'Home',

      meta: [
        { vmid: 'ogtitle', property: 'og:title', itemprop: 'name', content: 'Home Page' },
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

.home {
  .home-box {
    text-align: center;
    margin-top: 13vh;

    h1 {
      font-size: 2.8em;
      color: #1f2121;
    }

    p {
      font-style: italic;
      color: #a0a0a0;
      margin: 0.5em 0 2em;
    }

    button {
      @include reset-button;
      @include reset-outline;

      color: #fff;
      background: #ffa749;
      padding: 1.8vh 3vw;
      width: 50%;
      border-radius: 3em;
      text-transform: uppercase;
    }
  }
}
</style>
