<template>
  <ul class="list command-list">
    <li><a href="#" :title="row.pathName" @click="openGui">Git GUI</a></li>
    <li><a href="#" :title="row.pathName" @click="openBash">Git Bash</a></li>
    <li><a href="#" :title="row.pathName" @click="openGitk">gitk</a></li>
  </ul>
</template>

<script>
  import { exec } from 'child_process';

  export default {
    props: ['row'],
    methods: {
      openBash() {
        exec(`start "" /D "${this.row.rep._baseDir}" "C:/Program Files/Git/git-bash.exe" `);
      },
      openGitk() {
        exec(`start "" /D "${this.row.rep._baseDir}" "gitk" `);
      },
      openGui() {
        this.row.rep.raw(['gui']);
      },
    },
  };
</script>
