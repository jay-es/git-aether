<template>
  <div class="diff-view">
    <div class="diff-view_row">
      <file-list class="diff-view_column"
        :current-file="currentFile"
        :row="row"
      ></file-list>
      <screen class="diff-view_column"
        :current-file="currentFile"
        :options="options"
        :row="row"
      ></screen>
    </div>
    <div class="diff-view_row">
      <options class="diff-view_column"
        :options="options"
      ></options>
      <commit class="diff-view_column"
        :current-file="currentFile"
        :row="row"
      ></commit>
    </div>
  </div>
</template>

<script>
  import store from './LandingPageView/scripts/store';
  import Commit from './DiffView/Commit';
  import Screen from './DiffView/Screen';
  import Options from './DiffView/Options';
  import FileList from './DiffView/FileList';

  export default {
    props: ['rowIndex'],
    components: {
      Commit,
      Screen,
      Options,
      FileList,
    },
    data() {
      return {
        currentFile: {
          path: '',
          isCached: false,
        },
        options: {
          ignoreWhitespace: '',
          tabSize: 4,
        },
      };
    },
    computed: {
      row() {
        return store.tableData[this.rowIndex];
      },
    },
    name: 'diff-page',
  };
</script>

<style lang="scss">
.diff-view {
  // display: flex;
  // flex-direction: column;
  height: calc(100vh - 16px);
}
.diff-view_row {
  display: flex;

  &:nth-child(odd) {
    flex-grow: 1;
    padding-bottom: .5em;
    height: calc(100vh - 16px - 82px - .5em);
  }
  &:nth-child(even) {
    height: 82px;
  }
}
.diff-view_column {
  &:nth-child(odd) {
    flex-basis: 20%;
    min-width: 200px;
  }
  &:nth-child(even) {
    flex-grow: 1;
  }
}
</style>
