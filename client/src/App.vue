<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>

    <transition appear mode="out-in">
      <router-view class="page" />
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'App' as string,

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

  mounted () {
    // Welcome Message
    const welcome: string = this.$gettext('Welcome!')
    // console.log(welcome, this.$language.available, this.$language.current)
  },

  metaInfo () {
    return {
      title: ' ',
      titleTemplate: '%s | Vue Boilerplate',
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
        { vmid: 'description', name: 'description', content: 'A Vue boilerplate written in TypeScript.' },

        // Facebook meta tags:
        { vmid: 'ogtype', property: 'og:type', content: 'website' },
        { vmid: 'ogurl', property: 'og:url', content: `${this.domain}/` },
        { vmid: 'ogimagewidth', property: 'og:image:height', content: '630' },
        { vmid: 'ogimageheight', property: 'og:image:width', content: '1200' },
        { vmid: 'ogtitle', property: 'og:title', itemprop: 'name', content: '' },
        { vmid: 'ogimagetype', property: 'og:image:type', content: 'image/jpeg' },
        { vmid: 'ogimage', property: 'og:image', content: `${this.domain}/img/share.jpg` },
        { vmid: 'ogdescription', property: 'og:description', content: 'A Vue boilerplate written in TypeScript.' }
      ]
    }
  }
})
</script>

<style lang="scss">
@import '~node-reset-scss/scss/reset';
@import 'variables';
@import 'fonts';

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
  overflow: hidden;
  color: $black;

  height: 100%;
  width: 100%;

  padding: 0;
  margin: 0;
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

  left: 0;
  top: 0;
}

// h1 {
// }

// h2 {
// }

// h3 {
// }

// h4 {
// }

// h5 {
// }

// h6 {
// }

// p {
// }

// span {
// }

// a {
// }

em {
  font-style: italic;
}

strong {
  font-weight: bold;
}

// input,
// select,
// button {
// }

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s;
}

.v-enter,
.v-leave-to {
  opacity: 0;
}
</style>
