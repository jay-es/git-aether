<template>
  <table class="table repos-table">
    <thead>
      <th>Path</th>
      <th>Local Branches</th>
      <th>Remote-Tracking Branches</th>
      <th>Commands</th>
      <th>Log</th>
    </thead>
    <tbody :data-rows="tableData.length">
      <tr v-for="(row, rowIndex) in tableData">
        <td>
          <path-name
            class="cell"
            :row="row"
          >
          </path-name>
        <td>
          <local-branch-list
            class="cell"
            :row="row"
            @update="getBranch(rowIndex)"
          >
          </local-branch-list>
        </td>
        <td>
          <tracking-branch-list
            class="cell"
            :row="row"
          >
          </tracking-branch-list>
        </td>
        <td>
          <command-list
            class="cell"
            :row="row"
            :command-list="commandList"
          >
          </command-list>
        </td>
        <td>
          <pre
            class="fetch-log cell"
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
      commandList() { return store.commandList; },
    },
    components: {
      store,
      PathName,
      LocalBranchList,
      TrackingBranchList,
      CommandList,
    },
    methods: {
      fetch: store.fetch,
      getBranch: store.getBranch,
    },
  };
</script>

<style lang="scss">
.repos-table {
  td {
    padding: 0;
  }

  .cell {
    padding: 4px 8px;
    margin: 0;
    overflow-y: auto;
    box-sizing: border-box;
    min-height: 4em;
  }

  @for $i from 1 through 20 {
    [data-rows="#{$i}"] .cell { height: calc(((100vh - 54px) / #{$i}) - 1px); }
  }
  .changes {
    display: inline-block;
    margin-bottom: 0;
  }

  .local-branch-list,
  .tracking-branch-list {
    word-break: break-word;
  }

  .local-branch-list > li {
    &.is-current {
      color: var(--fontColor-deep);
      font-weight: 500;
      text-decoration: underline;
    }
    &:not(.is-current) {
      cursor: pointer;
    }
    &:hover {
      color: var(--fontColor-deep);
    }
  }

  .fetch-log {
    min-width: 12em;
  }
}
</style>
