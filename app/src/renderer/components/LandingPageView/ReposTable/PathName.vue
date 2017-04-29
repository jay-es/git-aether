<template>
  <div @contextmenu.self="menu">
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
  import { remote, shell } from 'electron';
  import store from '../scripts/store';
  const { Menu } = remote;

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
        const menuTmpl = [{
          label: 'Git',
          submenu: [
            {
              label: 'fetch --all --prune',
              click: () => store.fetch(this.row.index),
            },
          ],
        }];

        if (this.row.github) {
          const githubUrl = `https://github.com/${this.row.github}`;
          menuTmpl.push({
            label: 'GitHub',
            submenu: [
              {
                label: 'Home',
                click: () => shell.openExternal(githubUrl),
              },
              {
                label: 'Branches',
                click: () => shell.openExternal(`${githubUrl}/branches`),
              },
              {
                label: 'Issues',
                click: () => shell.openExternal(`${githubUrl}/issues`),
              },
              {
                label: 'Pull requests',
                click: () => shell.openExternal(`${githubUrl}/pulls`),
              },
            ],
          });
        }

        Menu.buildFromTemplate(menuTmpl).popup();
      },
    },
  };
</script>
