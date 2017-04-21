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

  const paths = JSON.parse(localStorage.getItem('paths')) || [];
  repos.init(paths);

  export default {
    name: 'landing-page',
    components: {
      ReposTable,
      Dialogs,
    },
  };
</script>
