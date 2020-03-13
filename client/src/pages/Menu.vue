<template>
  <div class="gimme-menu">
    <h1>Gimme menu</h1>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Menu',

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
      title: 'Menu Page',

      meta: [
        { vmid: 'ogtitle', property: 'og:title', itemprop: 'name', content: 'Menu' },
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

.gimme-menu {
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
