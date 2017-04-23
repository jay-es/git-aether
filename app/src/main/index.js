import path from 'path';
import { app, BrowserWindow, Tray } from 'electron';

let mainWindow;
const isDev = process.env.NODE_ENV === 'development';
const winURL = isDev
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 800,
    height: isDev ? 960 : 600,
    show: false,
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // eslint-disable-next-line no-console
  console.log('mainWindow opened');
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// タスクトレイ
let tray = null;
export function createTray() {
  const iconPath = path.join(__dirname, '../../dist/icon.ico');
  tray = new Tray(iconPath);
  tray.on('click', () => {
    mainWindow.focus();
  });
}
export function destroyTray() {
  tray.destroy();
}
export function isTrayActive() {
  if (tray === null) return false;
  return !tray.isDestroyed();
}
