<template>
  <pre class="diff-view_screen" :class="tabClass" ref="screen">
    <div v-for="line of diffLines">
      <code class="diff-line" :class="line.className">{{ line.text }}</code>
    </div>
  </pre>
</template>

<script>
  import fs from 'fs';
  const { dialog } = require('electron').remote;

  export default {
    props: ['currentFile', 'options', 'row'],
    data() {
      return {
        diffText: '',
      };
    },
    computed: {
      diffLines() {
        return this.diffText.split('\n').map((v) => {
          let className = '';
          if (v.charAt(0) === '+') {
            className = 'ins';
          } else if (v.charAt(0) === '-') {
            className = 'del';
          } else if (v.charAt(0) === '@') {
            className = 'heading';
          }

          return {
            className,
            text: v,
          };
        });
      },
      tabClass() {
        return `tab-size-${this.options.tabSize}`;
      },
    },
    methods: {
      generateDiff() {
        // 新規ファイルの場合
        if (this.currentFile.isNewFile) {
          const filePath = `${this.row.rep._baseDir}/${this.currentFile.path}`;
          const text = fs.readFileSync(filePath, 'utf8')
              .split('\n')
              .map(v => `+${v}`)
              .join('\n');
          this.$set(this, 'diffText', text || 'No Diff');
          return;
        }

        const options = ['diff', '--', this.currentFile.path];

        if (this.currentFile.isCached) {
          options.splice(1, 0, '--cached');
        }

        if (this.options.ignoreWhitespace) {
          options.splice(1, 0, `-${this.options.ignoreWhitespace}`);
        }

        this.row.rep.raw(options, (err, data) => {
          if (err) { dialog.showErrorBox('', err); return; }

          this.$set(this, 'diffText', data || 'No Diff');
        });
      },
    },
    watch: {
      diffText() {
        // スクロール位置をリセット
        this.$refs.screen.scrollTop = 0;
        this.$refs.screen.scrollLeft = 0;
      },
    },
    created() {
      this.$watch('options', this.generateDiff, {
        deep: true,
      });
      this.$watch('currentFile', this.generateDiff, {
        deep: true,
      });
    },
  };
</script>

<style lang="scss">
@import "../../sass/_theme";

.diff-view_screen {
  @extend %diff-bgColor;
  padding: .25em 0;
  overflow: auto;
}

.tab-size- {
  &2 { tab-size: 2; }
  &4 { tab-size: 4; }
  &8 { tab-size: 8; }
}

.diff-view_screen > div{
  display: table-row;
}
.diff-line {
  display: table-cell;
  margin: 0;
  padding: 0 .5em;

  &.ins {
    @extend %diff-bgColor-ins;
    @extend %diff-fontColor-ins;
  }
  &.del {
    @extend %diff-bgColor-del;
    @extend %diff-fontColor-del;
  }
  &.heading {
    padding-top: 1em;
    opacity: .33;
  }
}
</style>
