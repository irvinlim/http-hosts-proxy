import Router from 'vue-router';
import Vue from 'vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: require('@/components/AppShell').default,
      children: [
        {
          path: '/',
          redirect: '/host-mappings',
        },
        {
          path: '/host-mappings',
          name: 'host-mappings',
          component: require('@/components/HostMappings').default,
        },
        {
          path: '/settings',
          name: 'settings',
          component: require('@/components/Settings').default,
        },
      ],
    },
  ],
});
