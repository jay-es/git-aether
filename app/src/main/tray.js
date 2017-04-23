import path from 'path';
import { Tray } from 'electron';

import index from './index';

let tray = null;

// トレイを作成
const createTray = () => {
  const iconPath = path.join(__dirname, '../../dist/icon.ico');
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

export {
  createTray,
  destroyTray,
  isTrayActive,
};
