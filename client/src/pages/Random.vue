<template>
  <div class="random">
    <div class="random-box">
      <h1></h1>
      <p></p>
      <magic-salad></magic-salad>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Random',

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

.random {
  text-align: center;
  margin-top: 13vh;

  p {
    font-style: italic;
    color: #a0a0a0;
    margin: 0.5em 0 2em;
  }
}
</style>
