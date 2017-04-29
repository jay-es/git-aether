<template>
  <tr class="EditCommandView_Row">
    <td>
      <input type="text" class="input _label" v-model="rowData.label" /><br>
      {{ caution }}
    </td>
    <td>
      <input type="text" class="input _commandLine" v-model="rowData.commandLine" />
    </td>
    <td>
      <button @click="move(rowIndex - 1)" :disabled="rowIndex === 0">↑</button>
      <button @click="move(rowIndex)" :disabled="rowIndex === commandList.length - 1">↓</button>
      <button @click="remove">Remove</button>
    </td>
  </tr>
</template>

<script>
  const { dialog } = require('electron').remote;

  export default {
    props: ['commandList', 'rowData', 'rowIndex'],
    data() {
      return {
        caution: '',
      };
    },
    methods: {
      // ひとつ下と入れ替える（-1でひとつ上と入れ替える処理になる）
      move(i) {
        this.commandList.splice(i, 2, this.commandList[i + 1], this.commandList[i]);
      },
      remove() {
        // データがない行だったら削除して終了
        if (!this.rowData.label && !this.rowData.commandLine) {
          this.commandList.splice(this.rowIndex, 1);
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

          this.commandList.splice(this.rowIndex, 1);
        });
      },
    },
  };
</script>

<style lang="scss">
.EditCommandView_Row {
  .input {
    &._label {
      width: 10em;
    }
    &._commandLine {
      width: 30em;
    }
  }
}
</style>
