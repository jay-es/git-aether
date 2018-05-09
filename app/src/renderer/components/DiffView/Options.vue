<template>
  <div>
    <section class="inline-block">
      <legend class="legend">Ignore Whitespace</legend>
      <label class="label block">
        <input type="radio" class="radio" value="" v-model="options.ignoreWhitespace" /> None
      </label>
      <label class="label block">
        <input type="radio" class="radio" value="b" v-model="options.ignoreWhitespace" /> Space Change
      </label>
      <label class="label block">
        <input type="radio" class="radio" value="w" v-model="options.ignoreWhitespace" /> All Space
      </label>
    </section>

    <!--
    <section class="inline-block">
      <legend class="legend">Tab Size</legend>
      <label class="label block">
        <input type="radio" class="radio" value="2" v-model="options.tabSize" /> 2
      </label>
      <label class="label block">
        <input type="radio" class="radio" value="4" v-model="options.tabSize" /> 4
      </label>
      <label class="label block">
        <input type="radio" class="radio" value="8" v-model="options.tabSize" /> 8
      </label>
    </section>
    -->

    <section class="inline-block">
      <legend class="legend">Output</legend>
      <label class="label block">
        <input type="radio" class="radio" value="line-by-line" v-model="options.outputFormat" /> Unified
      </label>
      <label class="label block">
        <input type="radio" class="radio" value="side-by-side" v-model="options.outputFormat" /> Split
      </label>
    </section>
  </div>
</template>

<script>
  export default {
    props: ['options'],
  };
</script>

<style lang="scss" scoped>
  .inline-block {
    vertical-align: top;
  }
</style>
