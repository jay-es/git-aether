<template>
  <div class="diff-view_screen" :class="tabClass" ref="screen" />
</template>

<script>
  const { dialog } = require('electron').remote;

  export default {
    props: ['currentFile', 'options', 'row'],
    data() {
      return {
        diffText: '',
      };
    },
    computed: {
      tabClass() {
        return `tab-size-${this.options.tabSize}`;
      },
    },
    methods: {
      generateDiff() {
        // ファイルがなければクリア
        if (!this.currentFile.path) {
          this.$set(this, 'diffText', 'No Diff');
          return;
        }

        // 新規ファイルの場合
        if (this.currentFile.isUntracked) {
          this.row.rep.raw(['add', '-N', this.currentFile.path], () => {
            this.row.rep.raw(['reset', 'HEAD', this.currentFile.path]);
          });
        }

        const options = [
          'diff',
          this.currentFile.isCached ? '--cached' : null,
          this.options.ignoreWhitespace ? `-${this.options.ignoreWhitespace}` : null,
          '--',
          this.currentFile.path,
        ].filter(v => v !== null);

        this.row.rep.raw(options, (err, data) => {
          if (err) { dialog.showErrorBox('', err); return; }

          this.$set(this, 'diffText', data || 'No Diff');
        });
      },
      renderDiff() {
        // スクロール位置をリセット
        this.$refs.screen.scrollTop = 0;
        this.$refs.screen.scrollLeft = 0;

        // Diffを描画
        const diff2htmlUi = new window.Diff2HtmlUI({ diff: this.diffText });
        diff2htmlUi.draw('.diff-view_screen', {
          outputFormat: this.options.outputFormat,
          synchronisedScroll: true,
        });
        diff2htmlUi.highlightCode('.diff-view_screen');
      },
    },
    watch: {
      currentFile: {
        handler: 'generateDiff',
        deep: true,
      },
      'options.ignoreWhitespace': 'generateDiff',

      diffText: 'renderDiff',
      'options.outputFormat': 'renderDiff',
    },
  };
</script>

<style lang="scss">
.diff-view_screen {
  position: relative;
  background-color: var(--diff-bgColor);
  border: 1px solid var(--borderColor);
  overflow: auto;
}

.tab-size- {
  &2 { tab-size: 2; }
  &4 { tab-size: 4; }
  &8 { tab-size: 8; }
}
</style>
