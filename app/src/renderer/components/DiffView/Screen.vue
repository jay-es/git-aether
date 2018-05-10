<template>
  <div class="diff-view_screen" :class="tabClass" ref="screen">
    <div v-show="isSimple" class="simple-diff" key="simple-diff">
      <template v-for="line of simpleDiffLines">
        <code class="simple-diff-line" :class="line.className">{{ line.text }}</code>
      </template>
    </div>
    <div v-show="!isSimple" class="diff2html" key="diff2html" />
  </div>
</template>

<script>
  const { dialog } = require('electron').remote;

  export default {
    props: ['currentFile', 'options', 'row'],
    data() {
      return {
        diffText: '',
        isSimple: true,
        simpleDiffLines: [],
      };
    },
    computed: {
      tabClass() {
        return 'tab-size-4';
        // return `tab-size-${this.options.tabSize}`;
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

        // 先頭のタブ（もしくはスペース4つ）を削除
        let minTabCount = 1e5;
        const diffLines = this.diffText.split('\n')
          .map(v => v.replace(/^([ +-])( +)/, (match, p1, p2) => p1 + p2.replace(/ {4}/g, '\t')))
          .map((v, i) => {
            const match = v.match(/^[ +-](\t*)[^\t]/);
            if (match && i > 4) {
              minTabCount = Math.min(minTabCount, match[1].length);
            }

            return v;
          })
          .map(v => v.replace(/^([ +-])(\t+)/, (match, p1, p2) => p1 + p2.substr(minTabCount)))
          .join('\n');

        // 量が多い場合は簡易表示
        if (this.diffText.length > 1e5) {
          const classNames = {
            '+': 'ins',
            '-': 'del',
            '@': 'heading',
          };

          this.simpleDiffLines = diffLines.split('\n')
            .map((text) => ({
              text,
              className: classNames[text[0]],
            }));

          this.isSimple = true;
          return;
        }

        // Diffを描画
        const diff2htmlUi = new window.Diff2HtmlUI({ diff: diffLines });
        diff2htmlUi.draw('.diff2html', {
          matching: 'lines',
          outputFormat: this.options.outputFormat,
          synchronisedScroll: true,
        });
        diff2htmlUi.highlightCode('.diff2html');
        this.isSimple = false;
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

.simple-diff {
  margin: .5em;
}
.simple-diff-line {
  display: block;
  white-space: pre;

  &.ins {
    color: var(--diff-fontColor-ins);
  }
  &.del {
    color: var(--diff-fontColor-del);
  }
  &.heading {
    padding-top: 1em;
    opacity: .33;
  }
}
</style>
