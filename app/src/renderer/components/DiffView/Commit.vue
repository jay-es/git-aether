<template>
  <div class="diff-view_commit">
    <textarea class="textarea diff-view_commit_textarea"
      placeholder="Commit Message"
      v-model="comment"
    ></textarea>

    <div class="diff-view_commit_buttons">
      <button class="block"
        :disabled="!comment"
        @click="commit"
      >Commit</button>
      <button class="block" @click="push">Push</button>
      <button class="block" @click="back">Back</button>
    </div>
  </div>
</template>

<script>
  const { dialog } = require('electron').remote;
  import store from '../LandingPageView/scripts/store';

  export default {
    props: ['currentFile', 'row'],
    data() {
      return {
        comment: '',
      };
    },
    methods: {
      commit() {
        this.row.rep.commit(this.comment, (err) => {
          if (err) { dialog.showErrorBox('', err); return; }

          store.status(this.row.index);
          this.comment = '';

          // コミット対象がDiff表示されていたらクリア
          if (this.currentFile.isCached) {
            this.currentFile.path = '';
          }
        });
      },
      push() {
        const listClass = document.documentElement.classList;
        listClass.add('is-processing');

        const currentBranch = this.row.localBranches.filter(v => v.current);
        if (!currentBranch) return;

        this.row.rep.push('origin', currentBranch[0].name, (err) => {
          if (err) { dialog.showErrorBox('', err); return; }

          listClass.remove('is-processing');
        });
      },
      back() {
        this.$router.go(-1);
      },
    },
  };
</script>

<style lang="scss">
.diff-view_commit {
  display: flex;
}
.diff-view_commit_textarea {
  flex-grow: 1;
  height: 74px;
  resize: none;
}
.diff-view_commit_buttons {
  padding-left: .25em;

  button {
    padding-top: 6px;
    padding-bottom: 6px;
  }
}
</style>
