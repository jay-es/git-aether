const { Menu, dialog } = require('electron').remote;
import store from '../../LandingPageView/scripts/store';

export default (file, i, that) => {
  Menu.buildFromTemplate([
    {
      label: 'Discard Changes',
      click: () => {
        dialog.showMessageBox({
          type: 'question',
          message: 'Reset changes?',
          detail: 'Continue with resetting the current changes?',
          buttons: ['Yes', 'No'],
        }, (res) => {
          // No なら終了
          if (res === 1) return;

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
