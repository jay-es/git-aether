<template>
  <ul class="list command-list">
    <li v-for="com of commandList">
      <a href="#" :title="com.commandLine" @click="execCommand(com.commandLine)">{{ com.label }}</a>
    </li>
  </ul>
</template>

<script>
  import { exec } from 'child_process';

  export default {
    props: ['row', 'commandList'],
    methods: {
      execCommand(commandLine) {
        exec(commandLine, {
          cwd: this.row.pathName,
        });
      },
    },
  };
</script>
