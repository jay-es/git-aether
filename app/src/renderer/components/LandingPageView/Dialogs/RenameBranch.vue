<template>
  <dialog @click.self="backdrop">
    <header class="dialog-header">
      <b>Rename Branch</b> &ndash; {{ row.pathName }}
    </header>

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

    <footer class="dialog-footer">
      <button @click="closeDialog">Cancel</button>
      <button @click="exec" :disabled="canExec">Rename</button>
    </footer>
  </dialog>
</template>

<script>
  import { gitRaw } from 'renderer/scripts/helpers';
  import store from '../scripts/store';
  import { backdrop, closeDialog, openDialog } from './helper';

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
      async exec() {
        await gitRaw(this.row, [
          'branch',
          '-m',
          this.branchName,
          this.newName,
        ]);

        store.getBranch(this.row.index);
        this.closeDialog();
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
