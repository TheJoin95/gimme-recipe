<template>
    <div id="nav" class="menu">
        <ul>
            <li>
                <router-link to="/">
                    <font-awesome-icon :icon="['fas', 'home']" />
                    <span> Home</span>
                </router-link>
            </li>
            <li>
                <router-link to="/recipe/search">
                    <font-awesome-icon :icon="['fas', 'search']" />
                    <span>Search</span>
                </router-link>
            </li>
            <li>
                <router-link to="/restApi">RestAPI
                </router-link>
            </li>
            <li>
                <router-link to="/recipe/random">
                    <font-awesome-icon :icon="['fas', 'random']" />
                    <span>Random</span>
                </router-link>
            </li>
            <li>
                <router-link to="/recipe/gimme-menu">
                    <font-awesome-icon :icon="['fas', 'utensils']" />
                    <span>Gimme Menu</span>
                </router-link>
            </li>
            <li>
                <router-link to="/wine/random">
                    <font-awesome-icon :icon="['fas', 'wine-glass-alt']" />
                    <span>Get Wine</span>
                </router-link>
            </li>
            <li>
                <router-link to="/cocktail/random">
                    <font-awesome-icon :icon="['fas', 'cocktail']" />
                    <span>Get Cocktail</span>
                </router-link>
            </li>
            <li>
                <router-link to="/recipe/most-rated">
                    <font-awesome-icon :icon="['fas', 'heart']" />
                    <span>Most Rated</span>
                </router-link>
            </li>
        </ul>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Menu' as string,

  props: {

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
  }
})
</script>

<style lang="scss">

div#menu {
  position: static;
  top: 0;
  left: 0;
  height: 100%;
}

</style>
