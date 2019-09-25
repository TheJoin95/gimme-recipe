<template>
  <div class="menu">
    <div class="menu-toggle-container">
      <a v-on:click=" isOpen = !isOpen " class="menu-toggle-button">
        <font-awesome-icon :icon="['fas', 'bars']" />
      </a>
    </div>
    <transition appear mode="out-in">
      <div v-if=" isOpen === true " id="nav" class="menu-content-over">
        <button v-on:click=" isOpen = !isOpen " class="menu-close-button">
          <font-awesome-icon :icon="['fas', 'times']" />
          </button>
        <ul class="menu-element-container">
          <li class="menu-element">
            <router-link to="/">
              <font-awesome-icon :icon="['fas', 'home']" />
              <span class="label">Home</span>
            </router-link>
          </li>
          <li class="menu-element">
            <router-link to="/recipe/search">
              <font-awesome-icon :icon="['fas', 'search']" />
              <span class="label">Search</span>
            </router-link>
          </li>
          <li class="menu-element">
            <router-link to="/recipe/gimme-menu">
              <font-awesome-icon :icon="['fas', 'utensils']" />
              <span class="label">Gimme Menu</span>
            </router-link>
          </li>
          <li class="menu-element">
            <router-link to="/recipe/random">
              <font-awesome-icon :icon="['fas', 'random']" />
              <span class="label">Random</span>
            </router-link>
          </li>
          <li class="menu-element">
            <router-link to="/cocktail/random">
              <font-awesome-icon :icon="['fas', 'cocktail']" />
              <span class="label">Get Cocktail</span>
            </router-link>
          </li>
          <li class="menu-element">
            <router-link to="/wine/random">
              <font-awesome-icon :icon="['fas', 'wine-glass-alt']" />
              <span class="label">Get Wine</span>
            </router-link>
          </li>
          <li class="menu-element">
            <router-link to="/recipe/most-rated">
              <font-awesome-icon :icon="['fas', 'heart']" />
              <span class="label">Most Rated</span>
            </router-link>
          </li>
          <li class="menu-element">
            <router-link to="/restApi">
              <font-awesome-icon :icon="['fas', 'user-cog']" />
              <span class="label">Preferences</span>
            </router-link>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Menu" as string,

  data: function() {
    return {
      isOpen: true
    };
  },

  props: {
    language: {
      default: "",
      type: String,
      required: false
    },

    domain: {
      default: "",
      type: String,
      required: false
    }
  },

  mounted() {},
  
  watch: {
    '$route': function(to, from) {
      this.isOpen = false;
    }
  }

});
</script>

<style lang="scss">
@import '~node-reset-scss/scss/reset';
@import '../mixins/mixins';

.menu {

  .menu-toggle-container {
    .menu-toggle-button {
      margin: 0.5em;
      display: inline-block;
      background: #ffa749;
      color: #fff;
      padding: 0.8em 1em;
      border-radius: 0.5em;
      cursor: pointer;
    }
  }

  .menu-content-over {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    background: rgb(255, 167, 73);
    overflow-y: auto;
  }

  .menu-close-button {
    @include reset-button;
    @include pull-right;

    color: rgb(255, 102, 0);
    font-size: 1.5em;
    padding-right: 0.5em;
    padding-top: 0.5em;
  }

  .menu-element-container {
    margin: 4vh 4.5vw;
  }

  .menu-element {
    display: inline-block;
    padding: 4vh 4.5vw;
    margin: 1.7vh 1.3vw;
    width: 31vw;
    background: #ffffff56;
    border-radius: 3.5vw;
    vertical-align: top;
    text-align: center;
    cursor: pointer;

    &:hover,
    &:focus,
    &:active {
      background: #f90;
    }

    a {
      @include reset-outline;

      text-decoration: none;
      color: rgb(255, 102, 0);
    }

    a:hover,
    a:focus,
    a:active {
      color: #cc5711;
    }

    svg {
      font-size: 2.5em;
    }

    .label {
      padding-top: 1em;
      display: block;
    }
  }
}

</style>
