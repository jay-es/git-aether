import store from './store';

let timerId = null;

/**
 * 定時処理の内容を実行する
 * @public
 */
const run = () => {
  Promise.all([
    ...store.getBranchAll(),
    ...store.diffSummaryAll(),
    ...store.fetchAll(),
  ]);
};

/**
 * 定時処理のタイマーを中止する
 * @public
 */
const clearTimer = () => {
  clearInterval(timerId);
};

/**
 * 定時処理のタイマーを開始する
 * @public
 * @param {number} [interval = 5] 実行間隔（分）
 */
const startTimer = (interval = 5) => {
  clearTimer();
  run();
  timerId = setInterval(run, interval * 60000);
};


export default {
  run,
  clearTimer,
  startTimer,
};
