<template>
  <div class="diff-view_file-list">
    <p class="diff-view_file-list_title">Unstaged Changes</p>
    <ul class="list diff-view_file-list_list">
      <li v-for="(file, i) of files" v-show="file.hasUnstaged">
        <a class="file-status" @click="stage(file, i)">{{ file.working_dir }}</a>
        <span class="path-wrap"
          :class="{ 'is-current': file.path === currentFile.path && !currentFile.isCached }"
          :title="file.path"
          @click="setCurrent(file, false)"
          @contextmenu="menu(file, i)"
        >
          <span class="path-name">{{ file.pathName }}</span><span class="file-name">{{ file.fileName }}</span>
        </span>
      </li>
    </ul>

    <div class="diff-view_file-list_buttons">
      <a @click="stageAll">↓ Stage All</a>&emsp;
      <a @click="unstageAll">↑ Unstage All</a>
    </div>

    <p class="diff-view_file-list_title">Staged Changes (Will Commit)</p>
    <ul class="list diff-view_file-list_list">
      <li v-for="(file, i) of files" v-show="file.hasStaged">
        <a class="file-status" @click="unstage(file, i)">{{ file.index }}</a>
        <span class="path-wrap"
          :title="file.path"
          :class="{ 'is-current': file.path === currentFile.path && currentFile.isCached }"
          @click="setCurrent(file, true)"
          @contextmenu="menu(file, i)"
        >
          <span class="path-name">{{ file.pathName }}</span><span class="file-name">{{ file.fileName }}</span>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
  const { dialog } = require('electron').remote;
  import fileListMenu from './scripts/fileListMenu';

  export default {
    props: ['currentFile', 'row'],
    data() {
      return {
        files: [],
      };
    },
    methods: {
      setCurrent(file, isCached) {
        this.currentFile.path = file.path;
        this.currentFile.isCached = isCached;
        this.currentFile.isNewFile = file.index === '?';
      },

      menu(file, i) {
        fileListMenu(file, i, this);
      },

      stage(file, i) {
        file.hasStaged = true;
        file.hasUnstaged = false;
        this.row.rep.raw(['add', file.path], (err) => {
          if (err) { dialog.showErrorBox('', err); return; }

          this.getStatus(file, i).then(() => {
            if (file.path !== this.currentFile.path) return;
            this.setCurrent(this.files[i], true);
          });
        });
      },
      unstage(file, i) {
        file.hasStaged = false;
        file.hasUnstaged = true;
        this.row.rep.raw(['reset', 'HEAD', file.path], (err) => {
          if (err) { dialog.showErrorBox('', err); return; }

          this.getStatus(file, i).then(() => {
            if (file.path !== this.currentFile.path) return;
            this.setCurrent(this.files[i], false);
          });
        });
      },

      stageAll() {
        this.row.rep.raw(['add', '-A'], (err) => {
          if (err) { dialog.showErrorBox('', err); return; }

          this.getStatusAll().then(() => {
            this.files.forEach((file, i) => {
              if (file.path !== this.currentFile.path) return;
              this.setCurrent(this.files[i], true);
            });
          });
        });
      },
      unstageAll() {
        this.row.rep.raw(['reset', 'HEAD'], (err) => {
          if (err) { dialog.showErrorBox('', err); return; }

          this.getStatusAll().then(() => {
            this.files.forEach((file, i) => {
              if (file.path !== this.currentFile.path) return;
              this.setCurrent(this.files[i], false);
            });
          });
        });
      },

      getStatus(file, i) {
        return this.row.rep.raw(['status', '--short', '-u', file.path], (err, data) => {
          if (err) { dialog.showErrorBox('', err); return; }

          this.$set(this.files, i, this.getStatusInner(data));
        });
      },
      getStatusAll() {
        return this.row.rep.raw(['status', '--short', '-u'], (err, data) => {
          if (err) { dialog.showErrorBox('', err); return; }

          // データがなければ空の配列をセット
          if (!data) {
            this.$set(this, 'files', []);
            return;
          }

          this.$set(this, 'files', data.split('\n')
            .filter(v => v)
            .map(this.getStatusInner)
            .sort((a, b) => (a.path.toLowerCase() > b.path.toLowerCase() ? 1 : -1))
          );
        });
      },
      getStatusInner(line) {
        const index = line.substr(0, 1);
        const workingDir = line.substr(1, 1);
        const path = line.substr(3).trim();

        const tmpObj = {
          index,
          path,
          working_dir: workingDir,
          pathName: '',
          fileName: path,
          hasUnstaged: workingDir !== ' ',
          hasStaged: (index !== ' ' && index !== '?'),
        };

        const lastIndex = path.lastIndexOf('/');
        if (lastIndex !== -1) {
          tmpObj.pathName = path.substr(0, lastIndex);
          tmpObj.fileName = path.substr(lastIndex);
        }

        return tmpObj;
      },
    },
    created() {
      this.$watch('row.statusSummary.files', this.getStatusAll, {
        deep: true,
        immediate: true,
      });
      this.$watch('files', () => {
        this.$emit('changeStaged', this.files.some(v => v.hasStaged));
      }, {
        deep: true,
        immediate: true,
      });
    },
  };
</script>

<style lang="scss">
@import "../../sass/_theme";

.diff-view_file-list {
  display: flex;
  flex-direction: column;
}

.diff-view_file-list_title {
  margin: 0 0 .25em;
}

.diff-view_file-list_list {
  flex-grow: 1;
  overflow-x: hidden;
  overflow-y: auto;
}
.diff-view_file-list_list > li {
  position: relative;

  &:not(:last-child) {
    margin-bottom: 0;
  }
}

.file-status {
  display: inline-block;
  flex-shrink: 0;
  margin-right: .25em;
  width: 1em;
  text-align: center;
  cursor: pointer;
}
.path-wrap {
  display: inline-flex;
  width: 100%;
  max-width: calc(100% - 30px);
  cursor: pointer;
  vertical-align: top;

  &.is-current::before {
    @extend %diff-bgColor;
    content: '';
    position: absolute;
    top: 2px;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
  }
  &.is-current::after {
    content: '▶';
    position: absolute;
    top: 0;
    right: -1px;
    bottom: 0;
    margin: auto;
    height: 1em;
    font-size: 8px;
    line-height: 1;
  }
  &:hover .file-name {
    text-decoration: underline;
  }
}
.path-name {
  opacity: .75;
  overflow: hidden;
  text-overflow: ellipsis;
}
.file-name {
  font-weight: 600;
  white-space: nowrap;
}

.diff-view_file-list_buttons {
  margin: .75em 0;
  padding-right: 1em;
  text-align: center;
}
</style>
