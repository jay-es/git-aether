<template>
  <dialog @click.self="backdrop" @keyup.enter="exec">
    <header class="dialog-header">
      <b>Merge</b> &ndash; {{ row.pathName }}
    </header>

    <fieldset class="fieldset">
      <legend class="legend">Current Branch</legend>
      {{ branchName}}
    </fieldset>

    <fieldset class="fieldset">
      <legend class="legend">Branch To Merge</legend>
      <branch-list
        :row="row"
        :initial-value="targetBranch"
        :hidden-value="branchName"
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
        <input type="checkbox" class="checkbox" v-model="ffOnly" />
        FF Only
      </label>
      <label class="label">
        <input type="checkbox" class="checkbox" v-model="noCommit" />
        No FF &amp; No Commit
      </label>
    </fieldset>

    <footer class="dialog-footer">
      <button @click="closeDialog">Cancel</button>
      <button @click="exec">Merge</button>
    </footer>
  </dialog>
</template>

<script>
  import { backdrop, closeDialog, openDialog } from './helper';
  import BranchList from './BranchList';

  const { dialog } = require('electron').remote;

  const initialData = {
    targetBranch: 'origin/master',
    fetchingTrackingBranch: true,
    ffOnly: false,
    noCommit: false,
  };

  export default {
    props: ['row', 'branchName'],
    data() {
      return Object.assign({}, initialData);
    },
    computed: {
      isLocal() {
        return this.targetBranch.split('/').length === 1;
      },
    },
    components: {
      BranchList,
    },
    watch: {
      ffOnly(v) {
        if (v) this.noCommit = false;
      },
      noCommit(v) {
        if (v) this.ffOnly = false;
      },
    },
    methods: {
      backdrop,
      closeDialog,
      openDialog,
      exec() {
        const options = [this.targetBranch];

        if (this.ffOnly) {
          options.push('--ff-only');
        }

        if (this.noCommit) {
          options.push('--no-ff', '--no-commit');
        }

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
          .then(() => {
            this.row.rep.merge(options, (err, result) => {
              this.$el.classList.remove('is-processing');

              if (err) { dialog.showErrorBox('', err); return; }

              this.row.logText = result;
              this.closeDialog();
            });
          });
      },
      reset() {
        Object.keys(initialData).forEach((key) => {
          this.$set(this, key, initialData[key]);
        });
      },
    },
  };
</script>
