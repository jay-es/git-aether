import Vue from 'vue';

const emptyData = {
  rep: null,
  index: 0,
  pathName: '',
  diffSummary: null,
  hasDiff: false,
  localBranches: [],
  trackingBranches: [],
  fetchLog: '',
  isFetching: false,
};

export default new Vue({
  data: {
    tableData: [],
  },
  methods: {
    /**
     * リポジトリの配列からtableDataを作成する
     * @public
     * @param {array} repos リポジトリの配列
     */
    initTable(repos) {
      const tableData = repos.map((rep, i) => Object.assign({}, emptyData, {
        rep,
        index: i,
        pathName: rep._baseDir,
      }));

      this.$set(this, 'tableData', tableData);
    },

    /**
     * ブランチを取得してリストを更新する
     * @public
     * @param {number} i リポジトリの番号
     * @return {promise}
     */
    getBranch(i) {
      return new Promise((resolve) => {
        this.tableData[i].rep.branch((err, sm) => {
          if (!err) {
            const localBranches = [];
            const trackingBranches = [];

            Object.values(sm.branches).forEach((branch) => {
              if (branch.name.substr(0, 8) === 'remotes/') {
                branch.name = branch.name.substr(8);
                trackingBranches.push(branch);
              } else {
                localBranches.push(branch);
              }
            });

            this.$set(this.tableData[i], 'localBranches', localBranches);
            this.$set(this.tableData[i], 'trackingBranches', trackingBranches);
          }

          resolve();
        });
      });
    },

    /**
     * 全リポジトリでgetBranchを実行する
     * @public
     * @return {promise}
     */
    getBranchAll() {
      return this.tableData.map((v, i) => this.getBranch(i));
    },

    /**
     * ローカルブランチを取得してリストを更新する
     * @public
     * @param {number} i リポジトリの番号
     * @return {promise}
     */
    getBranchLocal(i) {
      return new Promise((resolve) => {
        this.tableData[i].rep.branchLocal((err, sm) => {
          if (!err) {
            this.$set(this.tableData[i], 'localBranches', sm.branches);
          }

          resolve();
        });
      });
    },

    /**
     * diffの有無を確認する
     * @public
     * @param {number} i リポジトリの番号
     * @return {promise}
     */
    diffSummary(i) {
      return new Promise((resolve) => {
        this.tableData[i].rep.diffSummary((err, sm) => {
          if (!err) {
            this.tableData[i].diffSummary = sm;
            this.tableData[i].hasDiff = !!sm.files.length;
          }

          resolve();
        });
      });
    },

    /**
     * 全リポジトリでdiffを実行する
     * @public
     * @return {promise}
     */
    diffSummaryAll() {
      return this.tableData.map((v, i) => this.diffSummary(i));
    },

    /**
     * fetchしてログを更新する
     * @public
     * @param {number} i リポジトリの番号
     * @return {promise}
     */
    fetch(i) {
      return new Promise((resolve) => {
        this.tableData[i].isFetching = true;
        this.tableData[i].fetchLog = '';

        this.tableData[i].rep.fetch({
          '--all': null,
          '--prune': null,
        }, (err, sm) => {
          if (!err) {
            this.tableData[i].fetchLog = sm.raw;
            this.getBranch(i);
          }

          this.tableData[i].isFetching = false;
          resolve();
        });
      });
    },

    /**
     * 全リポジトリでfetchを実行する
     * @public
     * @return {promise}
     */
    fetchAll() {
      // return this.tableData.map((v, i) => this.fetch(i));
      // return this.tableData.reduce((p, c, i) => p.then(() => this.fetch(i)), Promise.resolve());

      return this.tableData.map((v, i) => (
        setTimeout(() => {
          this.fetch(i);
        }, i * 800)
      ));
    },
  },
  created() {
    window.addEventListener('focus', () => {
      this.getBranchAll();
      this.diffSummaryAll();
    });
  },
});
