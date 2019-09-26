<template>
  <div class="magic-salad">
    <transition appear mode="out-in">
      <img v-on:click="toggleAnimation()" v-bind:class="animationClass" width="300" src="../assets/img/spinning-salad.png" />
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'MagicSalad' as string,

  data: function () {
    return {
      animationClass: '',
      lastX: null,
      lastY: null,
      lastZ: null,
      lastTime: new Date(),
      options: {
        timeout: 3500,
        threshold: 2,
        animationDuration: 6000
      }
    }
  },

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

  methods: {
    toggleAnimation: function (e) {
      var self = this
      var currentTime = new Date()
      var timeDifference = currentTime.getTime() - this.lastTime.getTime()

      if (timeDifference > this.options.timeout) {
        this.lastTime = new Date()
        this.animationClass = 'magic-salad-animation'

        setTimeout(function () {
          self.animationClass = ''
        }, Math.abs(this.options.animationDuration))
      }
    },

    onDeviceMotion: function (e) {
      var current = e.accelerationIncludingGravity || {}

      if (e.accelerationIncludingGravity === null || e.accelerationIncludingGravity === undefined) {
        current.x = e.gamma
        current.y = e.beta
        current.z = e.alpha
      }

      var deltaX = 0
      var deltaY = 0
      var deltaZ = 0

      if ((this.lastX === null) && (this.lastY === null) && (this.lastZ === null)) {
        this.lastX = current.x
        this.lastY = current.y
        this.lastZ = current.z
        return
      }

      deltaX = Math.abs(this.lastX - current.x)
      deltaY = Math.abs(this.lastY - current.y)
      deltaZ = Math.abs(this.lastZ - current.z)

      if (((deltaX > this.options.threshold) && (deltaY > this.options.threshold)) || ((deltaX > this.options.threshold) && (deltaZ > this.options.threshold)) || ((deltaY > this.options.threshold) && (deltaZ > this.options.threshold))) {
        this.toggleAnimation()
        /* currentTime = new Date()
        timeDifference = currentTime.getTime() - this.lastTime.getTime()

        if (timeDifference > this.options.timeout) {
          this.lastTime = new Date()
          this.animationClass = 'magic-salad-animation'

          setTimeout(function () {
            self.animationClass = ''
          }, Math.abs(this.options.animationDuration))
        } */
      }

      this.lastX = current.x
      this.lastY = current.y
      this.lastZ = current.z
    }
  },

  mounted () {
    window.addEventListener('deviceorientation', this.onDeviceMotion, false)
    window.addEventListener('orientationchange', this.onDeviceMotion, false)
    window.addEventListener('devicemotion', this.onDeviceMotion, false)
  },

  beforeDestroy () {
    window.removeEventListener('deviceorientation', this.onDeviceMotion, false)
    window.removeEventListener('orientationchange', this.onDeviceMotion, false)
    window.removeEventListener('devicemotion', this.onDeviceMotion, false)
  }

})
</script>

<style lang="scss">
@import '~node-reset-scss/scss/reset';
@import '../mixins/mixins';
@import '../mixins/animations';

.magic-salad {
  img.magic-salad-animation {
    animation-delay: 0s, 2s;
    animation-duration: 1s, 2s;
    animation-iteration-count: 2, 1;
    animation-name: shake, rotation;

    -webkit-animation-delay: 0s, 2s;
    -webkit-animation-duration: 1s, 2s;
    -webkit-animation-iteration-count: 2, 1;
    -webkit-animation-name: shake, rotation;
  }
}

</style>
