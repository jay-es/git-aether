<template>
  <div v-if="tableData.length">
    <create-branch
      ref="createBranch"
      :row="tableData[rowIndex]"
    ></create-branch>
    <merge-branch
      ref="mergeBranch"
      :row="tableData[rowIndex]"
      :branch-name="branchName"
    ></merge-branch>
    <rename-branch
      ref="renameBranch"
      :row="tableData[rowIndex]"
      :branch-name="branchName"
    ></rename-branch>
  </div>
</template>

<script>
  import eventHub from './scripts/eventHub';
  import store from './scripts/store';
  import CreateBranch from './Dialogs/CreateBranch';
  import MergeBranch from './Dialogs/MergeBranch';
  import RenameBranch from './Dialogs/RenameBranch';

  export default {
    computed: {
      tableData() { return store.tableData; },
    },
    components: {
      CreateBranch,
      MergeBranch,
      RenameBranch,
    },
    data() {
      return {
        rowIndex: 0,
        branchName: '',
      };
    },
    methods: {
      createBranch(rowIndex) {
        this.rowIndex = rowIndex;
        this.$refs.createBranch.openDialog();
      },
      mergeBranch(rowIndex, branchName) {
        this.rowIndex = rowIndex;
        this.branchName = branchName;
        this.$refs.mergeBranch.openDialog();
      },
      renameBranch(rowIndex, branchName) {
        this.rowIndex = rowIndex;
        this.branchName = branchName;
        this.$refs.renameBranch.openDialog();
      },
    },
    created() {
      eventHub.on('createBranch', this.createBranch);
      eventHub.on('mergeBranch', this.mergeBranch);
      eventHub.on('renameBranch', this.renameBranch);
    },
    destroyed() {
      eventHub.removeListener('createBranch', this.createBranch);
      eventHub.removeListener('mergeBranch', this.mergeBranch);
      eventHub.removeListener('renameBranch', this.renameBranch);
    },
  };
</script>
