<template>
  <div>
    <repos-table></repos-table>
    <dialogs></dialogs>
  </div>
</template>

<script>
  import repos from './LandingPageView/scripts/repos';
  import ReposTable from './LandingPageView/ReposTable';
  import Dialogs from './LandingPageView/Dialogs';

  const pathList = JSON.parse(localStorage.getItem('pathList')) || [];
  repos.init(pathList);

  export default {
    name: 'landing-page',
    components: {
      ReposTable,
      Dialogs,
    },
  };
</script>
