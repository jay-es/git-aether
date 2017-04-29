export default [
  {
    path: '/',
    name: 'landing-page',
    component: require('components/LandingPageView'),
  },
  {
    path: '/diff/:rowIndex',
    name: 'diff-page',
    component: require('components/DiffView'),
    props: true,
  },
  {
    path: '/edit-path',
    name: 'edit-path-page',
    component: require('components/EditPathView'),
  },
  {
    path: '/edit-command',
    name: 'edit-command-page',
    component: require('components/EditCommandView'),
  },
  {
    path: '*',
    redirect: '/',
  },
];
