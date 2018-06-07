import path from 'path';
import { shell, remote } from 'electron';
import { gitRaw } from 'renderer/scripts/helpers';
import store from '../../LandingPageView/scripts/store';
const { Menu, dialog } = remote;

export default (file, i, that) => {
  Menu.buildFromTemplate([
    {
      label: 'Discard Changes',
      enabled: !file.hasStaged,
      click: () => {
        dialog.showMessageBox({
          type: 'question',
          message: 'Reset changes?',
          detail: `${file.path}\n\nContinue with resetting the current changes?`,
          buttons: ['Yes', 'No'],
        }, async (res) => {
          // No なら終了
          if (res === 1) return;

          // 新規ファイルなら削除
          if (file.working_dir === '?') {
            const fullpath = `${that.row.pathName}/${file.path}`.replace(/\//g, path.sep);
            shell.moveItemToTrash(fullpath);
            return;
          }

          await gitRaw(that.row, ['checkout', file.path]);
          store.status(that.row.index);
        });
      },
    },
    {
      label: 'Difftool',
      click: () => {
        const options = ['difftool', file.path];

        if (file.hasStaged) {
          options.splice(1, 0, '--cached');
        }

        gitRaw(that.row, options);
      },
    },
  ]).popup();
};
