<template>
  <div class="BranchList">
    <select class="select BranchList_select" :size="ROW_SIZE" @change="update">
      <option
        v-for="branch of row.localBranches"
        v-if="branch.name !== hiddenValue"
        :value="branch.name" :selected="branch.name === initialValue"
      >
        {{ branch.name }}
      </option>
    </select>
    <select
      v-for="i in 10"
      v-show="row.trackingBranches.length > (i - 1) * ROW_SIZE"
      class="select BranchList_select" :size="ROW_SIZE" @change="update"
      :class="{ _last: row.trackingBranches.length < i * ROW_SIZE}"
    >
      <option v-for="branch of row.trackingBranches.slice((i - 1) * ROW_SIZE, i * ROW_SIZE)"
        :value="branch.name" :selected="branch.name === initialValue"
      >
        {{ branch.name }}
      </option>
    </select>
  </div>
</template>

<script>
  export default {
    props: ['row', 'initialValue', 'hiddenValue'],
    data() {
      return {
        ROW_SIZE: 25,
        value: '',
      };
    },
    methods: {
      update($ev) {
        this.$emit('input', $ev.target.value);
      },
    },
  };
</script>

<style lang="scss">
.BranchList {
  min-width: 80vw;
  display: flex;
}
.BranchList_select {
  margin: 0 0 0 -1px;
  flex-grow: 1;
  overflow-y: auto;

  &:first-child {
    border-radius: 3px 0 0 3px;
  }
  &._last {
    border-radius: 0 3px 3px 0;
  }
  &:not(._last) {
    max-width: 25vw;
    overflow-x: auto;
  }
}
</style>
