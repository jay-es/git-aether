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


((win) => {
  // ウィンドウ位置を復元
  if (localStorage.getItem('winPos')) {
    const [x, y, w, h] = JSON.parse(localStorage.getItem('winPos'));
    win.setPosition(x, y);
    win.setSize(w, h);
  }

  // ウィンドウを表示
  win.show();

  // クローズ時にウィンドウ位置を保存
  window.addEventListener('beforeunload', () => {
    const data = [...win.getPosition(), ...win.getSize()];
    localStorage.setItem('winPos', JSON.stringify(data));
  });
})(require('electron').remote.getCurrentWindow());
