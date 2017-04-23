<template>
  <div>
    <input type="text" class="input" />
    https://github.com/<input type="text" class="input" placeholder="user/repository" />
    <button class="">↑</button>
    <button class="">↓</button>
    <button class="">Remove</button>

    <div>
      <button class="" @click="back">Back</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'edit-path-page',
    data() {
      return {
      };
    },
    computed: {
    },
    methods: {
      back() {
        this.$router.go(-1);
      },
    },
    created() {
    },
  };
</script>

<style lang="scss">
.input {
  width: 11em
}
</style>
