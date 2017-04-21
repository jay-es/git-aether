<template>
  <div @contextmenu="menu">
    {{ row.pathName }}<br>
    <p class="changes">
      <template v-if="changesNum">
        <router-link :to="linkTo">{{ changesText }}</router-link>
      </template>
      <template v-else>
        {{ changesText }}
      </template>
    </p>
  </div>
</template>

<script>
  // import eventHub from '../scripts/eventHub';
  // const { Menu } = require('electron').remote;

  export default {
    props: ['row'],
    computed: {
      changesNum() {
        return this.row.statusSummary ? this.row.statusSummary.files.length : 0;
      },
      changesText() {
        if (this.changesNum === 0) return 'no changes';
        if (this.changesNum === 1) return '1 change';
        return `${this.changesNum} changes`;
      },
      linkTo() {
        return `/diff/${this.row.index}`;
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
