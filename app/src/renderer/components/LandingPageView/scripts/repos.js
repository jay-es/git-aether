import fs from 'fs';
import git from 'simple-git';
import { remote } from 'electron';
const { dialog } = remote;

import store from './store';
import sync from './sync';

const repos = [];

/**
 * 実在するディレクトリかどうか
 * @private
 * @param {string} path 調べるパス
 * @return {boolean}
 */
const isDirectory = path => fs.existsSync(path) && fs.statSync(path).isDirectory();

/**
 * Gitインスタンスを作成する
 * @private
 * @param {string} path リポジトリのパス
 * @return {promise}
 */
const createGitInstance = path => (
  new Promise((resolve, reject) => {
    // ディレクトリではない場合
    if (!isDirectory(path)) {
      reject('Not a directory');
      return;
    }

    const rep = git(path).silent(true);
    rep.branchLocal((err) => {
      if (err) {
        reject('Not a git repository');
        return;
      }

      resolve([rep]); // そのまま渡せないので配列にする
    });
  })
);

/**
 * パスの配列からGitインスタンスの配列を作る
 * @public
 * @param {array} paths パス文字列の配列
 * @return {promise}
 */
repos.init = (paths) => {
  const errors = [];
  repos.length = 0;

  const promises = paths.map((path, i) => (
    createGitInstance(path)
      .then((rep) => {
        repos[i] = rep[0];
      })
      .catch((err) => {
        repos[i] = null;
        errors[i] = `${err}: "${path}"`;
      })
  ));

  return Promise.all(promises)
    .then(() => {
      // null以外の配列に作り直す
      const tmp = repos.filter(v => v !== null);
      repos.splice(0, repos.length, ...tmp);

      // エラーがある場合
      if (errors.length) {
        dialog.showMessageBox({
          type: 'warning',
          message: 'Skipped',
          detail: errors.filter(v => v).join('\n'),
        });
      }
    })
    .then(() => {
      store.initTable(repos);
      sync.startTimer();
    });
};


export default repos;
