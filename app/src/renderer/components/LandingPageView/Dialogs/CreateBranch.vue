<template>
  <dialog @click.self="backdrop" @keyup.enter="canExec && exec()">
    <header class="dialog-header">
      <b>Create Branch</b> &ndash; {{ row.pathName }}
    </header>

    <fieldset class="fieldset">
      <legend class="legend">Branch Name</legend>
      <label class="label">
        <input type="radio" class="radio" value="auto" v-model="nameType" />
        Match Tracking Branch Name
      </label>
      <label class="label">
        <input type="radio" class="radio" value="manual" v-model="nameType" />
        Name: <input type="text" class="input CreateBramch_input" v-model="newBranchName" :disabled="nameType === 'auto'" />
      </label>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="legend">Starting Revision</legend>
      <branch-list
        :row="row"
        :initial-value="targetBranch"
        @input="v => targetBranch = v"
      ></branch-list>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="legend">Options</legend>
      <label class="label">
        <input type="checkbox" class="checkbox" v-model="fetchingTrackingBranch" :disabled="isLocal"/>
        Fetching Tracking Branch
      </label>
      <label class="label">
        <input type="checkbox" class="checkbox" v-model="createRemoteBranch" :disabled="nameType === 'auto'"/>
        Create Remote Branch
      </label>
    </fieldset>

    <footer class="dialog-footer">
      <span v-show="isAlreadyExists">A branch named '{{ newBranchName }}' already exists.</span>
      <button @click="closeDialog">Cancel</button>
      <button @click="exec" :disabled="!canExec">Create</button>
    </footer>
  </dialog>
</template>

<script>
  import store from '../scripts/store';
  import { backdrop, closeDialog, openDialog } from './helper';
  import BranchList from './BranchList';
  const { dialog } = require('electron').remote;

  function onChange() {
    if (this.nameType === 'manual') {
      this.createRemoteBranch = true;
      return;
    }

    this.createRemoteBranch = false;
    this.newBranchName = (this.targetBranch.substr(0, 7) === 'origin/')
        ? this.targetBranch.substr(7)
        : this.targetBranch;
  }

  const initialData = {
    nameType: 'auto',
    newBranchName: 'master',
    targetBranch: 'origin/master',
    fetchingTrackingBranch: true,
    createRemoteBranch: false,
  };

  export default {
    props: ['row'],
    data() {
      return Object.assign({}, initialData);
    },
    computed: {
      canExec() {
        return this.newBranchName && !this.isAlreadyExists;
      },
      isAlreadyExists() {
        return this.row.localBranches.some(v => v.name === this.newBranchName);
      },
      isLocal() {
        return this.targetBranch.split('/').length === 1;
      },
    },
    components: {
      BranchList,
    },
    methods: {
      backdrop,
      closeDialog,
      openDialog,
      exec() {
        this.$el.classList.add('is-processing');

        Promise.resolve()
          .then(() => {
            // ローカルか、feetchしない設定だったら終了
            if (this.isLocal || !this.fetchingTrackingBranch) return null;

            const split = this.targetBranch.split('/');
            return this.row.rep.fetch(split[0], split[1], (err) => {
              if (err) { dialog.showErrorBox('', err); return; }
            });
          })
          .then(() => (
            this.row.rep.checkoutBranch(this.newBranchName, this.targetBranch, (err) => {
              this.$el.classList.remove('is-processing');

              if (err) { dialog.showErrorBox('', err); return; }

              store.getBranch(this.row.index);
              this.closeDialog();
            })
          ))
          .then(() => {
            if (!this.createRemoteBranch) return null;

            return this.row.rep.push('origin', this.newBranchName, { '-u': null }, (err) => {
              if (err) { dialog.showErrorBox('', err); return; }
              store.getBranch(this.row.index);
            });
          });
      },
      reset() {
        Object.keys(initialData).forEach((key) => {
          this.$set(this, key, initialData[key]);
        });
      },
    },
    watch: {
      nameType: onChange,
      targetBranch: onChange,
    },
  };
</script>

<style lang="scss">
.CreateBramch_input {
  width: 25em;
}
</style>
