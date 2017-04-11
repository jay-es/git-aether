<template>
  <ul class="list local-branch-list">
    <template v-for="branch in row.localBranches">
      <li
        :class="{
          'is-current': branch.current,
        }"
        @click="checkout(branch)"
        @contextmenu="menu(branch)"
      >
        {{ branch.name }}
      </li>
    </template>
    <!-- <commit-dialog
      ref="commitDialog"
      :rep="row.rep"
    ></commit-dialog> -->
  </ul>
</template>

<script>
  import eventHub from '../scripts/eventHub';
  const { Menu, dialog/* , BrowserWindow */ } = require('electron').remote;
  // const commitDialog = require('../components/commitDialog');

  export default {
    props: ['row'],
    // data() {
    //   return {
    //     targetBranch: null,
    //   };
    // },
    components: {
      // commitDialog,
    },
    methods: {
      checkout(branch) {
        if (branch.current) return;
        this.row.rep.checkout(branch.name, (err) => {
          if (err) {
            dialog.showErrorBox('', err);
            return;
          }

          this.$emit('update');
        });
      },
      menu(branch) {
        const listClass = this.$el.parentElement.classList;
        let sameNameRemote = null;
        this.row.trackingBranches.some((v) => {
          if (new RegExp(`/${branch.name}$`).test(v.name)) {
            sameNameRemote = v;
            return true;
          }
          return false;
        });

        Menu.buildFromTemplate([
          // カレント
  /*
          {
            label: 'Diff',
            click: () => {
              const win = new BrowserWindow({
                parent: BrowserWindow.getFocusedWindow(),
                modal: true,
                width: 1024,
                height: 800,
              });
              win.webContents.openDevTools();
              // win.setMenu(null);

              win.webContents.on('dom-ready', () => {
                win.webContents.send('childWin', this.row.rep._baseDir);
              });

              win.loadURL(`file://${__dirname}/../../../html/diff.html`);
            },
          },
          {
            label: 'Commit',
            enabled: branch.current && this.row.hasChanges,
            click: () => {
              this.$refs.commitDialog.$el.showModal();
            },
          },
  */
          {
            label: `Push (origin/${branch.name})`,
            enabled: branch.current,
            click: () => {
              listClass.add('is-processing');

              this.row.rep.push('origin', branch.name, (err) => {
                listClass.remove('is-processing');

                if (err) {
                  dialog.showErrorBox('', err);
                  return;
                }

                this.$emit('update');
              });
            },
          },
          {
            label: `Pull (origin/${branch.name})`,
            enabled: branch.current && !!sameNameRemote,
            click: () => {
              listClass.add('is-processing');

              this.row.rep.pull('origin', branch.name, (err, update) => {
                listClass.remove('is-processing');

                if (err) {
                  dialog.showErrorBox('', err);
                  return;
                }

                this.row.logText = update.summary;

                if (update && update.summary.changes) {
                  this.$emit('update');
                }
              });
            },
          },
          {
            label: 'Merge',
            enabled: branch.current,
            click: () => {
              eventHub.emit('mergeBranch', this.row.index, branch.name);
            },
          },

          { type: 'separator' },

          // カレントじゃない
          {
            label: 'Checkout',
            enabled: !branch.current,
            click: () => {
              this.checkout(branch);
            },
          },
          {
            label: 'Delete',
            enabled: !branch.current,
            click: () => {
              listClass.add('is-processing');

              this.row.rep.fetch({ '--all': null }, (err) => {
                if (err) {
                  dialog.showErrorBox('', err);
                }
              })
              .then(() => {
                this.row.rep.deleteLocalBranch(branch.name, (err) => {
                  listClass.remove('is-processing');

                  if (err) {
                    dialog.showErrorBox('', err);
                    return;
                  }

                  this.$emit('update');
                });
              });
            },
          },

          { type: 'separator' },

          // どちらでも
          {
            label: 'Rename',
            // enabled: !branch.current,
            click: () => {
              eventHub.emit('renameBranch', this.row.index, branch.name);
            },
          },
          {
            label: 'Create',
            click: () => {
              eventHub.emit('createBranch', this.row.index);
            },
          },
        ]).popup();
      },
    },
  };
</script>
