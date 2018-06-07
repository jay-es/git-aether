const { dialog } = require('electron').remote;

export const gitRaw = (row, options) => (
  new Promise((resolve, reject) => {
    row.rep.raw(options, (err, data) => {
      if (err) {
        dialog.showErrorBox('', err);
        reject(err);
      }

      resolve(data);
    });
  })
);
