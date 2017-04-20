<template>
  <dialog @click.self="backdrop">
    <div>
      <label class="label RenameBranch_label">Branch:</label>
      <select class="select RenameBranch_select">
        <template v-for="branch in row.localBranches">
          <option :value="branch.name" :selected="branch.name === branchName">{{ branch.name }}</option>
        </template>
      </select>
    </div>
    <div>
      <label class="label RenameBranch_label">New Name:</label>
      <input type="text" class="input RenameBranch_input" v-model="newName" @keyup.enter="exec"/>
    </div>

    <div class="dialog-footer">
      <button @click="closeDialog">Cancel</button>
      <button @click="exec" :disabled="canExec">Rename</button>
    </div>
  </dialog>
</template>

<script>
  import store from '../scripts/store';
  import { backdrop, closeDialog, openDialog } from './helper';
  const { dialog } = require('electron').remote;

  export default {
    props: ['row', 'branchName'],
    data() {
      return {
        newName: '',
      };
    },
    computed: {
      canExec() {
        return !this.newName;
      },
    },
    methods: {
      backdrop,
      closeDialog,
      openDialog,
      exec() {
        this.row.rep.raw([
          'branch',
          '-m',
          this.branchName,
          this.newName,
        ], (err) => {
          if (err) { dialog.showErrorBox('', err); return; }

          store.getBranch(this.row.index);
          this.closeDialog();
        });
      },
      reset() {
        this.newName = '';
      },
    },
  };
</script>

<style lang="scss">
.RenameBranch_label {
  display: inline-block;
  width: 70px;
}
.RenameBranch_input,
.RenameBranch_select {
  box-sizing: border-box;
  width: 240px;
}

</style>
