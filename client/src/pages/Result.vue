<template>
  <div class="result">
    <div class="result-box">
      <h1>Result</h1>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Result',

  metaInfo () {
    return {
      title: 'Result',

      meta: [
        { vmid: 'ogtitle', property: 'og:title', itemprop: 'name', content: 'Result' },
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

.result {
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
}
</style>
