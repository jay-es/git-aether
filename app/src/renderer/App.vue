<template>
  <div id="#app">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  // import store from 'renderer/vuex/store';
  export default {
    // store,
  };
</script>

<style lang="scss">
  @import 'sass/style';

  .fade-enter-active {
    transition: opacity .2s;
  }
  .fade-enter {
    opacity: 0;
  }
</style>
