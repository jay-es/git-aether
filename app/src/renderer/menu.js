import { remote, ipcRenderer, shell } from 'electron';
const { Menu } = remote;

import main from './main';

const appMenu = Menu.buildFromTemplate([
  {
    label: 'File',
    submenu: [
      {
        role: 'quit',
        accelerator: 'CmdOrCtrl+Q',
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Path List',
        click() {
          main.$router.push('/edit-path');
        },
      },
      {
        label: 'Command List',
        click() {
          main.$router.push('/edit-command');
        },
      },
    ],
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },

      { type: 'separator' },

      {
        label: 'Dark Theme',
        type: 'checkbox',
        click(item) {
          document.documentElement.classList.toggle('dark', item.checked);
          localStorage.setItem('dark', item.checked);
        },
        checked: (() => {
          if (!localStorage.getItem('dark')) {
            localStorage.setItem('dark', true);
          }
          const isChecked = localStorage.getItem('dark') === 'true';
          return document.documentElement.classList.toggle('dark', isChecked);
        })(),
      },
      {
        label: 'Skip Taskbar',
        type: 'checkbox',
        click(item) {
          const win = remote.getCurrentWindow();
          win.setSkipTaskbar(item.checked);
          ipcRenderer.send(item.checked ? 'createTray' : 'destroyTray');
        },
        checked: ipcRenderer.sendSync('isTrayActive'),
      },
    ],
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'Readme',
        click() {
          shell.openExternal('https://github.com/jshindo-gladd/git-aether');
        },
      },
      {
        visible: false,
        label: 'Back',
        accelerator: 'Alt+Left',
        click() {
          main.$router.go(-1);
        },
      },
      {
        visible: false,
        label: 'Forward',
        accelerator: 'Alt+Right',
        click() {
          main.$router.go(1);
        },
      },
    ],
  },
]);

Menu.setApplicationMenu(appMenu);


// テキスト入力
const contextMenu = Menu.buildFromTemplate([
  { role: 'cut' },
  { role: 'copy' },
  { role: 'paste' },
  { role: 'delete' },
]);

document.addEventListener('contextmenu', (e) => {
  const el = e.target;

  if (el.disabled) return;

  if (el.classList.contains('input') || el.classList.contains('textarea')) {
    contextMenu.popup();
  }
});
