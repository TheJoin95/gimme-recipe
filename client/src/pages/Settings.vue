<template>
  <div class="settings">
    <h1>Settings</h1>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Settings',

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
      title: 'Settings Page',

      meta: [
        { vmid: 'ogtitle', property: 'og:title', itemprop: 'name', content: 'Settings' },
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

.settings {
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
