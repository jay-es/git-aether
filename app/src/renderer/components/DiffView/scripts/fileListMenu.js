import path from 'path';
import { shell, remote } from 'electron';
import store from '../../LandingPageView/scripts/store';
const { Menu, dialog } = remote;

export default (file, i, that) => {
  Menu.buildFromTemplate([
    {
      label: 'Discard Changes',
      click: () => {
        dialog.showMessageBox({
          type: 'question',
          message: 'Reset changes?',
          detail: `${file.path}\n\nContinue with resetting the current changes?`,
          buttons: ['Yes', 'No'],
        }, (res) => {
          // No なら終了
          if (res === 1) return;

          // 新規ファイルなら削除
          if (file.working_dir === '?') {
            const fullpath = `${that.row.pathName}/${file.path}`.replace(/\//g, path.sep);
            shell.moveItemToTrash(fullpath);
            return;
          }

          const options = ['checkout', file.path];
          that.row.rep.raw(options, (err) => {
            if (err) { dialog.showErrorBox('', err); return; }

            store.status(that.row.index);
          });
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
        that.row.rep.raw(options, (err) => {
          if (err) { dialog.showErrorBox('', err); return; }
        });
      },
    },
  ]).popup();
};
