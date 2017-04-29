import path from 'path';
import { Tray, ipcMain } from 'electron';

import index from './index';

const isDev = process.env.NODE_ENV === 'development';
const iconPath = path.join(__dirname, isDev ? '../../dist/icon48.ico' : './icon48.ico');
let tray = null;

// トレイを作成
const createTray = () => {
  tray = new Tray(iconPath);

  tray.on('click', () => {
    const mainWindow = index.getMainWindow();
    if (mainWindow) {
      mainWindow.focus();
    }
  });
};

// トレイを破棄
const destroyTray = () => {
  tray.destroy();
};

// トレイがアクティブかどうか
const isTrayActive = () => {
  if (tray === null) return false;
  return !tray.isDestroyed();
};


ipcMain.on('createTray', createTray);
ipcMain.on('destroyTray', destroyTray);
ipcMain.on('isTrayActive', (e) => {
  e.returnValue = isTrayActive();
});
