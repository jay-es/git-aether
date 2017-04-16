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
    path: '*',
    redirect: '/',
  },
];
