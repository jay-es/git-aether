<template>
  <div class="diff-view">
    <div class="diff-view_row">
      <file-list class="diff-view_column"
        :current-file="currentFile"
        :row="row"
        @changeStaged="v => hasStaged = v"
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
        :has-staged="hasStaged"
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

  const options = Object.assign({
    ignoreWhitespace: '',
    outputFormat: 'side-by-side',
    tabSize: 4,
  }, JSON.parse(localStorage.getItem('diffOptions')));

  export default {
    name: 'diff-page',
    props: ['rowIndex'],
    components: {
      Commit,
      Screen,
      Options,
      FileList,
    },
    data() {
      return {
        options,
        currentFile: {
          path: '',
          isCached: false,
          isNewFile: false,
          timestamp: 0,
        },
        hasStaged: false,
      };
    },
    computed: {
      row() {
        return store.tableData[this.rowIndex];
      },
    },
    watch: {
      options: {
        handler(v) {
          localStorage.setItem('diffOptions', JSON.stringify(v));
        },
        deep: true,
      },
    },
  };
</script>

<style lang="scss">
.diff-view {
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
