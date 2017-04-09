<template>
  <ul class="list command-list">
    <li><a href="#" :title="row.pathName" @click="openGui">Git GUI</a></li>
  </ul>
</template>

<script>
  export default {
    props: ['row'],
    methods: {
      openGui() {
        this.row.rep.raw(['gui']);
      },
    },
  };
</script>
