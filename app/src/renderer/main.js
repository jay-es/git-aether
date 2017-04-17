import Vue from 'vue';
import Electron from 'vue-electron';
import Router from 'vue-router';

import App from './App';
import routes from './routes';

import './menu';

Vue.use(Electron);
Vue.use(Router);
Vue.config.debug = true;

const router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes,
});

/* eslint-disable no-new */
export default new Vue({
  router,
  ...App,
}).$mount('#app');


// ウィンドウのオブジェクトを取得
const win = require('electron').remote.getCurrentWindow();

// ウィンドウ位置を復元
if (localStorage.getItem('windowPosition')) {
  const [x, y, w, h] = JSON.parse(localStorage.getItem('windowPosition'));
  win.setPosition(x, y);
  win.setSize(w, h);
}

// クローズ時にウィンドウ位置を保存
win.on('close', () => {
  const data = [...win.getPosition(), ...win.getSize()];
  localStorage.setItem('windowPosition', JSON.stringify(data));
});

win.show();
