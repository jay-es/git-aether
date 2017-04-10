<template>
  <table class="repos-table">
    <thead>
      <th>Path</th>
      <th>Local Branches</th>
      <th>Remote-Tracking Branches</th>
      <th>Commands</th>
      <th>Log</th>
    </thead>
    <tbody>
      <tr v-for="(row, rowIndex) in tableData">
        <td>
          <path-name
            :row="row"
          >
          </path-name>
        <td>
          <local-branch-list
            :row="row"
            @update="getBranch(rowIndex)"
          >
          </local-branch-list>
        </td>
        <td>
          <tracking-branch-list
            :row="row"
          >
          </tracking-branch-list>
        </td>
        <td>
          <command-list
            :row="row"
          >
          </command-list>
        </td>
        <td>
          <pre class="fetch-log"
            :class="{'is-processing': row.isFetching}"
            @click="fetch(rowIndex)"
          >{{ row.logText }}</pre>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  import store from './scripts/store';
  import PathName from './reposTable/PathName';
  import LocalBranchList from './reposTable/LocalBranchList';
  import TrackingBranchList from './reposTable/TrackingBranchList';
  import CommandList from './reposTable/CommandList';

  export default {
    computed: {
      tableData() { return store.tableData; },
    },
    components: {
      store,
      PathName,
      LocalBranchList,
      TrackingBranchList,
      CommandList,
    },
    // mounted() {
    //   setTimeout(() => {
    //     this.getBranchAll();
    //     this.fetchAll();
    //   }, 300);
    // },
    methods: {
      fetch: store.fetch,
      getBranch: store.getBranch,
    },
  };
</script>
