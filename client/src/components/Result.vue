<template>
  <div class="result">
    <div class="result-list">
      <div class="card" v-for="item in data" v-bind:key="item.url">
        <span
            v-if="item.recipeCategory !== undefined"
            class="card-category"
          >{{ item.recipeCategory.toUpperCase() }}</span>
        <img
          class="card-image"
          v-if="item.image !== undefined && item.image !== '' && item.image !== null"
          v-lazy="item.image"
        />
        <button class="card-goto-button" v-on:click="openLink(item.url)">
          <font-awesome-icon :icon="['fas', 'external-link-alt']" />
          </button>
        <h4 class="card-title">{{ unescape(item.name) }}</h4>
        <p class="card-subtitle">
          <span v-if="item.aggregateRating !== undefined" class="card-rating">
            <font-awesome-icon :icon="['fas', 'star']" />&nbsp;{{ item.aggregateRating.ratingValue }} - <font-awesome-icon :icon="['fas', 'users']" />&nbsp;{{ item.aggregateRating.ratingCount }} reviews
          </span>
          <span v-if="item.totalTime !== undefined" class="card-totaltime">
            <font-awesome-icon :icon="['fas', 'clock']" /> {{ item.totalTime }} min
          </span>
        </p>
        <p class="card-content" v-if="item.description !== undefined">{{ truncate(item.description) }}</p>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import VueLazyload from 'vue-lazyload'
import { truncate } from 'lodash'
import he from 'he'

Vue.use(VueLazyload, {
  error: require('../assets/img/placeholder.png'),
  loading: require('../assets/img/loading.gif')
})

export default Vue.extend({
  name: 'Result' as string,

  data: function () {
    return {
      result: this.data
    }
  },

  methods: {
    unescape: function (tounescape) {
      return he.decode(tounescape)
    },

    truncate: function (phrase) {
      return truncate(phrase, {
        length: 200
      })
    },

    openLink: function (link) {
      window.open(link)
    }
  },

  props: {
    data: {
      default: null,
      type: Array,
      require: true
    },
    type: {
      default: 'recipe',
      type: String,
      require: true
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
  }
})
</script>

<style lang="scss">
@import "~node-reset-scss/scss/reset";
@import "../mixins/mixins";
@import "../mixins/animations";

.result-list {
  -webkit-transition: -webkit-box-shadow 0.25s;
  transition: -webkit-box-shadow 0.25s;
  transition: box-shadow 0.25s;
  transition: box-shadow 0.25s, -webkit-box-shadow 0.25s;
  padding: 24px;
  margin: 0.5rem 0 1rem 0;
  border-radius: 2px;
  background-color: #fff;
  border-top-right-radius: 3em;
  border-top-left-radius: 3em;
  border-bottom-right-radius: 3em;
  border-bottom-left-radius: 3em;
  padding-top: 5vh;

  overflow: auto;
}

.card {
  position: relative;
  margin: 1rem 0 1rem 0;
  background-color: rgba(255, 255, 255, 0.8);
  -webkit-transition: -webkit-box-shadow 0.25s;
  transition: -webkit-box-shadow 0.25s;
  transition: box-shadow 0.25s;
  transition: box-shadow 0.25s, -webkit-box-shadow 0.25s;
  border-radius: 2px;
  box-shadow: 3px 1px 6px 0px rgba(158, 158, 158, 0.8);

  &:hover,
  &:active,
  &:focus {
    opacity: 0.9;
    transition: opacity 0.8s;
    box-shadow: 3px 1px 6px 0px rgba(90, 90, 90, 0.8);
  }

  .card-category {
    position: absolute;
    z-index: 2;
    left: 0.5rem;
    top: 0.5rem;
    background: #ffa749;
    padding: 5px 10px;
    border-radius: 5px;
    color: #fff;
    font-weight: bold;
  }

  .card-title {
    font-size: 25px;
    font-weight: 300;
    margin-top: 10px;
  }

  .card-subtitle {
    font-size: smaller;
    color: #666;
  }

  .card-image {
    max-height: 60%;
    overflow: hidden;
    display: block;
    border-radius: 2px 2px 0 0;
    position: relative;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
  }

  .card-goto-button {
    @include reset-outline;
    @include reset-button;

    background: #ffa749;
    border: none;
    padding: 1rem 1rem;
    color: #fff;
    border-radius: 4em;
    position: absolute;
    margin-top: -9vh;
    font-size: 1.3em;
    right: 0.3em;
  }

  .card-action {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
    background-color: inherit;
    border-top: 1px solid rgba(160, 160, 160, 0.2);
    padding: 16px 24px;
  }

  .card-content {
    padding: 24px;
    border-radius: 0 0 2px 2px;
    max-height: 100%;
    overflow: hidden;
    font-style: italic;

    p {
      margin: 0;
      color: #444;
      font-style: italic;
    }

    .card-title {
      display: block;
      line-height: 32px;
      margin-top: 10px;
    }
  }

  .card-image + .card-content {
    max-height: 40%;
  }
}
</style>
