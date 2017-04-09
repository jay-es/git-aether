<template>
  <ul class="list tracking-branch-list">
    <template v-for="branch in row.trackingBranches">
      <li>{{ branch.name }}</li>
    </template>
  </ul>
</template>

<script>
  export default {
    props: ['row'],
  };
</script>
