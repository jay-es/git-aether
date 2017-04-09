<template>
  <div @contextmenu="menu">
    {{ row.pathName }}<br>
    <p>{{ changes }}</p>
  </div>
</template>

<script>
  // import eventHub from '../scripts/eventHub';
  // const { Menu } = require('electron').remote;

  export default {
    props: ['row'],
    computed: {
      changes() {
        if (!this.row.diffSummary) return '';

        const num = this.row.diffSummary.files.length;
        if (num === 0) return 'no changes';
        if (num === 1) return '1 change';
        return `${num} changes`;
      },
    },
    methods: {
      menu() {
        // Menu.buildFromTemplate([
        //   {
        //     label: 'Create Branch',
        //     click: () => {
        //       eventHub.emit('createBranch', this.row.index);
        //     },
        //   },
        // ]).popup();
      },
    },
  };
</script>
