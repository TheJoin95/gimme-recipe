<template>
  <div id="app">
    <spinner v-show="showSpinner"></spinner>
    <link href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1" rel="stylesheet" type="text/css">
    <Menu></Menu>
    <transition appear mode="out-in">
      <router-view class="page" />
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'App' as string,

  data () {
    return {
      showSpinner: false,
      result: []
    }
  },

  props: {
    version: {
      type: String,
      required: true
    },

    language: {
      default: '',
      type: String,
      required: false
    },

    domain: {
      default: '',
      type: String,
      required: false
    }
  },

  created () {
    if (this.$workbox) {
      this.$workbox.addEventListener('waiting', () => {
        this.showUpgradeUI = true
      })
    }
  },

  methods: {
    async accept () {
      this.showUpgradeUI = false
      await this.$workbox.messageSW({ type: 'SKIP_WAITING' })
    }
  },

  watch: {
    $route () {
      this.showSpinner = true
      const self = this

      setTimeout(() => {
        self.showSpinner = false
      }, 400)
    }
  },

  metaInfo () {
    return {
      title: ' ',
      titleTemplate: '%s | Gimme Recipe',
      htmlAttrs: { lang: this.$language.current },

      meta: [
        // Generic meta tags:
        { name: 'fragment', content: '!' },
        { name: 'theme-color', content: '#4DBA87' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'msapplication-tap-highlight', content: 'no' },
        { name: 'msapplication-TileColor', content: '#4DBA87' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },

        // Twitter meta tags:
        { name: 'twitter:site', content: '' },
        { name: 'twitter:creator', content: '' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { vmid: 'twitterimage', property: 'twitter:image', content: `${this.domain}/img/share.jpg` },
        { vmid: 'description', name: 'description', content: 'Gimme Recipe - A recipe generator written javascript' },

        // Facebook meta tags:
        { vmid: 'ogtype', property: 'og:type', content: 'website' },
        { vmid: 'ogurl', property: 'og:url', content: `${this.domain}/` },
        { vmid: 'ogimagewidth', property: 'og:image:height', content: '630' },
        { vmid: 'ogimageheight', property: 'og:image:width', content: '1200' },
        { vmid: 'ogtitle', property: 'og:title', itemprop: 'name', content: '' },
        { vmid: 'ogimagetype', property: 'og:image:type', content: 'image/jpeg' },
        { vmid: 'ogimage', property: 'og:image', content: `${this.domain}/img/share.jpg` },
        { vmid: 'ogdescription', property: 'og:description', content: 'Gimme Recipe - A recipe generator written javascript' }
      ]
    }
  }
})
</script>

<style lang="scss">
@import '~node-reset-scss/scss/reset';

/*
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";
*/

@import '../mixins/variables';
@import '../mixins/fonts';

html,
body,
#app {
  font-family: 'White Rabbit', Helvetica, Arial, sans-serif;
  -webkit-text-rendering: optimizeLegibility;
  -webkit-tap-highlight-color: transparent;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  text-rendering: optimizeLegibility;
  font-variant-ligatures: none;
  background-color: $white;
  text-size-adjust: 100%;

  letter-spacing: normal;
  line-height: normal;
  font-kerning: none;

  position: absolute;
  overflow: auto;
  color: $black;

  height: 100%;
  width: 100%;

  padding: 0;
  margin: 0;

  background-image: url("../assets/img/bg-mobile-image-white.jpg");
  background-size: cover;
}

.page {
  box-sizing: border-box;
  position: absolute;
  overflow-y: auto;

  min-height: 100vh;
  max-width: 100%;
  min-width: 100%;

  height: auto;
  width: 100%;

  padding: 0;
  margin: 0;
}

h1 {
  font-size: 2.8em;
  color: #1f2121;
}

em {
  font-style: italic;
}

strong {
  font-weight: bold;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s;
}

.v-enter,
.v-leave-to {
  opacity: 0;
}
</style>
