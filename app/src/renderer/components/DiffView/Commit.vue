<template>
  <div class="diff-view_commit">
    <textarea class="textarea diff-view_commit_textarea"
      placeholder="Commit Message"
      v-model="comment"
    ></textarea>

    <div class="diff-view_commit_buttons">
      <button class="block" @click="remote('pull')">Pull</button>
      <button class="block"
        :disabled="!comment || !hasStaged"
        @click="commit"
      >Commit</button>
      <button class="block" @click="remote('push')">Push</button>
      <button class="block" @click="back">Back</button>
    </div>
  </div>
</template>

<script>
  const { dialog } = require('electron').remote;
  import store from '../LandingPageView/scripts/store';

  export default {
    props: ['currentFile', 'hasStaged', 'row'],
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
      remote(methodName) {
        const listClass = this.$el.classList;
        listClass.add('is-processing');

        const currentBranch = this.row.localBranches.find(v => v.current);
        if (!currentBranch) return;

        this.row.rep[methodName]('origin', currentBranch.name, (err) => {
          if (err) { dialog.showErrorBox('', err); }

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
    line-height: 14px;
  }
}
</style>
