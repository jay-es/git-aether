<template>
  <tr class="EditPathView_Row">
    <td>
      <input type="text" class="input _pathName" placeholder="c:/path/to/repository" v-model="rowData.pathName" /><br>
      {{ caution }}
    </td>
    <td>
      <label>https://github.com/</label>
      <input type="text" class="input _github" placeholder="user/repository" v-model="rowData.github" />
    </td>
    <td>
      <button @click="move(rowIndex - 1)" :disabled="rowIndex === 0">↑</button>
      <button @click="move(rowIndex)" :disabled="rowIndex === pathList.length - 1">↓</button>
      <button @click="remove">Remove</button>
    </td>
  </tr>
</template>

<script>
  import repos from '../LandingPageView/scripts/repos';
  const { dialog } = require('electron').remote;

  export default {
    props: ['pathList', 'rowData', 'rowIndex'],
    data() {
      return {
        caution: '',
      };
    },
    methods: {
      // ひとつ下と入れ替える（-1でひとつ上と入れ替える処理になる）
      move(i) {
        this.pathList.splice(i, 2, this.pathList[i + 1], this.pathList[i]);
      },
      remove() {
        // データがない行だったら削除して終了
        if (!this.rowData.pathName && !this.rowData.github) {
          this.pathList.splice(this.rowIndex, 1);
          return;
        }

        // データがあったら確認ダイアログ
        dialog.showMessageBox({
          type: 'question',
          message: 'Remove this row?',
          buttons: ['Yes', 'No'],
        }, (res) => {
          // No なら終了
          if (res === 1) return;

          this.pathList.splice(this.rowIndex, 1);
        });
      },
    },
    watch: {
      'rowData.pathName': {
        handler(v) {
          if (!v) {
            this.caution = '';
            return;
          }

          repos.createGitInstance(v)
            .then(() => {
              this.caution = '';
            })
            .catch((err) => {
              this.caution = err;
            });
        },
        immediate: true,
      },
    },
  };
</script>

<style lang="scss">
.EditPathView_Row {
  .input {
    &._pathName {
      width: 18em;
    }
    &._github {
      width: 12em;
    }
  }
  label {
    font-size: 12px;
    opacity: .75;
  }
}
</style>
