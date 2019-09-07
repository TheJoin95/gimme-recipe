<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<script lang="ts">
export default Vue.extend({
  name: 'About' as string,

  created () {
    console.log('About Page')
  },

  metaInfo () {
    return {
      title: 'About',

      meta: [
        { vmid: 'ogtitle', property: 'og:title', itemprop: 'name', content: 'About Page' },
        { vmid: 'description', name: 'description', content: 'A Vue/TypeScript boilerplate About Page.' },
        { vmid: 'ogdescription', property: 'og:description', content: 'A Vue/TypeScript boilerplate About Page.' }
      ]
    }
  }
})
</script>
